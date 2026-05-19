"use client";

type Props = {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
};

export default function FilterChips({ label, options, value, onChange }: Props) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-xs font-semibold text-ink-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-700 focus:border-indigo-500 focus:outline-none"
      >
        <option value="">전체</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
