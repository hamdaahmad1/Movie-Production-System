import { Actor } from "@/types/actor";
const API ="http://localhost:3001/actors";

export async function getActors(){

    const res = await fetch(API,{
        cache:"no-store",
    });
    return res.json();
}

export async function getActor(id: number) {
    const res = await fetch(`${API}/${id}`);
  
    return res.json();
  }
  
  export async function createActor(actor: Omit<Actor, "id">) {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(actor),
    });
  }
  
  export async function updateActor(
    id: number,
    actor: Omit<Actor, "id">
  ) {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(actor),
    });
  }
  
  export async function deleteActor(id: number) {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
  }