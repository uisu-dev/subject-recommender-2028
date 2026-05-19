"use client";

import { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function SearchBox({ value, onChange }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className="relative">
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="대학명 또는 학과명 검색 (예: 서울대, 컴퓨터공학, 의예)"
        className="w-full rounded-xl border border-ink-200 bg-white px-5 py-4 text-base placeholder:text-ink-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-sm text-ink-500 hover:bg-ink-100"
          aria-label="검색어 지우기"
        >
          ✕
        </button>
      )}
    </div>
  );
}
