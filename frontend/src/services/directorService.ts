import { Director } from "@/types/director";

const API = "http://localhost:3001/directors";

// =========================
// GET ALL DIRECTORS
// =========================

export async function getDirectors() {
  const res = await fetch(API, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch directors");
  }

  return res.json();
}

// =========================
// GET ONE DIRECTOR
// =========================

export async function getDirector(id: number) {
  const res = await fetch(`${API}/${id}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Director not found");
  }

  return res.json();
}

// =========================
// CREATE DIRECTOR
// =========================

export async function createDirector(
  director: Omit<Director, "id">,
) {
  const res = await fetch(API, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify({
      name: director.name,
      dob: director.dob,
      nationality: director.nationality,
      biography: director.biography,
      imagePath: director.imagePath,
    }),
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(
      Array.isArray(error.message)
        ? error.message.join(", ")
        : error.message ||
            "Failed to create director",
    );
  }

  return res.json();
}

// =========================
// UPDATE DIRECTOR
// =========================

export async function updateDirector(
  id: number,
  director: Omit<Director, "id">,
) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify({
      name: director.name,
      dob: director.dob,
      nationality: director.nationality,
      biography: director.biography,
      imagePath: director.imagePath,
    }),
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(
      Array.isArray(error.message)
        ? error.message.join(", ")
        : error.message ||
            "Failed to update director",
    );
  }

  return res.json();
}

// =========================
// DELETE DIRECTOR
// =========================

export async function deleteDirector(id: number) {
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