"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getMovies, deleteMovie } from "@/services/movieService";

export default function Home() {
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

    await deleteMovie(id);

    alert("Movie Deleted Successfully!");

    loadMovies();
  }

  return (
    <div>
      <h1>Movies</h1>

      <Link href="/movies/create">Create Movie</Link>

      <br />
      <br />

      {movies.map((movie: any) => (
        <div
          key={movie.id}
          style={{
            border: "1px solid black",
            marginBottom: "15px",
            padding: "10px",
          }}
        >
          <h3>{movie.title}</h3>

          <p>Genre: {movie.genre}</p>

          <p>Release Year: {movie.release_year}</p>

          <p>Duration: {movie.duration} minutes</p>

          <p>Rating: {movie.rating}</p>

          <p>Director: {movie.director.name}</p>

          <p>
            Actors: {movie.actors.map((actor: any) => actor.name).join(", ")}
          </p>

          <Link href={`/movies/edit/${movie.id}`}>Edit</Link>

          {"  "}

          <button onClick={() => handleDelete(movie.id)}>Delete</button>

          <hr />
        </div>
      ))}
    </div>
  );
}
