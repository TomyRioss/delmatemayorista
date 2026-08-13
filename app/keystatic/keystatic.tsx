"use client";
import { makePage } from "@keystatic/next/ui/app";
import config from "../../keystatic.config";
import { LogOutButton } from "./logout-button";

const KeystaticApp = makePage(config);

export default function Page() {
  return (
    <>
      <KeystaticApp />
      <LogOutButton />
    </>
  );
}