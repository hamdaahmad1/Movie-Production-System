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
  formData: FormData
) {
  const response = await API.post(
    "/movies",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      withCredentials: true,
    }
  );

  return response.data;
}


export async function updateMovie(
  id: number,
  formData: FormData
) {
  const response = await API.put(
    `/movies/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },

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