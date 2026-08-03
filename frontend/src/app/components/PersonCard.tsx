"use client";

import Link from "next/link";
import { ReactNode } from "react";

export default function PersonCard({
  name,
  imagePath,
  subtitle,
  href,
  actions,
}: {
  name: string;
  imagePath?: string | null;
  subtitle?: string;
  href: string;
  actions?: ReactNode;
}) {
  return (
    <div className="card-hover overflow-hidden rounded-2xl bg-navy-800 shadow-lg shadow-black/20">
      <Link href={href} className="group relative block aspect-[3/4] w-full overflow-hidden bg-navy-700">
        {imagePath ? (
          <img
            src={imagePath}
            alt={name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-ink-400">
            No photo
          </div>
        )}
      </Link>

      <div className="p-3">
        <Link href={href}>
          <h3 className="truncate text-sm font-semibold text-white hover:text-accent">{name}</h3>
        </Link>
        {subtitle && <p className="mt-1 truncate text-xs text-ink-400">{subtitle}</p>}
        {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}