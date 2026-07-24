import API from "@/services/api";


export async function getActors(params?: {
  search?: string;
  birthYear?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}) {
  const response = await API.get(
    "/actors",
    {
      params,

      withCredentials: true,
    }
  );

  return response.data;
}


export async function getActor(id: number) {
  const response = await API.get(
    `/actors/${id}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
}


export async function createActor(
  formData: FormData
) {
  const response = await API.post(
    "/actors",
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


export async function updateActor(
  id: number,
  formData: FormData
) {
  const response = await API.put(
    `/actors/${id}`,
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


export async function deleteActor(
  id: number
) {
  const response = await API.delete(
    `/actors/${id}`,
    {
      withCredentials: true,
    }
  );

  return {
    success: true,
    message: response.data.message,
  };
}