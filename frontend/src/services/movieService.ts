import { Movie } from "@/types/movie";

const API = "http://localhost:3001/movies";

export async function getMovies() {
  const res = await fetch(API, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  return res.json();
}

export async function getMovie(id: number) {
  const res = await fetch(`${API}/${id}`);

  if (!res.ok) {
    throw new Error("Movie not found");
  }

  return res.json();
}

export async function createMovie(movie: Omit<Movie, "id">) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create movie");
  }

  return res.json();
}

export async function updateMovie(
  id: number,
  movie: Omit<Movie, "id">
) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update movie");
  }

  return res.json();
}

export async function deleteMovie(id: number) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete movie");
  }

  return res.json();
}