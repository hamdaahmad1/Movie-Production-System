"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/app/components/Navbar";
import BackButton from "@/app/components/BackButton";
import { useAuth } from "@/context/AuthContext";
import { getMovie } from "@/services/movieService";
import { Movie } from "@/types/movie";
import { getMovieReviews, deleteReview } from "@/services/reviewService";

import Link from "next/link";
import toast from "react-hot-toast";
import StarRating from "@/app/components/StarRating";

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loadingMovie, setLoadingMovie] = useState(true);

  const movieId = Number(params.id);
  const { user, loading } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);

  async function loadMovie() {
    try {
      const data = await getMovie(movieId);
      setMovie(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load movie.");
    } finally {
      setLoadingMovie(false);
    }
  }

  async function loadReviews() {
    try {
      const data = await getMovieReviews(movieId);
      setReviews(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reviews");
    }
  }

  useEffect(() => {
    if (!movieId) return;
    loadMovie();
    loadReviews();
  }, [movieId]);

  async function handleDelete(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmDelete) return;

    const toastId = toast.loading("Deleting review...");
    try {
      await deleteReview(id);
      toast.dismiss(toastId);
      toast.success("Review deleted successfully");
      loadReviews();
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Failed to delete review");
    }
  }

  if (loading || loadingMovie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900 text-white">
        Loading movie...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900 text-white">
        Movie not found.
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <BackButton href="/movies" text="Back to Movies" className="mb-6" />

        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl">
          {movie.posterPath ? (
            <img
              src={movie.posterPath}
              alt={movie.title}
              className="absolute inset-0 h-full w-full object-cover blur-xl scale-125"
            />
          ) : (
            <div className="absolute inset-0 bg-navy-800" />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />

          <div className="relative flex flex-col items-center gap-6 px-5 py-8 text-center sm:px-8 md:px-10 md:py-10 lg:flex-row lg:items-end lg:gap-10 lg:text-left">
            {movie.posterPath && (
              <div className="flex-shrink-0">
                <img
                  src={movie.posterPath}
                  alt={movie.title}
                  className="h-[220px] w-auto rounded-2xl border-4 border-white/10 shadow-2xl sm:h-[280px] md:h-[320px] lg:h-[360px]"
                />
              </div>
            )}

            <div className="min-w-0 max-w-3xl flex-1">
              <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {movie.title}
              </h1>

              <p className="mt-3 text-base text-gray-200 sm:mt-4 sm:text-xl">
                {new Date(movie.releaseDate).getFullYear()} • {movie.genre}
              </p>

              <p className="mt-4 text-sm leading-6 text-gray-300 sm:mt-5 sm:text-base sm:leading-7">
                {movie.description}
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-white sm:mt-6 sm:gap-5 sm:text-base md:justify-start">
                <span>{movie.duration} min</span>
                <div className="flex items-center gap-2">
                  <StarRating value={movie.averageRating} readOnly size={16} />
                  <span className="font-semibold">
                    {movie.averageRating.toFixed(1)}/5.0
                  </span>
                </div>
                <span>{movie.language}</span>
              </div>

              <div className="mt-6 sm:mt-8">
                <a
                  href={movie.trailerId}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 sm:text-base"
                >
                  ▶ Watch Trailer
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* MOVIE DETAILS */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-5 shadow-2xl sm:mt-16 sm:p-8 md:mt-24 md:p-10">
          <div className="mb-6 sm:mb-10">
            <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Movie Details
            </h2>
            <p className="mt-2 text-sm text-ink-400 sm:text-base">
              Information about this movie.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 sm:p-5">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Genre
              </p>
              <p className="mt-2 text-lg font-semibold text-white sm:text-xl">
                {movie.genre}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 sm:p-5">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Rating
              </p>
              <p className="mt-2 text-lg font-semibold text-yellow-400 sm:text-xl">
                ⭐ {movie.rating}/5
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 sm:p-5">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Duration
              </p>
              <p className="mt-2 text-lg font-semibold text-white sm:text-xl">
                {movie.duration} minutes
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 sm:p-5">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Language
              </p>
              <p className="mt-2 text-lg font-semibold text-white sm:text-xl">
                {movie.language}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 sm:p-5">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Release Date
              </p>
              <p className="mt-2 text-lg font-semibold text-white sm:text-xl">
                {new Date(movie.releaseDate).toLocaleDateString("en-GB")}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 sm:p-5">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Director
              </p>
              <p className="mt-2 text-lg font-semibold text-white sm:text-xl">
                {movie.director?.name || "Unknown"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 md:col-span-2">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Cast
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {movie.actors?.length ? (
                  movie.actors.map((actor) => (
                    <span
                      key={actor.id}
                      className="rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-white"
                    >
                      {actor.name}
                    </span>
                  ))
                ) : (
                  <span className="text-ink-400">No actors</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mt-10 sm:mt-16">
          <div className="mb-6 flex flex-col items-start gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Reviews
              </h2>
              {user?.role === "VIEWER" && (
                <p className="mt-2 text-sm text-ink-400 sm:text-base">
                  Share your thoughts about this movie.
                </p>
              )}
            </div>

            {user?.role === "VIEWER" && (
              <Link
                href={`/movies/${movieId}/review`}
                className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-105 sm:px-6 sm:py-3 sm:text-base"
              >
                + Add Review
              </Link>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-navy-800 p-8 text-center sm:p-12">
              <p className="text-base text-ink-400 sm:text-lg">
                No reviews yet.
              </p>
              <p className="mt-2 text-sm text-ink-500">
                Be the first person to review this movie.
              </p>
            </div>
          ) : (
            <div className="space-y-5 sm:space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-5 shadow-xl transition hover:border-accent/30 hover:shadow-2xl sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white sm:text-xl">
                        {review.user?.username}
                      </h3>

                      <div className="mt-2 text-xl text-yellow-400 sm:mt-3 sm:text-2xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star}>
                            {star <= review.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className="rounded-full bg-accent/20 px-3 py-1.5 text-sm font-semibold text-white sm:px-4 sm:py-2 sm:text-base">
                      {review.rating}/5
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-ink-300 sm:mt-6 sm:text-base sm:leading-8">
                    {review.comment}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
                    {user?.role === "ADMIN" && (
                      <Link
                        href={`/movies/${movieId}/review/edit/${review.id}`}
                        className="rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20 sm:px-5"
                      >
                        Edit Review
                      </Link>
                    )}

                    {(user?.role === "ADMIN" ||
                      review.user?.id === user?.id) && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="rounded-full bg-red-500/20 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/30 sm:px-5"
                      >
                        Delete Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
