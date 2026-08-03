"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import MovieCard from "@/app/components/MovieCard";
import { getActor, deleteActor } from "@/services/actorService";
import { getMovie } from "@/services/movieService";
import { Actor } from "@/types/actor";
import { Movie } from "@/types/movie";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function ActorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { user, loading } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isEditor = user?.role === "EDITOR";

  const [actor, setActor] = useState<Actor | null>(null);
  const [loadingActor, setLoadingActor] = useState(true);

  const [actorMovies, setActorMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    async function loadActor() {
      setLoadingActor(true);
      try {
        const data = await getActor(id);
        setActor(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load actor.");
      } finally {
        setLoadingActor(false);
      }
    }

    if (id) loadActor();
  }, [id]);

  useEffect(() => {
    async function loadActorMovies() {
      if (!actor?.movies || actor.movies.length === 0) {
        setActorMovies([]);
        setLoadingMovies(false);
        return;
      }

      setLoadingMovies(true);
      try {
        const results = await Promise.all(
          actor.movies.map((m) => getMovie(m.id))
        );
        setActorMovies(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingMovies(false);
      }
    }

    loadActorMovies();
  }, [actor]);

  async function handleDelete() {
    const result = await Swal.fire({
      title: "Delete Actor?",
      text: "Are you sure you want to delete this actor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      background: "#121a33",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      const toastId = toast.loading("Deleting actor...");
      const response = await deleteActor(id);
      toast.dismiss(toastId);

      if (!response.success) {
        toast.error(response.message || "Failed to delete actor.");
        return;
      }

      toast.success("Actor deleted successfully!");
      router.push("/actors");
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 403) {
        toast.error("You can only delete actors that you created.");
        return;
      }
      toast.error("Failed to delete actor.");
    }
  }

  if (loading || loadingActor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900 text-white">
        Loading actor...
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900 text-white">
        Actor not found.
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

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-10 shadow-2xl">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-end">
            <div className="mx-auto flex-shrink-0 sm:mx-0">
              {actor.imagePath ? (
                <img
                  src={actor.imagePath}
                  alt={actor.name}
                  className="h-[360px] w-[240px] rounded-2xl border-4 border-white/10 object-cover shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-[360px] w-[240px] items-center justify-center rounded-2xl border-4 border-white/10 bg-navy-700 text-sm text-ink-400">
                  No photo
                </div>
              )}
            </div>

            <div className="max-w-3xl pb-2">
              <h1 className="text-5xl font-bold text-white lg:text-6xl">
                {actor.name}
              </h1>

              <p className="mt-4 text-xl text-gray-200">
                {actor.nationality} • {actor.gender}
              </p>

              <p className="mt-5 leading-7 text-gray-300">{actor.biography}</p>

              <div className="mt-6 flex flex-wrap gap-5 text-white">
                <span>
                  🎂{" "}
                  {actor.dob
                    ? new Date(actor.dob).toLocaleDateString("en-GB")
                    : "Unknown"}
                </span>
                <span>🏆 {actor.awards} awards</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-10 shadow-2xl">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-white">Actor Details</h2>
            <p className="mt-2 text-ink-400">
              Additional information about this actor.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Date of Birth
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {actor.dob
                  ? new Date(actor.dob).toLocaleDateString("en-GB")
                  : "Unknown"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Gender
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {actor.gender}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Nationality
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {actor.nationality}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Awards
              </p>
              <p className="mt-2 text-xl font-semibold text-yellow-400">
                🏆 {actor.awards}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-2">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Biography
              </p>
              <p className="mt-3 leading-7 text-ink-300">{actor.biography}</p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white">Movies</h2>
            <p className="mt-2 text-ink-400">Titles featuring {actor.name}.</p>
          </div>

          {loadingMovies ? (
            <p className="text-ink-400">Loading movies...</p>
          ) : actorMovies.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-navy-800 p-12 text-center">
              <p className="text-lg text-ink-400">No movies yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {actorMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>

        {(isAdmin || isEditor) && (
          <div className="mt-10 flex gap-3">
            <Link
              href={`/actors/edit/${actor.id}`}
              className="rounded-full bg-white/10 px-5 py-2 text-white transition hover:bg-white/20"
            >
              Edit Actor
            </Link>

            {(isAdmin || actor.createdById === user?.id) && (
              <button
                onClick={handleDelete}
                className="rounded-full bg-red-500/20 px-5 py-2 text-red-300 transition hover:bg-red-500/30"
              >
                Delete Actor
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
