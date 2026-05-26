"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    epi?: {
      subscribe?: (event: string, callback: (data: unknown) => void) => void;
      ready?: boolean;
    };
  }
}

export default function OnPageEdit() {
  const router = useRouter();

  useEffect(() => {
    function setupEpiSubscription() {
      if (typeof window === "undefined" || !window.epi?.subscribe) return;

      window.epi.subscribe("contentSaved", () => {
        router.refresh();
      });
    }

    if (window.epi?.ready) {
      setupEpiSubscription();
    } else {
      const interval = setInterval(() => {
        if (window.epi?.ready) {
          clearInterval(interval);
          setupEpiSubscription();
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [router]);

  return null;
}
