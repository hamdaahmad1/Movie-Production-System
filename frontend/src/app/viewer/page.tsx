"use client";

import Navbar from "@/app/components/Navbar";
import MovieCard from "@/app/components/MovieCard";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";

import { useAuth } from "@/context/AuthContext";


import { ViewerDashboard } from "@/types/dashboard";
import { getViewerDashboard } from "@/services/dashboardService";
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
const TEAL = "#3FA9A0"; // screen-glow accent
const PAPER = "#F3EFE7"; // primary text
const MUTED = "#8B90A0"; // secondary text

const ITEMS_PER_PAGE = 5;



function SectionHeader({
  accent,
  title,
  subtitle,
}: {
  accent: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div
        className="h-8 w-1 rounded-full"
        style={{ backgroundColor: accent }}
      />
      <div>
        <h2
          className={`${playfair.className} text-2xl font-bold`}
          style={{ color: PAPER }}
        >
          {title}
        </h2>
        <p className="text-sm" style={{ color: MUTED }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function PaginationControls({
  page,
  totalPages,
  onPrev,
  onNext,
  label,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  label: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      <button
        disabled={page === 1}
        onClick={onPrev}
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
        {label} {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={onNext}
        aria-label="Next page"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ backgroundColor: PANEL, color: PAPER }}
      >
        ›
      </button>
    </div>
  );
}

export default function ViewerPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [dashboard, setDashboard] = useState<ViewerDashboard | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

 
  const [favoritePage, setFavoritePage] = useState(1);

  const [watchlistPage, setWatchlistPage] = useState(1);

  const [reviewPage, setReviewPage] = useState(1);
  const favorites = dashboard?.favorites ?? [];

const watchlist = dashboard?.watchlist ?? [];

const reviews = dashboard?.reviews ?? [];

  const paginatedFavorites = favorites.slice(
    (favoritePage - 1) * ITEMS_PER_PAGE,
    favoritePage * ITEMS_PER_PAGE
  );

  const paginatedWatchlist = watchlist.slice(
    (watchlistPage - 1) * ITEMS_PER_PAGE,
    watchlistPage * ITEMS_PER_PAGE
  );

  const paginatedReviews = reviews.slice(
    (reviewPage - 1) * ITEMS_PER_PAGE,
    reviewPage * ITEMS_PER_PAGE
  );

  const favoritePages = Math.max(
    1,
    Math.ceil(favorites.length / ITEMS_PER_PAGE)
  );
  const watchlistPages = Math.max(
    1,
    Math.ceil(watchlist.length / ITEMS_PER_PAGE)
  );
  const reviewPages = Math.max(1, Math.ceil(reviews.length / ITEMS_PER_PAGE));

  async function loadDashboardData() {
    const toastId = toast.loading("Loading dashboard...");
  
    try {
      setDashboardLoading(true);
  
      const data = await getViewerDashboard();
  
      setDashboard(data);
  
      toast.dismiss(toastId);
    } catch (error) {
      console.error(error);
  
      toast.dismiss(toastId);
  
      toast.error("Failed to load dashboard data.");
    } finally {
      setDashboardLoading(false);
    }
  }

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");

      return;
    }

    if (user.role !== "VIEWER") {
      router.replace("/");

      return;
    }

    loadDashboardData();
  }, [user, loading]);

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

  if (!user || user.role !== "VIEWER") {
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

          <div className="relative">
            <span
              className={`${mono.className} inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.2em]`}
              style={{
                borderColor: `${GOLD}4D`,
                backgroundColor: `${GOLD}1A`,
                color: GOLD,
              }}
            >
              VIEWER PANEL
            </span>

            <h1
              className={`${playfair.className} mt-5 text-4xl font-bold leading-tight lg:text-5xl`}
              style={{ color: PAPER }}
            >
              Welcome back, {user?.firstName}
            </h1>

            <p
              className="mt-4 max-w-xl text-[15px] leading-relaxed"
              style={{ color: MUTED }}
            >
              Your favorites, your watchlist, and everything you've reviewed —
              all in one seat.
            </p>
          </div>
        </div>

        {dashboardLoading ? (
          <div
            className="rounded-2xl border border-white/5 p-10 text-center"
            style={{ backgroundColor: PANEL }}
          >
            <p
              className={`${mono.className} text-xs tracking-[0.3em]`}
              style={{ color: MUTED }}
            >
              LOADING...
            </p>
          </div>
        ) : (
          <>
            {/* FAVORITES */}
            <section className="mb-14">
              <SectionHeader
                accent={CRIMSON}
                title="Favorite Movies"
                subtitle="The ones you've marked as favorites."
              />

              {favorites.length === 0 ? (
                <div
                  className="rounded-2xl border border-white/5 p-10 text-center"
                  style={{ backgroundColor: PANEL }}
                >
                  <p style={{ color: MUTED }}>
                    No favorites yet — tap the heart on a movie to save it here.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {paginatedFavorites.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>

                  <PaginationControls
                    page={favoritePage}
                    totalPages={favoritePages}
                    onPrev={() => setFavoritePage((p) => p - 1)}
                    onNext={() => setFavoritePage((p) => p + 1)}
                    label="PAGE"
                  />
                </>
              )}
            </section>

            {/* WATCHLIST */}
            <section className="mb-14">
              <SectionHeader
                accent={GOLD}
                title="Watchlist"
                subtitle="Up next in your queue."
              />

              {watchlist.length === 0 ? (
                <div
                  className="rounded-2xl border border-white/5 p-10 text-center"
                  style={{ backgroundColor: PANEL }}
                >
                  <p style={{ color: MUTED }}>
                    Your watchlist is empty — add a movie to watch later.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {paginatedWatchlist.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>

                  <PaginationControls
                    page={watchlistPage}
                    totalPages={watchlistPages}
                    onPrev={() => setWatchlistPage((p) => p - 1)}
                    onNext={() => setWatchlistPage((p) => p + 1)}
                    label="PAGE"
                  />
                </>
              )}
            </section>

            {/* REVIEWS */}
            <section>
              <SectionHeader
                accent={TEAL}
                title="My Reviews"
                subtitle="What you've written about the movies you've seen."
              />

              {reviews.length === 0 ? (
                <div
                  className="rounded-2xl border border-white/5 p-10 text-center"
                  style={{ backgroundColor: PANEL }}
                >
                  <p style={{ color: MUTED }}>
                    You haven't written a review yet — share your thoughts on a
                    movie.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                    {paginatedReviews.map((review) => (
                      <div key={review.id} className="flex flex-col gap-3">
                        {review.movie && <MovieCard movie={review.movie} />}

                        <div
                          className="rounded-xl border border-white/5 p-3"
                          style={{ backgroundColor: PANEL }}
                        >
                          <span
                            className={`${mono.className} text-xs tracking-widest`}
                            style={{ color: TEAL }}
                          >
                            {"★".repeat(Math.round(review.rating))}
                            {"☆".repeat(5 - Math.round(review.rating))}
                          </span>
                          <p
                            className="mt-2 text-sm leading-relaxed"
                            style={{ color: MUTED }}
                          >
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <PaginationControls
                    page={reviewPage}
                    totalPages={reviewPages}
                    onPrev={() => setReviewPage((p) => p - 1)}
                    onNext={() => setReviewPage((p) => p + 1)}
                    label="PAGE"
                  />
                </>
              )}
            </section>
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
