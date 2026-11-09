export function hapticTap(): void {
  if (typeof navigator === "undefined") return;
  try {
    if ("vibrate" in navigator) navigator.vibrate(10);
  } catch { /* unsupported */ }
}

export function hapticSuccess(): void {
  if (typeof navigator === "undefined") return;
  try {
    if ("vibrate" in navigator) navigator.vibrate([12, 40, 20]);
  } catch { /* unsupported */ }
}
