export async function loadLottie() {
  if (typeof window === "undefined") return null;
  // dynamic import to avoid SSR issues; keep it lightweight
  const mod = await import(/* webpackChunkName: "lottie-web" */ "lottie-web").catch(() => null);
  return mod?.default ?? null;
}
