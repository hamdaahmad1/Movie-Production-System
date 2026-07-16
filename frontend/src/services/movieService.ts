
import { Movie } from "@/types/movie";

const API = "http://localhost:3001/movies";

export async function getMovies() {
  const res = await fetch(API, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  return res.json();
}


export async function getMovie(id: number) {
  const res = await fetch(`${API}/${id}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Movie not found");
  }

  return res.json();
}



export async function createMovie(
  movie: Omit<Movie, "id" | "director" | "actors">,
  actorIds: number[],
) {
  const res = await fetch(API, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify({
      title: movie.title,
      description: movie.description,
      releaseDate: movie.releaseDate,
      language: movie.language,
      posterPath: movie.posterPath,
      trailerId: movie.trailerId,
      duration: movie.duration,
      genre: movie.genre,
      rating: movie.rating,
      directorId: movie.directorId,
      actorIds: actorIds,
    }),
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(
      Array.isArray(error.message)
        ? error.message.join(", ")
        : error.message ||
            "Failed to create movie",
    );
  }

  return res.json();
}

export async function updateMovie(
  id: number,
  movie: Omit<Movie, "id" | "director" | "actors">,
  actorIds: number[],
) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify({
      title: movie.title,
      description: movie.description,
      releaseDate: movie.releaseDate,
      language: movie.language,
      posterPath: movie.posterPath,
      trailerId: movie.trailerId,
      duration: movie.duration,
      genre: movie.genre,
      rating: movie.rating,
      directorId: movie.directorId,
      actorIds: actorIds,
    }),
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(
      Array.isArray(error.message)
        ? error.message.join(", ")
        : error.message ||
            "Failed to update movie",
    );
  }

  return res.json();
}

export async function deleteMovie(id: number) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  return {
    success: res.ok,
    message: data.message,
  };
}