import API from "./api";

export async function getAdminDashboard() {
  const response = await API.get("/dashboard/admin", {
    withCredentials: true,
  });

  return response.data;
}
export async function getEditorDashboard(){

    const response =
    await API.get("/dashboard/editor",{
       withCredentials:true
    });
   
    return response.data;
   
   }