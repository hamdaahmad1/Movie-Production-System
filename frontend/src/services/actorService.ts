import { Actor } from "@/types/actor";

const API = "http://localhost:3001/actors";

// =========================
// GET ALL ACTORS
// =========================

export async function getActors() {
  const res = await fetch(API, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch actors");
  }

  return res.json();
}

// =========================
// GET ONE ACTOR
// =========================

export async function getActor(id: number) {
  const res = await fetch(`${API}/${id}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Actor not found");
  }

  return res.json();
}

// =========================
// CREATE ACTOR
// =========================

export async function createActor(
  actor: Omit<Actor, "id">,
) {
  const res = await fetch(API, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify({
      name: actor.name,
      dob: actor.dob,
      nationality: actor.nationality,
      gender: actor.gender,
      biography: actor.biography,
      awards: actor.awards,
      imagePath: actor.imagePath,
    }),
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(
      Array.isArray(error.message)
        ? error.message.join(", ")
        : error.message || "Failed to create actor",
    );
  }

  return res.json();
}

// =========================
// UPDATE ACTOR
// =========================

export async function updateActor(
  id: number,
  actor: Omit<Actor, "id">,
) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify({
      name: actor.name,
      dob: actor.dob,
      nationality: actor.nationality,
      gender: actor.gender,
      biography: actor.biography,
      awards: actor.awards,
      imagePath: actor.imagePath,
    }),
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(
      Array.isArray(error.message)
        ? error.message.join(", ")
        : error.message || "Failed to update actor",
    );
  }

  return res.json();
}

// =========================
// DELETE ACTOR
// =========================

export async function deleteActor(id: number) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  return {
    success: res.ok,
    message: data.message,
  };
}