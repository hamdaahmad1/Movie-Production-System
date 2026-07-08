import { Director } from "@/types/director";

const API = "http://localhost:3001/directors";

export async function getDirectors() {
  const res = await fetch(API, {
    cache: "no-store",
  });

  return res.json();
}

export async function getDirector(id: number) {
  const res = await fetch(`${API}/${id}`);

  return res.json();
}

export async function createDirector(
  director: Omit<Director, "id">
) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(director),
  });
}

export async function updateDirector(
  id: number,
  director: Omit<Director, "id">
) {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(director),
  });
}

export async function deleteDirector(id: number) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
}