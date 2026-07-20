"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "@/app/components/Navbar";

import { getActors, deleteActor } from "@/services/actorService";

import { Actor } from "@/types/actor";

import { useAuth } from "@/context/AuthContext";

export default function ActorsPage() {
  const router = useRouter();

  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const isEditor = user?.role === "EDITOR";

  const [actors, setActors] = useState<Actor[]>([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: "",

    birthYear: "",

    sortBy: "",

    order: "desc" as "asc" | "desc",
  });

  async function loadActors() {
    try {
      const response = await getActors({
        search: filters.search,

        birthYear: filters.birthYear ? Number(filters.birthYear) : undefined,

        sortBy: filters.sortBy,

        order: filters.order,

        page,

        limit: 5,
      });
      console.log("ACTORS RESPONSE:", response);

      setActors(response.data);

      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadActors();
  }, [page, filters]);

  async function handleDelete(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this actor?"
    );

    if (!confirmDelete) {
      return;
    }

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

  function handleFilterChange(key: string, value: string) {
    setPage(1);

    setFilters({
      ...filters,

      [key]: value,
    });
  }

  return (
    <div>
      <Navbar />

      <h1>Actors</h1>

      <button onClick={() => router.push("/")}>Home</button>

      <br />
      <br />

      {isAdmin && <Link href="/actors/create">Create Actor</Link>}

      <br />
      <br />

      <h3>Search & Filter</h3>

      <input
        type="text"
        placeholder="Search actor name..."
        value={filters.search}
        onChange={(e) => handleFilterChange("search", e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Birth Year"
        max={new Date().getFullYear()}
        value={filters.birthYear}
        onChange={(e) => handleFilterChange("birthYear", e.target.value)}
      />

      <br />
      <br />

      <select
        value={filters.sortBy}
        onChange={(e) => handleFilterChange("sortBy", e.target.value)}
      >
        <option value="">Sort By</option>

        <option value="name">Name</option>

        <option value="dob">Date of Birth</option>

        <option value="createdAt">Created Date</option>
      </select>

      <br />
      <br />

      <select
        value={filters.order}
        onChange={(e) => handleFilterChange("order", e.target.value)}
      >
        <option value="desc">Descending (Z-A / Newest)</option>

        <option value="asc">Ascending (A-Z / Oldest)</option>
      </select>

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

            {actor.imagePath ? (
              <img
                src={actor.imagePath}
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
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <p>No image available</p>
            )}

            <p>
              <strong>Date of Birth:</strong>{" "}
              {actor.dob
                ? new Date(actor.dob).toLocaleDateString("en-GB")
                : "N/A"}
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
              <strong>Movies:</strong>{" "}
              {actor.movies?.length
                ? actor.movies.map((movie: any) => movie.title).join(", ")
                : "No movies"}
            </p>

            {(isAdmin || isEditor) && (
              <Link href={`/actors/edit/${actor.id}`}>Edit</Link>
            )}

            {" | "}

            {isAdmin && (
              <button onClick={() => handleDelete(actor.id)}>Delete</button>
            )}
          </div>
        ))
      )}

      <br />

      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>

      <span style={{ margin: "20px" }}>
        Page {page} of {totalPages}
      </span>

      <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  );
}
