"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getMovies, deleteMovie } from "@/services/movieService";

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);

  async function loadMovies() {
    const data = await getMovies();

    setMovies(data);
  }

  useEffect(() => {
    loadMovies();
  }, []);

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

  return (
    <div>
      <h1>Movies</h1>

      <button>
        <Link href="/">Home</Link>
      </button>

      <button>
        <Link href="/movies/create">Create Movie</Link>
      </button>

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

            <img
              src={movie.posterUrl}
              alt={movie.title}
              style={{
                width: "180px",
                height: "260px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            />

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
              <strong>Director:</strong> {movie.director?.name}
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

            <Link href={`/movies/edit/${movie.id}`}>Edit</Link>

            {"  "}

            <button onClick={() => handleDelete(movie.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}
