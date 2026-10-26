const KEY = "yemi:homepage-intro-seen:v1";
let seenInMemory = false;

export function shouldShowHomeIntro(pathname, storage) {
  if (pathname.replace(/\/+$/, "") !== "" || seenInMemory) return false;
  try { return storage?.getItem(KEY) !== "1"; }
  catch { return true; }
}

export function markHomeIntroSeen(storage) {
  seenInMemory = true;
  try { storage?.setItem(KEY, "1"); } catch { /* Navigation still skips repeats when storage is unavailable. */ }
}
