"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";

import Navbar from "@/app/components/Navbar";
import StarRating from "@/app/components/StarRating";
import { useAuth } from "@/context/AuthContext";
import { createReview, getMyReviews } from "@/services/reviewService";
import { getMovie } from "@/services/movieService";
import { Movie } from "@/types/movie";
import { Review } from "@/types/review";
import toast from "react-hot-toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Palette — identical to the dashboards, so this page feels like it belongs.
const INK = "#0B1120";
const PANEL = "#15181F";
const GOLD = "#E8B84B";
const CRIMSON = "#C1443B";
const TEAL = "#3FA9A0";
const PAPER = "#F3EFE7";
const MUTED = "#8B90A0";

export default function WriteReviewPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = Number(params.id);

  const { user, loading } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieLoading, setMovieLoading] = useState(true);

  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "VIEWER") {
      router.replace("/movies");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadMovie() {
      try {
        const data = await getMovie(movieId);
        setMovie(data);
      } catch (error) {
        console.error(error);
      } finally {
        setMovieLoading(false);
      }
    }

    if (movieId) loadMovie();
  }, [movieId]);

  useEffect(() => {
    async function checkExistingReview() {
      try {
        const myReviews = await getMyReviews();
        const alreadyReviewed = myReviews.find(
          (r: Review) => r.movieId === movieId
        );
        setExistingReview(alreadyReviewed || null);
      } catch (error) {
        console.error(error);
      } finally {
        setCheckingExisting(false);
      }
    }

    if (user?.role === "VIEWER" && movieId) {
      checkExistingReview();
    }
  }, [user, movieId]);

  function handleStarClick(value: number) {
    setRating(value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading("Submitting review...");

    try {
      await createReview(movieId, { rating, comment });

      toast.dismiss(loadingToast);
      toast.success("Review submitted successfully");
      router.push(`/movies/${movieId}`);
    } catch (error: any) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

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

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: INK }}>
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* HERO */}
        <div
          className="relative mb-10 overflow-hidden rounded-3xl border border-white/5 p-8 shadow-2xl lg:p-12"
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
            {Array.from({ length: 24 }).map((_, i) => (
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

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span
                className={`${mono.className} inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.2em]`}
                style={{
                  borderColor: `${GOLD}4D`,
                  backgroundColor: `${GOLD}1A`,
                  color: GOLD,
                }}
              >
                WRITE A REVIEW
              </span>

              <h1
                className={`${playfair.className} mt-5 text-3xl font-bold leading-tight lg:text-4xl`}
                style={{ color: PAPER }}
              >
                {movieLoading
                  ? "Loading movie..."
                  : movie
                  ? movie.title
                  : "Share your thoughts"}
              </h1>

              <p
                className="mt-4 max-w-xl text-[15px] leading-relaxed"
                style={{ color: MUTED }}
              >
                Rate it, write what you really thought, and help other viewers
                decide.
              </p>
            </div>

            {movie?.posterPath && (
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="h-40 w-28 flex-shrink-0 rounded-xl border border-white/10 object-cover shadow-xl lg:h-48 lg:w-32"
              />
            )}
          </div>
        </div>

        {checkingExisting ? (
          <div
            className="rounded-2xl border border-white/5 p-10 text-center"
            style={{ backgroundColor: PANEL }}
          >
            <p
              className={`${mono.className} text-xs tracking-[0.3em]`}
              style={{ color: MUTED }}
            >
              CHECKING...
            </p>
          </div>
        ) : existingReview ? (
          /* ALREADY REVIEWED */
          <div
            className="rounded-2xl border border-white/5 p-8 shadow-lg"
            style={{ backgroundColor: PANEL }}
          >
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
                  You've Already Reviewed This Movie
                </h2>
                <p className="text-sm" style={{ color: MUTED }}>
                  One review per viewer per movie. Here's what you wrote.
                </p>
              </div>
            </div>

            <div
              className="rounded-xl border border-white/10 p-5"
              style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
            >
              <StarRating value={existingReview.rating} readOnly size={26} />
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: MUTED }}
              >
                {existingReview.comment}
              </p>
            </div>

            <p className="mt-5 text-sm" style={{ color: MUTED }}>
              Want to change it? Delete your review from the movie page first,
              then you'll be able to write a new one.
            </p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => router.push(`/movies/${movieId}`)}
                className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.03]"
                style={{
                  background: `linear-gradient(90deg, ${GOLD}, ${CRIMSON})`,
                  color: INK,
                }}
              >
                Back to Movie
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* FORM PANEL */
          <div
            className="rounded-2xl border border-white/5 p-8 shadow-lg"
            style={{ backgroundColor: PANEL }}
          >
            <div className="mb-8 flex items-center gap-3">
              <div
                className="h-8 w-1 rounded-full"
                style={{ backgroundColor: CRIMSON }}
              />
              <div>
                <h2
                  className={`${playfair.className} text-2xl font-bold`}
                  style={{ color: PAPER }}
                >
                  Your Review
                </h2>
                <p className="text-sm" style={{ color: MUTED }}>
                  Give a star rating and tell us why.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label
                  className={`${mono.className} mb-3 block text-xs uppercase tracking-widest`}
                  style={{ color: MUTED }}
                >
                  Rating
                </label>

                <div
                  className="flex items-center gap-2"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="text-4xl leading-none transition-transform hover:scale-110"
                      style={{
                        color:
                          star <= (hoverRating || rating) ? GOLD : "#2A2E38",
                      }}
                    >
                      ★
                    </button>
                  ))}

                  <span
                    className={`${mono.className} ml-3 text-sm`}
                    style={{ color: MUTED }}
                  >
                    {rating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label
                  className={`${mono.className} mb-3 block text-xs uppercase tracking-widest`}
                  style={{ color: MUTED }}
                >
                  Comment
                </label>

                <textarea
                  rows={6}
                  placeholder="Write your review..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-white/20"
                  style={{ color: PAPER }}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => router.push(`/movies/${movieId}`)}
                  className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold transition hover:bg-white/5"
                  style={{ color: PAPER }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}, ${CRIMSON})`,
                    color: INK,
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </button>
              </div>
            </form>
          </div>
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
