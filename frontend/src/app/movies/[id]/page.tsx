"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import Navbar from "@/app/components/Navbar";

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

    if (!confirmDelete) {
      return;
    }

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

  function renderStars(rating: number) {
    return (
      <span style={{ fontSize: "25px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>{star <= rating ? "★" : "☆"}</span>
        ))}
      </span>
    );
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

      <div className="mx-auto max-w-7xl px-6 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 rounded-full bg-navy-800 px-4 py-2 text-sm text-white transition hover:bg-navy-700"
        >
          ← Back
        </button>

        <div className="relative h-[620px] overflow-hidden rounded-3xl">
         { movie.posterPath ? (
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

          <div className="relative flex h-full items-end gap-10 px-10">
            {movie.posterPath && (
              <div className="flex-shrink-0 self-end pb-8">
                <img
                  src={movie.posterPath}
                  alt={movie.title}
                  className="h-[360px] w-auto rounded-2xl border-4 border-white/10 shadow-2xl"
                />
              </div>
            )}

            <div className="max-w-3xl pb-8">
              <h1 className="text-5xl font-bold text-white lg:text-6xl">
                {movie.title}
              </h1>

              <p className="mt-4 text-xl text-gray-200">
                {new Date(movie.releaseDate).getFullYear()} • {movie.genre}
              </p>

              <p className="mt-5 leading-7 text-gray-300">
                {movie.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-5 text-white">
                <span>{movie.duration} min</span>
                <div className="flex items-center gap-2">
                  <StarRating value={movie.averageRating} readOnly size={16} />

                  <span className="font-semibold">
                    {movie.averageRating.toFixed(1)}/5.0
                  </span>
                </div>
                <span>{movie.language}</span>
              </div>

              <div className="mt-8">
                <a
                  href={movie.trailerId}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
                >
                  ▶ Watch Trailer
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-10 shadow-2xl">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-white">Movie Details</h2>

            <p className="mt-2 text-ink-400">Information about this movie.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Genre
              </p>

              <p className="mt-2 text-xl font-semibold text-white">
                {movie.genre}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Rating
              </p>

              <p className="mt-2 text-xl font-semibold text-yellow-400">
                ⭐ {movie.rating}/5
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Duration
              </p>

              <p className="mt-2 text-xl font-semibold text-white">
                {movie.duration} minutes
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Language
              </p>

              <p className="mt-2 text-xl font-semibold text-white">
                {movie.language}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Release Date
              </p>

              <p className="mt-2 text-xl font-semibold text-white">
                {new Date(movie.releaseDate).toLocaleDateString("en-GB")}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Director
              </p>

              <p className="mt-2 text-xl font-semibold text-white">
                {movie.director?.name || "Unknown"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-2">
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

        <div className="mt-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-white">Reviews</h2>

              <p className="mt-2 text-ink-400">
                Share your thoughts about this movie.
              </p>
            </div>

            <Link
              href={`/movies/${movieId}/review/create`}
              className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
            >
              + Add Review
            </Link>
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-navy-800 p-12 text-center">
              <p className="text-lg text-ink-400">No reviews yet.</p>

              <p className="mt-2 text-sm text-ink-500">
                Be the first person to review this movie.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-6 shadow-xl transition hover:border-accent/30 hover:shadow-2xl"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {review.user?.username}
                      </h3>

                      <div className="mt-3 text-2xl text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star}>
                            {star <= review.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className="rounded-full bg-accent/20 px-4 py-2 font-semibold text-white">
                      {review.rating}/5
                    </span>
                  </div>

                  <p className="mt-6 leading-8 text-ink-300">
                    {review.comment}
                  </p>

                  <div className="mt-8 flex gap-3">
                    {user?.role === "ADMIN" && (
                      <Link
                        href={`/movies/${movieId}/review/edit/${review.id}`}
                        className="rounded-full bg-white/10 px-5 py-2 text-white transition hover:bg-white/20"
                      >
                        Edit Review
                      </Link>
                    )}

                    {(user?.role === "ADMIN" ||
                      review.user?.id === user?.id) && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="rounded-full bg-red-500/20 px-5 py-2 text-red-300 transition hover:bg-red-500/30"
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
