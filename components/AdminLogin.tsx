"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onSuccess: () => void;
  onClose: () => void;
};

export default function AdminLogin({ onSuccess, onClose }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
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
    if (submitting || !password) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `로그인 실패 (${res.status})`);
        setSubmitting(false);
        return;
      }
      onSuccess();
    } catch (e: any) {
      setError(e?.message || "네트워크 오류");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-ink-900/60" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-ink-900">관리자 로그인</h2>
        <p className="mt-1 text-xs text-ink-500">
          학교 정보 편집은 관리자만 가능합니다.
        </p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200"
            autoComplete="current-password"
          />
          {error && (
            <p className="rounded bg-rose-50 px-2 py-1 text-xs text-rose-700">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!password || submitting}
              className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? "로그인 중..." : "로그인"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 hover:bg-ink-100"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
