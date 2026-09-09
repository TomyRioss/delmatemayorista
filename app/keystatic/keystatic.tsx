"use client";
import { useEffect } from "react";
import { makePage } from "@keystatic/next/ui/app";
import config from "../../keystatic.config";

const Page = makePage(config);

export default function KeystaticApp() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/keystatic-sw.js", { scope: "/keystatic/" })
        .catch(() => {});
    }
  }, []);
  return <Page />;
}
