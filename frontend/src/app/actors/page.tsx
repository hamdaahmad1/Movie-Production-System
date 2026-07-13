"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getActors, deleteActor } from "@/services/actorService";
import { Actor } from "@/types/actor";

export default function ActorsPage() {
  const router = useRouter();

  const [actors, setActors] = useState<Actor[]>([]);

  async function loadActors() {
    try {
      const data = await getActors();
      setActors(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadActors();
  }, []);

  async function handleDelete(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this actor?"
    );

    if (!confirmDelete) return;

    try {
      const result = await deleteActor(id);

      if (!result.success) {
        alert(result.message || "Failed to delete actor.");
        return;
      }

      alert("Actor deleted successfully!");

      loadActors();
    } catch (error) {
      console.error(error);

      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      <h1>Actors</h1>

      <button onClick={() => router.push("/")}>Home</button>

      <br />
      <br />

      <Link href="/actors/create">Create Actor</Link>

      <br />
      <br />

      {actors.length === 0 ? (
        <p>No actors found.</p>
      ) : (
        actors.map((actor) => (
          <div
            key={actor.id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px",
            }}
          >
            <h2>{actor.name}</h2>

            <img
              src={actor.imageUrl}
              alt={actor.name}
              width={160}
              height={220}
              style={{
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ccc",
                display: "block",
                marginBottom: "15px",
              }}
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/160x220?text=No+Image";
              }}
            />

            <p>
              Date of Birth: {new Date(actor.dob).toLocaleDateString("en-GB")}
            </p>

            <p>
              <strong>Gender:</strong> {actor.gender}
            </p>

            <p>
              <strong>Biography:</strong> {actor.biography}
            </p>

            <p>
              <strong>Awards:</strong> {actor.awards}
            </p>

            <p>
              <strong>Nationality:</strong> {actor.nationality}
            </p>

            <p>
              <strong>Image URL:</strong> {actor.imageUrl}
            </p>

            <p>
              <strong>Movies:</strong>{" "}
              {actor.movies?.length
                ? actor.movies.map((movie: any) => movie.title).join(", ")
                : "No movies"}
            </p>

            <Link href={`/actors/edit/${actor.id}`}>Edit</Link>

            {" | "}

            <button onClick={() => handleDelete(actor.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}
