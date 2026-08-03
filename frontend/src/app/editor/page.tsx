"use client";

import Navbar from "@/app/components/Navbar";
import MovieCard from "@/app/components/MovieCard";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import { EditorDashboard } from "@/types/dashboard";

import { useAuth } from "@/context/AuthContext";

import { getEditorDashboard } from "@/services/dashboardService";

import toast from "react-hot-toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Palette — identical to the admin dashboard, so every role shares one look.
const INK = "#0B1120"; // page background
const PANEL = "#15181F"; // card background
const GOLD = "#E8B84B"; // marquee accent
const CRIMSON = "#C1443B"; // curtain accent
const PAPER = "#F3EFE7"; // primary text
const MUTED = "#8B90A0"; // secondary text

const CAPABILITIES = [
  { label: "View movies, actors and directors", allowed: true },
  { label: "Create movies, actors and directors", allowed: true },
  { label: "Edit movies, actors and directors", allowed: true },
  { label: "Delete movies, actors or directors", allowed: false },
];

export default function EditorPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [dashboard, setDashboard] = useState<EditorDashboard | null>(null);

  const ITEMS_PER_PAGE = 5;

  const [moviePage, setMoviePage] = useState(1);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "EDITOR") {
      router.replace("/");
      return;
    }

    loadDashboard();
  }, [user, loading]);

  async function loadDashboard() {
    const toastId = toast.loading("Loading dashboard...");

    try {
      const data = await getEditorDashboard();

      setDashboard(data);

      toast.dismiss(toastId);
    } catch (error) {
      console.error(error);

      toast.dismiss(toastId);

      toast.error("Failed to load dashboard data.");
    }
  }

  const paginatedMovies =
    dashboard?.recentMovies.slice(
      (moviePage - 1) * ITEMS_PER_PAGE,
      moviePage * ITEMS_PER_PAGE
    ) || [];

  const totalPages = dashboard
    ? Math.max(1, Math.ceil(dashboard.recentMovies.length / ITEMS_PER_PAGE))
    : 1;

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: INK }}
      >
        <p
          className={`${mono.className} text-xs tracking-[0.3em]`}
          style={{ color: MUTED }}
        >
          LOADING...
        </p>
      </div>
    );
  }

  if (!user || user.role !== "EDITOR") {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: INK }}>
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* HERO */}
        <div
          className="relative mb-12 overflow-hidden rounded-3xl border border-white/5 p-8 shadow-2xl lg:p-12"
          style={{
            background: `linear-gradient(135deg, ${PANEL} 0%, #12141B 55%, #0F1116 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
            style={{ backgroundColor: `${GOLD}1A` }}
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full blur-3xl"
            style={{ backgroundColor: `${CRIMSON}1A` }}
          />

          {/* marquee lights */}
          <div className="relative mb-8 flex flex-wrap gap-2">
            {Array.from({ length: 28 }).map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: GOLD,
                  animation: `marquee-pulse 2.4s ease-in-out ${
                    i * 0.08
                  }s infinite`,
                }}
              />
            ))}
          </div>

          <div className="relative">
            <span
              className={`${mono.className} inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.2em]`}
              style={{
                borderColor: `${GOLD}4D`,
                backgroundColor: `${GOLD}1A`,
                color: GOLD,
              }}
            >
              EDITOR PANEL
            </span>

            <h1
              className={`${playfair.className} mt-5 text-4xl font-bold leading-tight lg:text-5xl`}
              style={{ color: PAPER }}
            >
              Welcome back, {user.firstName}
            </h1>

            <p
              className="mt-4 max-w-xl text-[15px] leading-relaxed"
              style={{ color: MUTED }}
            >
              Keep the catalog sharp — add, update, and fine-tune movies,
              actors, and directors.
            </p>
          </div>
        </div>

        {/* CAPABILITIES */}
        <div
          className="mb-12 rounded-2xl border border-white/5 p-6"
          style={{ backgroundColor: PANEL }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div
              className="h-8 w-1 rounded-full"
              style={{ backgroundColor: GOLD }}
            />
            <div>
              <h2
                className={`${playfair.className} text-xl font-bold`}
                style={{ color: PAPER }}
              >
                What You Can Do
              </h2>
              <p className="text-sm" style={{ color: MUTED }}>
                Your permissions on this account.
              </p>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((cap) => (
              <li
                key={cap.label}
                className="flex items-center gap-3 rounded-xl border border-white/5 px-4 py-3"
                style={{ backgroundColor: INK }}
              >
                <span
                  className="flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: cap.allowed
                      ? `${GOLD}22`
                      : "rgba(255,255,255,0.06)",
                    color: cap.allowed ? GOLD : MUTED,
                  }}
                >
                  {cap.allowed ? "✓" : "✕"}
                </span>
                <span
                  className="text-sm"
                  style={{
                    color: cap.allowed ? PAPER : MUTED,
                    textDecoration: cap.allowed ? "none" : "line-through",
                  }}
                >
                  {cap.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {dashboard && (
          <>
            {/* STATS */}
            <div className="mb-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  label: "Total Movies",
                  value: dashboard.totalMovies,
                  icon: "🎬",
                  badge: "Catalog",
                  number: "01",
                },
                {
                  label: "Total Actors",
                  value: dashboard.totalActors,
                  icon: "🎭",
                  badge: "Cast",
                  number: "02",
                },
                {
                  label: "Total Directors",
                  value: dashboard.totalDirectors,
                  icon: "🎥",
                  badge: "Crew",
                  number: "03",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 p-6 pl-8 shadow-lg transition duration-200 hover:-translate-y-1"
                  style={{ backgroundColor: PANEL }}
                >
                  <div className="absolute left-4 top-0 h-full border-l border-dashed border-white/10" />

                  <div
                    className="absolute -left-2 -top-2 h-4 w-4 rounded-full border border-white/5"
                    style={{ backgroundColor: INK }}
                  />

                  <div
                    className="absolute -bottom-2 left-2.5 h-4 w-4 rounded-full border border-white/5"
                    style={{ backgroundColor: INK }}
                  />

                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                      style={{ backgroundColor: `${GOLD}22` }}
                    >
                      {stat.icon}
                    </div>

                    <span
                      className={`${mono.className} text-[10px] tracking-widest`}
                      style={{ color: MUTED }}
                    >
                      NO. {stat.number}
                    </span>
                  </div>

                  <p className="text-sm" style={{ color: MUTED }}>
                    {stat.label}
                  </p>

                  <h3
                    className={`${mono.className} mt-1 text-4xl font-semibold`}
                    style={{ color: PAPER }}
                  >
                    {stat.value}
                  </h3>

                  <span
                    className="mt-3 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium"
                    style={{
                      backgroundColor: `${GOLD}1A`,
                      color: GOLD,
                    }}
                  >
                    {stat.badge}
                  </span>
                </div>
              ))}
            </div>

            {/* RECENT MOVIES */}
            <div className="mb-6 flex items-center gap-3">
              <div
                className="h-8 w-1 rounded-full"
                style={{ backgroundColor: CRIMSON }}
              />
              <div>
                <h2
                  className={`${playfair.className} text-2xl font-bold`}
                  style={{ color: PAPER }}
                >
                  Recently Updated
                </h2>
                <p className="text-sm" style={{ color: MUTED }}>
                  Movies that changed most recently.
                </p>
              </div>
            </div>

            {paginatedMovies.length === 0 ? (
              <div
                className="rounded-2xl border border-white/5 p-10 text-center"
                style={{ backgroundColor: PANEL }}
              >
                <p style={{ color: MUTED }}>
                  Nothing updated yet — edit a movie to see it here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {paginatedMovies.map((movie) => (
                  <div key={movie.id} className="flex flex-col gap-2">
                    <MovieCard movie={movie} />
                    <Link
                      href={`/movies/edit/${movie.id}`}
                      className="inline-flex items-center justify-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
                      style={{ backgroundColor: `${GOLD}1A`, color: GOLD }}
                    >
                      Edit Movie →
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                disabled={moviePage === 1}
                onClick={() => setMoviePage((p) => p - 1)}
                aria-label="Previous page"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: PANEL, color: PAPER }}
              >
                ‹
              </button>

              <span
                className={`${mono.className} text-xs tracking-widest`}
                style={{ color: MUTED }}
              >
                REEL {moviePage} / {totalPages}
              </span>

              <button
                disabled={
                  moviePage * ITEMS_PER_PAGE >= dashboard.recentMovies.length
                }
                onClick={() => setMoviePage((p) => p + 1)}
                aria-label="Next page"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: PANEL, color: PAPER }}
              >
                ›
              </button>
            </div>
          </>
        )}

        {/* QUICK LINKS */}
        <div
          className="mt-14 border-t pt-8"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <h3
            className={`${mono.className} mb-4 text-xs font-semibold uppercase tracking-widest`}
            style={{ color: MUTED }}
          >
            Quick Links
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/movies", label: "Movies" },
              { href: "/actors", label: "Actors" },
              { href: "/directors", label: "Directors" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/10 px-5 py-2 text-sm font-medium transition hover:opacity-80"
                style={{ backgroundColor: PANEL, color: PAPER }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-pulse {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}
