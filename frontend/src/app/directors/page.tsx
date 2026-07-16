"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDirectors, deleteDirector } from "@/services/directorService";
import { Director } from "@/types/director";

import Navbar from "@/app/components/Navbar";

export default function DirectorsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isEditor = user?.role === "EDITOR";

  const [directors, setDirectors] = useState<Director[]>([]);

  async function loadDirectors() {
    try {
      const data = await getDirectors();

      setDirectors(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadDirectors();
  }, []);

  async function handleDelete(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this director?"
    );

    if (!confirmDelete) return;

    try {
      const result = await deleteDirector(id);

      if (!result.success) {
        alert(result.message || "Failed to delete director.");

        return;
      }

      alert("Director deleted successfully!");

      loadDirectors();
    } catch (error) {
      console.error(error);

      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      <Navbar />

      <h1>Directors</h1>

      <button onClick={() => router.push("/")}>Home</button>

      <br />
      <br />

      {isAdmin && <Link href="/directors/create">Create Director</Link>}

      <br />
      <br />

      {directors.length === 0 ? (
        <p>No directors found.</p>
      ) : (
        directors.map((director) => (
          <div
            key={director.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h2>{director.name}</h2>

            {director.imagePath ? (
              <img
                src={director.imagePath}
                alt={director.name}
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
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <p>No image available</p>
            )}

            <p>
              Date of Birth:{" "}
              {new Date(director.dob).toLocaleDateString("en-GB")}
            </p>

            <p>
              <strong>Nationality:</strong> {director.nationality}
            </p>

            <p>
              <strong>Biography:</strong> {director.biography}
            </p>

            <p>
              <strong>Movies:</strong>{" "}
              {director.movies?.length
                ? director.movies.map((movie) => movie.title).join(", ")
                : "No movies"}
            </p>

            {(isAdmin || isEditor) && (
              <Link href={`/directors/edit/${director.id}`}>Edit</Link>
            )}

            {" | "}

            {isAdmin && (
              <button onClick={() => handleDelete(director.id)}>Delete</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
