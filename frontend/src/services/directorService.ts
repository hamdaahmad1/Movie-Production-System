
import API from "@/services/api";


export async function getDirectors(params?: {
  search?: string;
  birthYear?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}) {
  const response = await API.get(
    "/directors",
    {
      params,

      withCredentials: true,
    }
  );

  return response.data;
}


export async function getDirector(id: number) {
  const response = await API.get(
    `/directors/${id}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
}


export async function createDirector(
  formData: FormData
) {
  const response = await API.post(
    "/directors",
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


export async function updateDirector(
  id: number,
  formData: FormData
) {
  const response = await API.put(
    `/directors/${id}`,
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


export async function deleteDirector(
  id: number
) {
  const response = await API.delete(
    `/directors/${id}`,
    {
      withCredentials: true,
    }
  );

  return {
    success: true,
    message: response.data.message,
  };
}