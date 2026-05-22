/**
 * Anonymous board backend — server only.
 *
 * Storage: Upstash Redis (shared with stats system).
 *   - board:posts:ids → ZSET   member=postId, score=createdAt ms
 *   - board:post:<id> → HASH   { title, body, createdAt }
 *
 * Lookups use ZREVRANGEBYSCORE for pagination (latest first).
 */

import { Redis } from "@upstash/redis";

export type BoardPost = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  /** Total number of comments. Only filled by listPosts. */
  commentCount?: number;
};

export type BoardComment = {
  id: string;
  postId: string;
  body: string;
  createdAt: number;
};

function getClient(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const ZSET_KEY = "board:posts:ids";
const HASH_KEY = (id: string) => `board:post:${id}`;
const COMMENTS_ZSET_KEY = (postId: string) =>
  `board:post:${postId}:comments`;
const COMMENT_HASH_KEY = (commentId: string) => `board:comment:${commentId}`;

const MAX_TITLE = 80;
const MAX_BODY = 2000;
const MAX_COMMENT = 500;

function newPostId(): string {
  // 12 hex chars (~48 bits) of entropy — plenty for collision safety
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function newCommentId(): string {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function sanitizeInput(s: string, max: number): string {
  return String(s ?? "")
    .trim()
    .slice(0, max);
}

export async function createPost(input: {
  title: string;
  body: string;
}): Promise<BoardPost | { error: string }> {
  const redis = getClient();
  if (!redis) return { error: "stats/board 백엔드가 설정되지 않았습니다." };

  const title = sanitizeInput(input.title, MAX_TITLE);
  const body = sanitizeInput(input.body, MAX_BODY);
  if (!title) return { error: "제목을 입력해주세요." };
  if (!body) return { error: "내용을 입력해주세요." };

  const id = newPostId();
  const createdAt = Date.now();

  await redis.hset(HASH_KEY(id), { title, body, createdAt: String(createdAt) });
  await redis.zadd(ZSET_KEY, { score: createdAt, member: id });

  return { id, title, body, createdAt };
}

export async function listPosts(
  cursor: number,
  limit: number
): Promise<{ posts: BoardPost[]; hasMore: boolean }> {
  const redis = getClient();
  if (!redis) return { posts: [], hasMore: false };

  // Cap inputs
  const start = Math.max(0, Math.floor(cursor));
  const take = Math.min(50, Math.max(1, Math.floor(limit)));

  // Fetch ids in reverse chronological order
  const ids = (await redis.zrange<string[]>(ZSET_KEY, start, start + take, {
    rev: true,
  })) as string[];

  if (!ids || ids.length === 0) return { posts: [], hasMore: false };

  const hasMore = ids.length > take;
  const pageIds = ids.slice(0, take);

  // Fetch each post's hash + comment count. Could pipeline for perf; small N
  // so plain loop is fine for the 20-per-page workload.
  const posts: BoardPost[] = [];
  for (const id of pageIds) {
    const raw = await redis.hgetall<Record<string, string>>(HASH_KEY(id));
    if (raw && raw.title) {
      const commentCount = (await redis.zcard(COMMENTS_ZSET_KEY(id))) || 0;
      posts.push({
        id,
        title: String(raw.title),
        body: String(raw.body || ""),
        createdAt: Number(raw.createdAt) || 0,
        commentCount,
      });
    }
  }

  return { posts, hasMore };
}

export async function deletePost(id: string): Promise<boolean> {
  const redis = getClient();
  if (!redis) return false;
  if (!id || !/^[a-z0-9]+$/i.test(id)) return false;
  // Also clean up comments under this post
  const ids = (await redis.zrange<string[]>(
    COMMENTS_ZSET_KEY(id),
    0,
    -1
  )) as string[];
  for (const cid of ids || []) {
    await redis.del(COMMENT_HASH_KEY(cid));
  }
  await redis.del(COMMENTS_ZSET_KEY(id));
  await redis.del(HASH_KEY(id));
  await redis.zrem(ZSET_KEY, id);
  return true;
}

/** Whether a post id exists (used to guard comment creation). */
export async function postExists(postId: string): Promise<boolean> {
  const redis = getClient();
  if (!redis) return false;
  if (!postId || !/^[a-z0-9]+$/i.test(postId)) return false;
  const exists = await redis.exists(HASH_KEY(postId));
  return exists === 1;
}

export async function createComment(
  postId: string,
  body: string
): Promise<BoardComment | { error: string }> {
  const redis = getClient();
  if (!redis) return { error: "백엔드 미설정" };
  if (!postId || !/^[a-z0-9]+$/i.test(postId)) return { error: "잘못된 글 id" };
  const exists = await redis.exists(HASH_KEY(postId));
  if (exists !== 1) return { error: "존재하지 않는 글입니다." };

  const trimmed = sanitizeInput(body, MAX_COMMENT);
  if (!trimmed) return { error: "댓글 내용을 입력해주세요." };

  const id = newCommentId();
  const createdAt = Date.now();
  await redis.hset(COMMENT_HASH_KEY(id), {
    postId,
    body: trimmed,
    createdAt: String(createdAt),
  });
  await redis.zadd(COMMENTS_ZSET_KEY(postId), { score: createdAt, member: id });

  return { id, postId, body: trimmed, createdAt };
}

export async function listComments(postId: string): Promise<BoardComment[]> {
  const redis = getClient();
  if (!redis) return [];
  if (!postId || !/^[a-z0-9]+$/i.test(postId)) return [];

  // Chronological order (oldest first feels more natural for threaded chat)
  const ids = (await redis.zrange<string[]>(
    COMMENTS_ZSET_KEY(postId),
    0,
    -1
  )) as string[];
  if (!ids || ids.length === 0) return [];

  const out: BoardComment[] = [];
  for (const id of ids) {
    const raw = await redis.hgetall<Record<string, string>>(
      COMMENT_HASH_KEY(id)
    );
    if (raw && raw.body) {
      out.push({
        id,
        postId,
        body: String(raw.body),
        createdAt: Number(raw.createdAt) || 0,
      });
    }
  }
  return out;
}

export async function deleteComment(
  postId: string,
  commentId: string
): Promise<boolean> {
  const redis = getClient();
  if (!redis) return false;
  if (!commentId || !/^[a-z0-9]+$/i.test(commentId)) return false;
  await redis.del(COMMENT_HASH_KEY(commentId));
  await redis.zrem(COMMENTS_ZSET_KEY(postId), commentId);
  return true;
}
