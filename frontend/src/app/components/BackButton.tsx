"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  href: string;
  text: string;
  className?: string;
};

export default function BackButton({
  href,
  text,
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className={`rounded-full bg-navy-800 px-4 py-2 text-sm text-white transition hover:bg-navy-700 ${className}`}
    >
      ← {text}
    </button>
  );
}
