import { Director } from "@/types/director";

const API = "http://localhost:3001/directors";

export async function getDirectors() {
  const res = await fetch(API, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch directors");
  }

  return res.json();
}

export async function getDirector(id: number) {
  const res = await fetch(`${API}/${id}`);

  if (!res.ok) {
    throw new Error("Director not found");
  }

  return res.json();
}

export async function createDirector(
  director: Omit<Director, "id">
) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(director),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create director");
  }

  return res.json();
}

export async function updateDirector(
  id: number,
  director: Omit<Director, "id">
) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(director),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update director");
  }

  return res.json();
}

export async function deleteDirector(id: number) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
  
    return {
      success: false,
      message: error.message,
    };
  }
  
  return {
    success: true,
    data: await res.json(),
  };
}