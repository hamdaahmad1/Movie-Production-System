"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getDirectors, deleteDirector } from "@/services/directorService";

export default function DirectorsPage() {
  const [directors, setDirectors] = useState<any[]>([]);

  async function loadDirectors() {
    const data = await getDirectors();
    setDirectors(data);
  }

  useEffect(() => {
    loadDirectors();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this director?")) return;

    await deleteDirector(id);

    alert("Director deleted successfully!");

    loadDirectors();
  }

  return (
    <div>
      <h1>Directors</h1>

      <Link href="/directors/create">Create Director</Link>

      <br />
      <br />

      {directors.map((director) => (
        <div
          key={director.id}
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{director.name}</h3>

          <p>Date of Birth: {director.dob}</p>

          <p>
            Movies:{" "}
            {director.movies?.map((movie: any) => movie.title).join(", ")}
          </p>

          <Link href={`/directors/edit/${director.id}`}>Edit</Link>

          {"  "}

          <button onClick={() => handleDelete(director.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
