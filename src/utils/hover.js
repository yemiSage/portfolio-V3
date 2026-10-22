// Keep hover interactions aligned with the mobile CSS breakpoint.
export const HOVER_MEDIA = "(min-width: 769px) and (hover: hover) and (pointer: fine)";

export function canHover() {
  return window.matchMedia(HOVER_MEDIA).matches;
}
