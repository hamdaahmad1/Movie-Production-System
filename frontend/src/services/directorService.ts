import { Director } from "@/types/director";
import API from "./api";

export async function getDirectors(params?:{

  search?:string;
 
  birthYear?:number;
 
  sortBy?:string;
 
  order?:"asc"|"desc";
 
  page?:number;
 
  limit?:number;
 
 }){
 
 
  const response = await API.get("/directors",{
 
    params,
 
    withCredentials:true,
 
  });
  return response.data;
 
 }


export async function getDirector(id: number) {
  const response = await API.get(`/directors/${id}`, {
    withCredentials: true,
  });

  return response.data;
}


export async function createDirector(
  director: Omit<Director, "id">
) {
  const response = await API.post(
    "/directors",
    {
      name: director.name,
      dob: director.dob,
      nationality: director.nationality,
      biography: director.biography,
      imagePath: director.imagePath,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
}


export async function updateDirector(
  id: number,
  director: Omit<Director, "id">
) {
  const response = await API.put(
    `/directors/${id}`,
    {
      name: director.name,
      dob: director.dob,
      nationality: director.nationality,
      biography: director.biography,
      imagePath: director.imagePath,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
}


export async function deleteDirector(id: number) {
  const response = await API.delete(`/directors/${id}`, {
    withCredentials: true,
  });

  return {
    success: true,
    message: response.data.message,
  };
}