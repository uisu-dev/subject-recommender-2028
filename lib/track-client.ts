"use client";

const VISITOR_KEY = "subject-recommender:visitor-id";

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

/** Fire-and-forget event tracking. Errors are swallowed. */
export function track(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}

export function trackVisit(): void {
  const id = getVisitorId();
  if (!id) return;
  track({ type: "visit", visitorId: id });
}

export function trackClick(대학명?: string, 학과?: string): void {
  if (!대학명 && !학과) return;
  track({ type: "click", 대학명, 학과 });
}
