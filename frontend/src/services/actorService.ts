import { Actor } from "@/types/actor";

const API = "http://localhost:3001/actors";

export async function getActors() {
  const res = await fetch(API, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch actors");
  }

  return res.json();
}

export async function getActor(id: number) {
  const res = await fetch(`${API}/${id}`);

  if (!res.ok) {
    throw new Error("Actor not found");
  }

  return res.json();
}

export async function createActor(actor: Omit<Actor, "id">) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(actor),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create actor");
  }

  return res.json();
}

export async function updateActor(
  id: number,
  actor: Omit<Actor, "id">
) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(actor),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update actor");
  }

  return res.json();
}

export async function deleteActor(id: number) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete actor");
  }

  return res.json();
}