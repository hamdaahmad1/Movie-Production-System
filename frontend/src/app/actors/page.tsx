"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getActors, deleteActor } from "@/services/actorService";

export default function ActorsPage() {
  const [actors, setActors] = useState<any[]>([]);

  async function loadActors() {
    const data = await getActors();
    setActors(data);
  }

  useEffect(() => {
    loadActors();
  }, []);

  async function handleDelete(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this actor?"
    );

    if (!confirmDelete) return;

    await deleteActor(id);

    alert("Actor deleted successfully!");

    loadActors();
  }

  return (
    <div>
      <h1>Actors</h1>

      <Link href="/actors/create">Create Actor</Link>

      <br />
      <br />

      {actors.map((actor) => (
        <div
          key={actor.id}
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{actor.name}</h3>

          <p>Date of Birth: {actor.dob}</p>

          <p>Nationality: {actor.nationality}</p>

          <p>
            Movies: {actor.movies?.map((movie: any) => movie.title).join(", ")}
          </p>

          <Link href={`/actors/edit/${actor.id}`}>Edit</Link>

          {"  "}

          <button onClick={() => handleDelete(actor.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
