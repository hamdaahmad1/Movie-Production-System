"use client";

import Link from "next/link";
import { Movie } from "@/types/movie";
import { ReactNode } from "react";

function ratingColor(rating: number) {
  if (rating >= 7) return "bg-emerald-500";
  if (rating >= 5) return "bg-amber-500";
  return "bg-rose-500";
}

export default function MovieCard({
  movie,
  actions,
}: {
  movie: Movie;
  actions?: ReactNode;
}) {
  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : "—";

  return (
    <div className="card-hover overflow-hidden rounded-2xl bg-navy-800 shadow-lg shadow-black/20">
      <Link
        href={`/movies/${movie.id}`}
        className="group relative block aspect-[2/3] w-full overflow-hidden bg-navy-700"
      >
        {movie.posterPath ? (
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-ink-400">
            No poster
          </div>
        )}

        <span
          className={`absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-navy-950 ${ratingColor(
            movie.rating
          )}`}
        >
          {Math.round(movie.rating * 10)}
        </span>

        {movie.genre && (
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            {movie.genre}
          </span>
        )}
      </Link>

      <div className="p-3">
        <Link href={`/movies/${movie.id}`}>
          <h3 className="truncate text-sm font-semibold text-white hover:text-accent">
            {movie.title}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-ink-400">{year}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/movies/${movie.id}`}
            className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
          >
            View Details
          </Link>

          {actions}
        </div>
      </div>
    </div>
  );
}
