import API from "./api";

export async function getUsers(params?: {
  search?: string;
  role?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}) {
  const response = await API.get("/users", {
    params,
    withCredentials: true,
  });

  return response.data;
}


export async function deleteUser(id: number) {
  const response = await API.delete(`/users/${id}`, {
    withCredentials: true,
  });

  return response.data;
}


export async function getUser(id: number) {
  const response = await API.get(`/users/${id}`, {
    withCredentials: true,
  });

  return response.data;
}


export async function updateUser(
  id: number,
  data: any
) {
  const response = await API.patch(
    `/users/${id}`,
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
}


export async function createUser(data: any) {
  const response = await API.post(
    "/users",
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
}