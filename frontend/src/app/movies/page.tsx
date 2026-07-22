"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

import { getMovies, deleteMovie } from "@/services/movieService";
import { getGenres } from "@/services/filterService";
import { getDirectors } from "@/services/directorService";
import { getActors } from "@/services/actorService";
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

    sortBy: "",

    order: "desc" as "asc" | "desc",
  });

  async function loadMovies() {
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

      setMovies(response.data);

      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(error);
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

  async function handleFavorite(movieId: number)
  
  {
    try {
      if (favorites.includes(movieId)) {
        await removeFavorite(movieId);

        setFavorites(favorites.filter((id) => id !== movieId));
      } else {
        await addFavorite(movieId);

        setFavorites([
          ...favorites,
          movieId
        ]);
      }
    } catch (error) {
      console.error(error);

      alert("Favorite operation failed");
    }
  }

  async function handleWatchlist(movieId: number) {
    try {
      if (watchlist.includes(movieId)) {
        await removeWatchlist(movieId);

        setWatchlist(watchlist.filter((id) => id !== movieId));
      } else {
        await addWatchlist(movieId);

        setWatchlist([...watchlist, movieId]);
      }
    } catch (error) {
      console.error(error);

      alert("Watchlist operation failed");
    }
  }

  async function handleDelete(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this movie?"
    );

    if (!confirmDelete) return;

    try {
      await deleteMovie(id);

      alert("Movie deleted successfully!");

      loadMovies();
    } catch (error) {
      console.error(error);

      alert("Failed to delete movie.");
    }
  }

  function handleFilterChange(key: string, value: string) {
    setPage(1);

    setFilters({
      ...filters,

      [key]: value,
    });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <Navbar />

      <h1>Movies</h1>

      <button onClick={() => router.push("/")}>Home</button>

      <br />
      <br />

      {isAdmin && <Link href="/movies/create">Create Movie</Link>}

      <br />
      <br />

      <h3>Search & Filter</h3>

      <input
        type="text"
        placeholder="Search movie title..."
        value={filters.search}
        onChange={(e) => handleFilterChange("search", e.target.value)}
      />

      <br />
      <br />

      <select
        value={filters.genre}
        onChange={(e) => handleFilterChange("genre", e.target.value)}
      >
        <option value="">All Genres</option>

        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      <br />
      <br />

      <select
        value={filters.directorId}
        onChange={(e) => handleFilterChange("directorId", e.target.value)}
      >
        <option value="">All Directors</option>

        {directors.map((director) => (
          <option key={director.id} value={director.id}>
            {director.name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <select
        value={filters.actorId}
        onChange={(e) => handleFilterChange("actorId", e.target.value)}
      >
        <option value="">All Actors</option>

        {actors.map((actor) => (
          <option key={actor.id} value={actor.id}>
            {actor.name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <input
        type="number"
        placeholder="Release Year"
        max={new Date().getFullYear()}
        value={filters.year}
        onChange={(e) => handleFilterChange("year", e.target.value)}
      />
      <br />
      <br />

      <select
        value={filters.sortBy}
        onChange={(e) => handleFilterChange("sortBy", e.target.value)}
      >
        <option value="">Sort By</option>

        <option value="title">Title</option>

        <option value="rating">Rating Score</option>

        <option value="year">Release Year</option>
      </select>

      <br />
      <br />

      <select
        value={filters.order}
        onChange={(e) => handleFilterChange("order", e.target.value)}
      >
        <option value="desc">Descending (Newest / Highest First)</option>

        <option value="asc">Ascending (Oldest / Lowest First)</option>
      </select>

      <br />
      <br />
      {movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            <h2>{movie.title}</h2>
            {movie.posterPath && (
              <img
                src={movie.posterPath}
                alt={movie.title}
                style={{
                  width: "180px",
                  height: "260px",
                  objectFit: "cover",
                }}
              />
            )}
            <p>
              <strong>Description:</strong>
              {movie.description}
            </p>
            <p>
              <strong>Duration:</strong>
              {movie.duration} minutes
            </p>
            <p>
              <strong>Language:</strong>
              {movie.language}
            </p>
            <p>
              <strong>Release Date:</strong>{" "}
              {movie.releaseDate
                ? new Date(movie.releaseDate).toLocaleDateString("en-GB")
                : "N/A"}
            </p>
            <p>
              <strong>Genre:</strong>
              {movie.genre}
            </p>
            <p>
              <strong>Rating:</strong>
              {movie.rating}/10
            </p>
            <p>
              <strong>Director:</strong>
              {movie.director?.name}
            </p>
            <p>
              <strong>Actors:</strong>

              {movie.actors?.length
                ? movie.actors.map((actor: any) => actor.name).join(", ")
                : "No actors"}
            </p>
            <Link href={`/movies/${movie.id}`}>View Reviews</Link>
            {" | "}
            {user.role === "VIEWER" && (
              <>
                <button onClick={() => handleFavorite(movie.id)}>
                  {favorites.includes(movie.id)
                    ? "Remove Favorite"
                    : "Add Favorite"}
                </button>

                {" | "}

                <button onClick={() => handleWatchlist(movie.id)}>
                  {watchlist.includes(movie.id)
                    ? "Remove Watchlist"
                    : "Add Watchlist"}
                </button>

                {" | "}

                <Link href={`/movies/${movie.id}/review`}>Write Review</Link>
              </>
            )}
            {(isAdmin || isEditor) && (
              <Link href={`/movies/edit/${movie.id}`}>Edit</Link>
            )}{" "}
            {isAdmin && (
              <button onClick={() => handleDelete(movie.id)}>Delete</button>
            )}
          </div>
        ))
      )}

      <br />

      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>

      <span style={{ margin: "20px" }}>
        Page {page} of {totalPages}
      </span>

      <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  );
}
