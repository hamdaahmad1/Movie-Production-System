"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

import { getMovies, deleteMovie } from "@/services/movieService";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function MoviesPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isEditor = user?.role === "EDITOR";

  const [movies, setMovies] = useState<any[]>([]);

  async function loadMovies() {
    try {
      const data = await getMovies();

      setMovies(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadMovies();
  }, []);

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
                  borderRadius: "8px",
                  marginBottom: "15px",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}

            <p>
              <strong>Description:</strong> {movie.description}
            </p>

            <p>
              <strong>Release Date:</strong>{" "}
              {new Date(movie.releaseDate).toLocaleDateString("en-GB")}
            </p>

            <p>
              <strong>Duration:</strong> {movie.duration} minutes
            </p>

            <p>
              <strong>Genre:</strong> {movie.genre}
            </p>

            <p>
              <strong>Language:</strong> {movie.language}
            </p>

            <p>
              <strong>Rating:</strong> {movie.rating}/10
            </p>

            <p>
              <strong>Director:</strong> {movie.director?.name || "No director"}
            </p>

            <p>
              <strong>Actors:</strong>{" "}
              {movie.actors?.length
                ? movie.actors.map((actor: any) => actor.name).join(", ")
                : "No actors"}
            </p>

            <p>
              <strong>Trailer:</strong>{" "}
              <a
                href={movie.trailerId}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch Trailer
              </a>
            </p>

            <br />

            {(isAdmin || isEditor) && (
              <Link href={`/movies/edit/${movie.id}`}>Edit</Link>
            )}

            {"  "}

            {isAdmin && (
              <button onClick={() => handleDelete(movie.id)}>Delete</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
