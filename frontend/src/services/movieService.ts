
import { Movie } from "@/types/movie";
import API from "@/services/api"; 

export async function getMovies(params?: {
  search?: string;
  genre?: string;
  directorId?: number;
  actorId?: number;
  year?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}) {
  const response = await API.get("/movies", {
    params,
    withCredentials: true,
  });

  return response.data;
}


export async function getMovie(id: number) {
  const response = await API.get(`/movies/${id}`, {
    withCredentials: true,
  });

  return response.data;
}


export async function createMovie(
  movie: Omit<Movie, "id" | "director" | "actors">,
  actorIds: number[],
) {
  const response = await API.post(
    "/movies",
    {
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
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
}


export async function updateMovie(
  id: number,
  movie: Omit<Movie, "id" | "director" | "actors">,
  actorIds: number[],
) {
  const response = await API.put(
    `/movies/${id}`,
    {
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
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
}


export async function deleteMovie(id: number) {
  const response = await API.delete(`/movies/${id}`, {
    withCredentials: true,
  });

  return {
    success: true,
    message: response.data.message,
  };
}