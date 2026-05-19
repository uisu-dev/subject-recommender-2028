import { NextResponse } from "next/server";
import { getSessionFromRequest, verifySession } from "@/lib/admin-auth";
import { SUBJECTS } from "@/lib/subjects";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OWNER = "uisu-dev";
const REPO = "subject-recommender-2028";
const FILE_PATH = "data/schools.json";
const BRANCH = "main";

type IncomingSchool = {
  id?: unknown;
  name?: unknown;
  offeredSubjects?: unknown;
};

function validateSchools(raw: unknown):
  | { ok: true; schools: Array<{ id: string; name: string; offeredSubjects: string[] }> }
  | { ok: false; error: string } {
  if (!Array.isArray(raw)) return { ok: false, error: "schools는 배열이어야 합니다." };
  const validSubjectNames = new Set(SUBJECTS.map((s) => s.name));
  const ids = new Set<string>();
  const cleaned: Array<{ id: string; name: string; offeredSubjects: string[] }> = [];
  for (const item of raw as IncomingSchool[]) {
    if (
      !item ||
      typeof item.id !== "string" ||
      !item.id.trim() ||
      typeof item.name !== "string" ||
      !item.name.trim() ||
      !Array.isArray(item.offeredSubjects)
    ) {
      return { ok: false, error: "각 학교는 id, name, offeredSubjects 필드가 필요합니다." };
    }
    const id = item.id.trim();
    if (ids.has(id)) return { ok: false, error: `중복된 id: ${id}` };
    ids.add(id);
    const subjects: string[] = [];
    for (const subj of item.offeredSubjects) {
      if (typeof subj !== "string") {
        return { ok: false, error: `학교 ${item.name}: 과목명은 문자열이어야 합니다.` };
      }
      if (!validSubjectNames.has(subj)) {
        return { ok: false, error: `학교 ${item.name}: 알 수 없는 과목명 "${subj}"` };
      }
      subjects.push(subj);
    }
    cleaned.push({ id, name: item.name.trim(), offeredSubjects: subjects });
  }
  return { ok: true, schools: cleaned };
}

async function githubRequest(
  path: string,
  init: RequestInit & { token: string }
): Promise<Response> {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${init.token}`,
      "Content-Type": "application/json",
      "User-Agent": "subject-recommender-2028-admin",
      ...(init.headers || {}),
    },
  });
}

export async function PUT(request: Request) {
  // Auth gate
  const cookieToken = getSessionFromRequest(request);
  if (!verifySession(cookieToken)) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN 환경변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  let body: { schools?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const validated = validateSchools(body.schools);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  // Sort by name (Korean locale) for stable diffs
  validated.schools.sort((a, b) => a.name.localeCompare(b.name, "ko"));
  const newContent = JSON.stringify(validated.schools, null, 2) + "\n";
  const encoded = Buffer.from(newContent, "utf-8").toString("base64");

  // Step 1: GET current file SHA (required by GitHub PUT contents API)
  let sha: string | undefined;
  try {
    const getRes = await githubRequest(
      `/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
      { method: "GET", token: githubToken }
    );
    if (getRes.status === 404) {
      sha = undefined; // file doesn't exist yet; create new
    } else if (!getRes.ok) {
      const text = await getRes.text();
      return NextResponse.json(
        { error: `GitHub get failed: ${getRes.status} ${text.slice(0, 200)}` },
        { status: 502 }
      );
    } else {
      const fileInfo: any = await getRes.json();
      sha = fileInfo.sha;
    }
  } catch (e: any) {
    return NextResponse.json(
      { error: `GitHub network error: ${e?.message || e}` },
      { status: 502 }
    );
  }

  // Step 2: PUT new file content
  try {
    const putRes = await githubRequest(`/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
      method: "PUT",
      token: githubToken,
      body: JSON.stringify({
        message: `admin: schools.json 업데이트 (${validated.schools.length}개 학교)`,
        content: encoded,
        branch: BRANCH,
        sha,
        committer: {
          name: "subject-recommender-admin",
          email: "uisu@kakao.com",
        },
      }),
    });

    if (!putRes.ok) {
      const text = await putRes.text();
      return NextResponse.json(
        { error: `GitHub commit failed: ${putRes.status} ${text.slice(0, 300)}` },
        { status: 502 }
      );
    }
  } catch (e: any) {
    return NextResponse.json(
      { error: `GitHub network error: ${e?.message || e}` },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    schoolCount: validated.schools.length,
    message:
      "GitHub 저장 완료. Vercel 자동 재배포가 1~2분 뒤 라이브에 반영됩니다.",
  });
}
