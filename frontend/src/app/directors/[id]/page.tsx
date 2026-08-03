"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import MovieCard from "@/app/components/MovieCard";
import { getDirector, deleteDirector } from "@/services/directorService";
import { getMovie } from "@/services/movieService";
import { Director } from "@/types/director";
import { Movie } from "@/types/movie";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function DirectorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { user, loading } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isEditor = user?.role === "EDITOR";

  const [director, setDirector] = useState<Director | null>(null);
  const [loadingDirector, setLoadingDirector] = useState(true);

  const [directorMovies, setDirectorMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    async function loadDirector() {
      setLoadingDirector(true);
      try {
        const data = await getDirector(id);
        setDirector(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load director.");
      } finally {
        setLoadingDirector(false);
      }
    }

    if (id) loadDirector();
  }, [id]);

  useEffect(() => {
    async function loadDirectorMovies() {
      if (!director?.movies || director.movies.length === 0) {
        setDirectorMovies([]);
        setLoadingMovies(false);
        return;
      }

      setLoadingMovies(true);
      try {
        const results = await Promise.all(
          director.movies.map((m) => getMovie(m.id))
        );
        setDirectorMovies(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingMovies(false);
      }
    }

    loadDirectorMovies();
  }, [director]);

  async function handleDelete() {
    const result = await Swal.fire({
      title: "Delete Director?",
      text: "Are you sure you want to delete this director?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      background: "#121a33",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      const toastId = toast.loading("Deleting director...");
      const response = await deleteDirector(id);
      toast.dismiss(toastId);

      if (!response.success) {
        toast.error(response.message || "Failed to delete director.");
        return;
      }

      toast.success("Director deleted successfully!");
      router.push("/directors");
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 403) {
        toast.error("You can only delete directors that you created.");
        return;
      }
      toast.error("Failed to delete director.");
    }
  }

  if (loading || loadingDirector) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900 text-white">
        Loading director...
      </div>
    );
  }

  if (!director) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900 text-white">
        Director not found.
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
              {director.imagePath ? (
                <img
                  src={director.imagePath}
                  alt={director.name}
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
                {director.name}
              </h1>

              <p className="mt-4 text-xl text-gray-200">
                {director.nationality}
              </p>

              <p className="mt-5 leading-7 text-gray-300">
                {director.biography}
              </p>

              <div className="mt-6 flex flex-wrap gap-5 text-white">
                <span>
                  🎂{" "}
                  {director.dob
                    ? new Date(director.dob).toLocaleDateString("en-GB")
                    : "Unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-10 shadow-2xl">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-white">Director Details</h2>
            <p className="mt-2 text-ink-400">
              Additional information about this director.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Date of Birth
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {director.dob
                  ? new Date(director.dob).toLocaleDateString("en-GB")
                  : "Unknown"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Nationality
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {director.nationality}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-2">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Biography
              </p>
              <p className="mt-3 leading-7 text-ink-300">
                {director.biography}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white">Movies</h2>
            <p className="mt-2 text-ink-400">
              Titles directed by {director.name}.
            </p>
          </div>

          {loadingMovies ? (
            <p className="text-ink-400">Loading movies...</p>
          ) : directorMovies.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-navy-800 p-12 text-center">
              <p className="text-lg text-ink-400">No movies yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {directorMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>

        {(isAdmin || isEditor) && (
          <div className="mt-10 flex gap-3">
            <Link
              href={`/directors/edit/${director.id}`}
              className="rounded-full bg-white/10 px-5 py-2 text-white transition hover:bg-white/20"
            >
              Edit Director
            </Link>

            {(isAdmin || director.createdById === user?.id) && (
              <button
                onClick={handleDelete}
                className="rounded-full bg-red-500/20 px-5 py-2 text-red-300 transition hover:bg-red-500/30"
              >
                Delete Director
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
