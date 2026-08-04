"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";

import Navbar from "@/app/components/Navbar";
import StarRating from "@/app/components/StarRating";
import { useAuth } from "@/context/AuthContext";
import { getReview, updateReview } from "@/services/reviewService";
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

export default function EditReviewPage() {
  const params = useParams();
  const router = useRouter();

  const movieId = Number(params.id);
  const reviewId = Number(params.reviewId);

  const { user, loading } = useAuth();

  const [review, setReview] = useState<Review | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");

  const [loadingReview, setLoadingReview] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/movies");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadReview() {
      const toastId = toast.loading("Loading review...");

      try {
        const data = await getReview(reviewId);
        setReview(data);
        setRating(data.rating);
        setComment(data.comment);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load review");
      } finally {
        toast.dismiss(toastId);
        setLoadingReview(false);
      }
    }

    if (reviewId) loadReview();
  }, [reviewId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    const toastId = toast.loading("Updating review...");

    try {
      setSaving(true);

      await updateReview(reviewId, { rating, comment });

      toast.dismiss(toastId);
      toast.success("Review updated successfully");
      router.push(`/movies/${movieId}`);
    } catch (error: any) {
      toast.dismiss(toastId);
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update review");
    } finally {
      setSaving(false);
    }
  }

  if (loading || loadingReview) {
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
            style={{ backgroundColor: `${CRIMSON}1A` }}
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
                  borderColor: `${CRIMSON}4D`,
                  backgroundColor: `${CRIMSON}1A`,
                  color: CRIMSON,
                }}
              >
                EDIT REVIEW
              </span>

              <h1
                className={`${playfair.className} mt-5 text-3xl font-bold leading-tight lg:text-4xl`}
                style={{ color: PAPER }}
              >
                {review?.movie ? review.movie.title : "Update this review"}
              </h1>

              <p
                className="mt-4 max-w-xl text-[15px] leading-relaxed"
                style={{ color: MUTED }}
              >
                Reviewed by{" "}
                <span style={{ color: PAPER }}>
                  {review?.user?.username || "a viewer"}
                </span>
                . Make your changes below.
              </p>
            </div>

            {review?.movie?.posterPath && (
              <img
                src={review.movie.posterPath}
                alt={review.movie.title}
                className="h-40 w-28 flex-shrink-0 rounded-xl border border-white/10 object-cover shadow-xl lg:h-48 lg:w-32"
              />
            )}
          </div>
        </div>

        {/* FORM PANEL */}
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
                Review Details
              </h2>
              <p className="text-sm" style={{ color: MUTED }}>
                Adjust the rating and comment, then save.
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

              <div className="flex items-center gap-3">
                <StarRating value={rating} onChange={setRating} size={36} />
                <span
                  className={`${mono.className} text-sm`}
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
                disabled={saving}
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  background: `linear-gradient(90deg, ${GOLD}, ${CRIMSON})`,
                  color: INK,
                }}
              >
                {saving ? "Updating..." : "Update Review"}
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </div>
          </form>
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
