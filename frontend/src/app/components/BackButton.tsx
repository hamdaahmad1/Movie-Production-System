"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  href: string;
  text: string;
};

export default function BackButton({
  href,
  text,
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
    >
      ← {text}
    </button>
  );
}