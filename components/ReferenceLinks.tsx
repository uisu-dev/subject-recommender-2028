"use client";

import { CONTACT_EMAIL } from "@/lib/schools";

type Site = {
  name: string;
  description: string;
  url: string;
  /** Short label for the colored badge */
  initial: string;
  /** Tailwind color classes for the badge: bg + text */
  badgeClass: string;
};

const SITES: Site[] = [
  {
    name: "대입정보포털 어디가",
    description:
      "한국대학교육협의회 공식 운영. 전형 일정·모집요강·입시 통계의 표준 자료.",
    url: "https://www.adiga.kr",
    initial: "어",
    badgeClass: "bg-orange-100 text-orange-700",
  },
  {
    name: "대학알리미",
    description:
      "교육부·대학교육협의회 공시 정보. 재학생 수, 등록금, 취업률, 장학금 등.",
    url: "https://www.academyinfo.go.kr",
    initial: "대",
    badgeClass: "bg-sky-100 text-sky-700",
  },
  {
    name: "EBSi 입시정보",
    description:
      "EBS 운영 입시 포털. 수능·내신 강의, 모의지원, 대학별 전형 분석.",
    url: "https://www.ebsi.co.kr",
    initial: "E",
    badgeClass: "bg-rose-100 text-rose-700",
  },
  {
    name: "커리어넷",
    description:
      "한국직업능력연구원 운영. 직업·학과 정보, 적성·흥미 검사, 진로 상담.",
    url: "https://www.career.go.kr",
    initial: "C",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
];

function domain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ReferenceLinks() {
  const emailSubject = encodeURIComponent("[2028 권장과목] 참고 사이트 추가 요청");
  const emailBody = encodeURIComponent(
    [
      "추가를 희망하는 사이트:",
      "- 이름:",
      "- URL:",
      "- 간단 소개:",
      "",
      "요청자 (선생님 성함):",
    ].join("\n")
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4">
        <h3 className="text-sm font-bold text-indigo-900">
          사이트 추가를 희망하시면
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-ink-700">
          아래 이메일로 사이트 이름과 URL을 보내주시면 검토 후 반영해드립니다.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${emailSubject}&body=${emailBody}`}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-700 hover:underline"
        >
          ✉ {CONTACT_EMAIL}
        </a>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {SITES.map((site) => (
          <li key={site.url}>
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-start gap-3 rounded-xl border border-ink-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${site.badgeClass}`}
                aria-hidden="true"
              >
                {site.initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-ink-900 group-hover:text-indigo-700">
                    {site.name}
                  </h4>
                  <ExternalIcon className="shrink-0 text-ink-300 group-hover:text-indigo-600" />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink-700">
                  {site.description}
                </p>
                <p className="mt-1.5 truncate text-[11px] text-ink-500">
                  {domain(site.url)}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <p className="rounded-md bg-ink-50 p-3 text-[11px] leading-relaxed text-ink-700">
        ※ 외부 사이트의 정보는 해당 기관이 관리합니다. 새 창으로 열립니다.
      </p>
    </div>
  );
}

function ExternalIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
