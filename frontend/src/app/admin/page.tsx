"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";

import { useAuth } from "@/context/AuthContext";

import Navbar from "../components/Navbar";

import { getAdminDashboard } from "@/services/dashboardService";

import { AdminDashboard } from "@/types/dashboard";
import Link from "next/link";
import toast from "react-hot-toast";
import MovieCard from "../components/MovieCard";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Palette — kept in one place so the whole page reads as one system.
const INK = "#0B1120"; // page background (matches --color-navy-900)
const PANEL = "#15181F"; // card background
const GOLD = "#E8B84B"; // marquee accent
const CRIMSON = "#C1443B"; // curtain accent
const TEAL = "#3FA9A0"; // screen-glow accent
const PAPER = "#F3EFE7"; // primary text
const MUTED = "#8B90A0"; // secondary text

function getStatCards(dashboard: AdminDashboard) {
  return [
    {
      key: "movies",
      label: "Total Movies",
      value: dashboard.totalMovies,
      icon: "🎬",
      tag: "Catalog",
      accent: GOLD,
    },
    {
      key: "actors",
      label: "Total Actors",
      value: dashboard.totalActors,
      icon: "🎭",
      tag: "Cast",
      accent: CRIMSON,
    },
    {
      key: "directors",
      label: "Total Directors",
      value: dashboard.totalDirectors,
      icon: "🎥",
      tag: "Crew",
      accent: TEAL,
    },
    {
      key: "users",
      label: "Total Users",
      value: dashboard.totalUsers,
      icon: "👤",
      tag: "Audience",
      accent: GOLD,
    },
  ];
}

export default function AdminPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);

  const ITEMS_PER_PAGE = 5;

  const [moviePage, setMoviePage] = useState(1);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/movies");
      return;
    }

    loadDashboard();
  }, [user, loading]);

  async function loadDashboard() {
    const toastId = toast.loading("Loading dashboard...");
    try {
      const data = await getAdminDashboard();

      setDashboard(data);
      toast.dismiss(toastId);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to load dashboard");
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

  if (!user || user.role !== "ADMIN") {
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
            style={{ backgroundColor: `${TEAL}1A` }}
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

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span
                className={`${mono.className} inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.2em]`}
                style={{
                  borderColor: `${GOLD}4D`,
                  backgroundColor: `${GOLD}1A`,
                  color: GOLD,
                }}
              >
                ADMIN PANEL
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
                Manage movies, actors, directors, and users — all from one
                screening room.
              </p>
            </div>

            <Link
              href="/admin/users"
              className="group inline-flex w-fit items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: `linear-gradient(90deg, ${GOLD}, ${CRIMSON})`,
                color: INK,
              }}
            >
              Manage Users
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>

        {dashboard && (
          <>
            {/* STATS */}
            <div className="mb-6 flex items-center gap-3">
              <div
                className="h-8 w-1 rounded-full"
                style={{ backgroundColor: GOLD }}
              />
              <div>
                <h2
                  className={`${playfair.className} text-2xl font-bold`}
                  style={{ color: PAPER }}
                >
                  By the Numbers
                </h2>
                <p className="text-sm" style={{ color: MUTED }}>
                  A quick tally of everything in the vault.
                </p>
              </div>
            </div>

            <div className="mb-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {getStatCards(dashboard).map((stat, i) => (
                <div
                  key={stat.key}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 p-6 pl-8 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-white/10"
                  style={{ backgroundColor: PANEL }}
                >
                  {/* ticket-stub perforation */}
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
                      style={{ backgroundColor: `${stat.accent}22` }}
                    >
                      {stat.icon}
                    </div>
                    <span
                      className={`${mono.className} text-[10px] tracking-widest`}
                      style={{ color: MUTED }}
                    >
                      NO. 0{i + 1}
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
                      backgroundColor: `${stat.accent}1A`,
                      color: stat.accent,
                    }}
                  >
                    {stat.tag}
                  </span>
                </div>
              ))}
            </div>

            {/* MOVIES */}
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
                  Now Showing
                </h2>
                <p className="text-sm" style={{ color: MUTED }}>
                  The latest additions to the catalog.
                </p>
              </div>
            </div>

            {paginatedMovies.length === 0 ? (
              <div
                className="rounded-2xl border border-white/5 p-10 text-center"
                style={{ backgroundColor: PANEL }}
              >
                <p style={{ color: MUTED }}>
                  The reel is empty — add a movie to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {paginatedMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
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
