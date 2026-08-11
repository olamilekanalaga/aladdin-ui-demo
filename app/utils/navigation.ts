"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

export function useGo() {
  const router = useRouter();
  return useCallback(
    (path: string) => {
      router.push(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [router]
  );
}
