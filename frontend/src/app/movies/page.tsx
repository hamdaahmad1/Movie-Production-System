"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import MovieCard from "@/app/components/MovieCard";

import { getMovies, deleteMovie } from "@/services/movieService";
import { getGenres } from "@/services/filterService";
import { getDirectors } from "@/services/directorService";
import { getActors } from "@/services/actorService";
import CustomSelect from "@/app/components/CustomSelect";
import {
  addFavorite,
  removeFavorite,
  addWatchlist,
  removeWatchlist,
  getFavorites,
  getWatchlist,
} from "@/services/movieInteractionService";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function MoviesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isEditor = user?.role === "EDITOR";

  const [movies, setMovies] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [directors, setDirectors] = useState<any[]>([]);
  const [actors, setActors] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    directorId: "",
    actorId: "",
    year: "",
    sortBy: "rating",
    order: "desc" as "asc" | "desc",
  });

  async function loadMovies() {
    const toastId = toast.loading("Loading movies...");
    try {
      const response = await getMovies({
        search: filters.search,
        genre: filters.genre,
        directorId: filters.directorId ? Number(filters.directorId) : undefined,
        actorId: filters.actorId ? Number(filters.actorId) : undefined,
        year: filters.year ? Number(filters.year) : undefined,
        sortBy: filters.sortBy,
        order: filters.order,
        page,
        limit: 10,
      });
      toast.dismiss(toastId);
      setMovies(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Failed to load movies");
    }
  }

  async function loadFilters() {
    try {
      const [genresData, directorsData, actorsData] = await Promise.all([
        getGenres(),
        getDirectors(),
        getActors(),
      ]);
      setGenres(genresData);
      setDirectors(directorsData.data || directorsData);
      setActors(actorsData.data || actorsData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load filters");
    }
  }

  async function loadInteractions() {
    try {
      const favoritesData = await getFavorites();
      const watchlistData = await getWatchlist();
      setFavorites(favoritesData.map((item: any) => item.movie.id));
      setWatchlist(watchlistData.map((item: any) => item.movie.id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load favorites and watchlist");
    }
  }

  useEffect(() => {
    loadMovies();
  }, [page, filters]);

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    if (user?.role === "VIEWER") {
      loadInteractions();
    }
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (
      user.role !== "ADMIN" &&
      user.role !== "EDITOR" &&
      user.role !== "VIEWER"
    ) {
      router.replace("/movies");
    }
  }, [user, loading, router]);

  async function handleFavorite(movieId: number) {
    try {
      if (favorites.includes(movieId)) {
        await removeFavorite(movieId);
        toast.success("Removed from favorites");
        setFavorites(favorites.filter((id) => id !== movieId));
      } else {
        await addFavorite(movieId);
        toast.success("Added to favorites");
        setFavorites([...favorites, movieId]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Favorite operation failed");
    }
  }

  async function handleWatchlist(movieId: number) {
    try {
      if (watchlist.includes(movieId)) {
        await removeWatchlist(movieId);
        toast.success("Removed from watchlist");
        setWatchlist(watchlist.filter((id) => id !== movieId));
      } else {
        await addWatchlist(movieId);
        toast.success("Added to watchlist");
        setWatchlist([...watchlist, movieId]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Watchlist operation failed");
    }
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Delete Movie?",
      text: "Are you sure you want to delete this movie?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      background: "#121a33",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      const toastId = toast.loading("Deleting movie...");
      await deleteMovie(id);
      toast.dismiss(toastId);
      toast.success("Movie deleted successfully!");
      loadMovies();
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 403) {
        toast.error("You can only delete movies that you created.");
        return;
      }
      toast.error("Failed to delete movie");
    }
  }

  function handleFilterChange(key: string, value: string) {
    setPage(1);
    setFilters({ ...filters, [key]: value });
  }

  const inputClass =
    "rounded-lg bg-navy-800 border border-navy-600 px-3 py-2 text-sm text-white placeholder:text-ink-400 focus:outline-none focus:border-accent";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900 text-ink-200">
        Loading...
      </div>
    );
  }
  if (!user) return null;
  const genreOptions = [
    { value: "", label: "All Genres" },
    ...genres.map((genre) => ({
      value: genre,
      label: genre,
    })),
  ];

  const directorOptions = [
    { value: "", label: "All Directors" },
    ...directors.map((director) => ({
      value: String(director.id),
      label: director.name,
    })),
  ];

  const actorOptions = [
    { value: "", label: "All Actors" },
    ...actors.map((actor) => ({
      value: String(actor.id),
      label: actor.name,
    })),
  ];

  const sortOptions = [
    { value: "", label: "Sort By" },
    { value: "title", label: "Title" },
    { value: "rating", label: "Highest Rated" },
    { value: "year", label: "Release Year" },
  ];

  const orderOptions = [
    { value: "desc", label: "Descending" },
    { value: "asc", label: "Ascending" },
  ];

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-white">Movies</h1>
          {(isAdmin || isEditor) && (
            <Link
              href="/movies/create"
              className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              + Create Movie
            </Link>
          )}
        </div>

        <div className="mb-8 flex flex-wrap gap-3 rounded-2xl bg-navy-800 p-4">
          <input
            type="text"
            placeholder="Search movie title..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className={`${inputClass} flex-1 min-w-[200px]`}
          />

          <CustomSelect
            value={filters.genre}
            onChange={(value) => handleFilterChange("genre", value)}
            options={genreOptions}
            placeholder="All Genres"
            className="w-48"
          />

          <CustomSelect
            value={filters.directorId}
            onChange={(value) => handleFilterChange("directorId", value)}
            options={directorOptions}
            placeholder="All Directors"
            className="w-56"
          />

          <CustomSelect
            value={filters.actorId}
            onChange={(value) => handleFilterChange("actorId", value)}
            options={actorOptions}
            placeholder="All Actors"
            className="w-56"
          />

          <input
            type="number"
            placeholder="Release Year"
            max={new Date().getFullYear()}
            value={filters.year}
            onChange={(e) => handleFilterChange("year", e.target.value)}
            className={`${inputClass} w-32`}
          />

          <CustomSelect
            value={filters.sortBy}
            onChange={(value) => handleFilterChange("sortBy", value)}
            options={sortOptions}
            placeholder="Sort By"
            className="w-44"
          />

          <CustomSelect
            value={filters.order}
            onChange={(value) => handleFilterChange("order", value)}
            options={orderOptions}
            placeholder="Order"
            className="w-44"
          />
        </div>

        {movies.length === 0 ? (
          <p className="text-ink-400">No movies found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                actions={
                  <>
                    {user.role === "VIEWER" && (
                      <>
                        <button
                          onClick={() => handleFavorite(movie.id)}
                          className="rounded-full bg-navy-700 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-navy-600"
                        >
                          {favorites.includes(movie.id)
                            ? "♥ Favorited"
                            : "♡ Favorite"}
                        </button>
                        <button
                          onClick={() => handleWatchlist(movie.id)}
                          className="rounded-full bg-navy-700 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-navy-600"
                        >
                          {watchlist.includes(movie.id)
                            ? "✓ Watchlisted"
                            : "+ Watchlist"}
                        </button>
                      </>
                    )}
                    {(isAdmin || isEditor) && (
                      <Link
                        href={`/movies/edit/${movie.id}`}
                        className="rounded-full bg-navy-700 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-navy-600"
                      >
                        Edit
                      </Link>
                    )}
                    {(isAdmin || movie.createdById === user?.id) && (
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="rounded-full bg-rose-500/20 px-2.5 py-1 text-[11px] font-medium text-rose-300 hover:bg-rose-500/30"
                      >
                        Delete
                      </button>
                    )}
                  </>
                }
              />
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-full bg-navy-800 px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-ink-400">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-full bg-navy-800 px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
