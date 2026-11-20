"use client";

import { useSyncExternalStore } from "react";

const compactQuery = "(max-width: 1249px)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(compactQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(compactQuery).matches;
const getServerSnapshot = () => false;

export function useCompactLayout() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
