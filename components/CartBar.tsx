"use client";

import type { CartItem } from "@/lib/types";

type Props = {
  items: CartItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
};

export default function CartBar({ items, onRemove, onClear, onCompare }: Props) {
  if (items.length === 0) return null;
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-ink-200 bg-white/95 backdrop-blur shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">
            {items.length}
          </span>
          <span className="text-sm font-medium text-ink-900">
            비교 카트 (최대 4개)
          </span>
        </div>
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
          {items.map((it) => {
            const dept =
              [it.row.단과대_계열, it.row.학과].filter(Boolean).join(" · ") ||
              "—";
            return (
              <div
                key={it.id}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-xs"
              >
                <span className="font-semibold text-ink-900">
                  {it.row.대학명}
                </span>
                <span className="text-ink-500">· {dept}</span>
                <button
                  onClick={() => onRemove(it.id)}
                  className="ml-1 text-ink-500 hover:text-rose-600"
                  aria-label="제거"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={onClear}
            className="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-100"
          >
            비우기
          </button>
          <button
            onClick={onCompare}
            disabled={items.length < 2}
            className="rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-ink-300"
          >
            비교 인쇄 ({items.length})
          </button>
        </div>
      </div>
    </div>
  );
}
