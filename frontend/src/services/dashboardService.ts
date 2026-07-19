import API from "./api";

export async function getAdminDashboard() {
  const response = await API.get("/dashboard/admin", {
    withCredentials: true,
  });

  return response.data;
}