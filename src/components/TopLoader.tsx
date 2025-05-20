"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.1,
});

export default function TopLoader() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 500); // artificial delay, adjust based on your route speed

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
