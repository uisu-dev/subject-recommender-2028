"use client";

import { useCallback, useEffect, useState } from "react";

type Post = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
};

type Props = {
  adminMode: boolean;
};

const PAGE_SIZE = 20;
const MAX_TITLE = 80;
const MAX_BODY = 2000;

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  const d = new Date(ms);
  return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d
    .getDate()
    .toString()
    .padStart(2, "0")}`;
}

export default function Board({ adminMode }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [openedId, setOpenedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async (cursor = 0, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/board/list?cursor=${cursor}&limit=${PAGE_SIZE}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "불러오기 실패");
        return;
      }
      setPosts((prev) =>
        append ? [...prev, ...(data.posts || [])] : data.posts || []
      );
      setHasMore(!!data.hasMore);
    } catch (e: any) {
      setError(e?.message || "네트워크 오류");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts(0, false);
  }, [loadPosts]);

  const handleDelete = async (id: string) => {
    if (!confirm("이 글을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/board/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("삭제 실패. 관리자 로그인 상태를 확인하세요.");
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (openedId === id) setOpenedId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink-900">게시판</h2>
          <p className="text-xs text-ink-500">
            익명으로 자유롭게 글을 남길 수 있습니다. 욕설·비속어가 포함된 글은
            등록되지 않습니다.
          </p>
        </div>
        <button
          onClick={() => setComposeOpen(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
        >
          ✏️ 글쓰기
        </button>
      </div>

      {error && (
        <p className="rounded bg-rose-50 px-3 py-2 text-xs text-rose-700">
          ⚠ {error}
        </p>
      )}

      {posts.length === 0 && !loading ? (
        <div className="rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">
          아직 게시글이 없습니다. 첫 글을 작성해보세요.
        </div>
      ) : (
        <ul className="space-y-2">
          {posts.map((p) => {
            const opened = openedId === p.id;
            return (
              <li
                key={p.id}
                className="rounded-lg border border-ink-200 bg-white shadow-sm"
              >
                <div
                  className="flex cursor-pointer items-start gap-3 p-4 hover:bg-ink-50/50"
                  onClick={() => setOpenedId(opened ? null : p.id)}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-ink-900">
                      {p.title}
                    </h3>
                    <div className="mt-0.5 flex items-baseline gap-2 text-[11px] text-ink-500">
                      <span>익명</span>
                      <span>·</span>
                      <span>{timeAgo(p.createdAt)}</span>
                    </div>
                    {!opened && (
                      <p className="mt-1.5 line-clamp-2 text-xs text-ink-700">
                        {p.body}
                      </p>
                    )}
                    {opened && (
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-900">
                        {p.body}
                      </p>
                    )}
                  </div>
                  {adminMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p.id);
                      }}
                      className="shrink-0 rounded border border-rose-200 bg-white px-2 py-1 text-[10px] text-rose-600 hover:bg-rose-50"
                      title="관리자: 삭제"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {hasMore && !loading && (
        <div className="text-center">
          <button
            onClick={() => loadPosts(posts.length, true)}
            className="rounded-md border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 hover:bg-ink-100"
          >
            더 보기
          </button>
        </div>
      )}

      {loading && posts.length === 0 && (
        <div className="text-center text-xs text-ink-500">불러오는 중…</div>
      )}

      {composeOpen && (
        <ComposeModal
          onClose={() => setComposeOpen(false)}
          onSuccess={(post) => {
            setPosts((prev) => [post, ...prev]);
            setComposeOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ComposeModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (post: Post) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = async () => {
    if (submitting) return;
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!body.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/board/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "등록 실패");
        return;
      }
      onSuccess(data.post);
    } catch (e: any) {
      setError(e?.message || "네트워크 오류");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-ink-900/60 p-2 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-xl bg-white shadow-2xl"
      >
        <header className="border-b border-ink-200 px-5 py-3">
          <h2 className="text-base font-bold text-ink-900">새 글 작성</h2>
          <p className="text-xs text-ink-500">
            익명으로 등록됩니다. 욕설·비속어가 포함되면 등록되지 않습니다.
          </p>
        </header>
        <div className="space-y-3 p-5">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
              제목 ({title.length}/{MAX_TITLE})
            </span>
            <input
              type="text"
              value={title}
              maxLength={MAX_TITLE}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="mt-0.5 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
              내용 ({body.length}/{MAX_BODY})
            </span>
            <textarea
              value={body}
              maxLength={MAX_BODY}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="내용을 입력하세요. 줄바꿈은 그대로 표시됩니다."
              className="mt-0.5 w-full resize-y rounded-md border border-ink-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200"
            />
          </label>
          {error && (
            <p className="rounded bg-rose-50 px-3 py-2 text-xs text-rose-700">
              ⚠ {error}
            </p>
          )}
        </div>
        <footer className="flex items-center justify-end gap-2 border-t border-ink-200 bg-ink-50 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-md border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 hover:bg-ink-100"
          >
            취소
          </button>
          <button
            onClick={submit}
            disabled={submitting || !title.trim() || !body.trim()}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-40"
          >
            {submitting ? "등록 중…" : "등록"}
          </button>
        </footer>
      </div>
    </div>
  );
}
