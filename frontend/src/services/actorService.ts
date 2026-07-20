import { Actor } from "@/types/actor";
import API from "./api";

export async function getActors() {
  const response = await API.get("/actors", {
    withCredentials: true,
  });

  return response.data;
}


export async function getActor(id: number) {
  const response = await API.get(`/actors/${id}`, {
    withCredentials: true,
  });

  return response.data;
}


export async function createActor(
  actor: Omit<Actor, "id">
) {
  const response = await API.post(
    "/actors",
    {
      name: actor.name,
      dob: actor.dob,
      nationality: actor.nationality,
      gender: actor.gender,
      biography: actor.biography,
      awards: actor.awards,
      imagePath: actor.imagePath,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
}


export async function updateActor(
  id: number,
  actor: Omit<Actor, "id">
) {
  const response = await API.put(
    `/actors/${id}`,
    {
      name: actor.name,
      dob: actor.dob,
      nationality: actor.nationality,
      gender: actor.gender,
      biography: actor.biography,
      awards: actor.awards,
      imagePath: actor.imagePath,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
}


export async function deleteActor(id: number) {
  const response = await API.delete(`/actors/${id}`, {
    withCredentials: true,
  });

  return {
    success: true,
    message: response.data.message,
  };
}