"use client";

import Navbar from "@/app/components/Navbar";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import { getEditorDashboard } from "@/services/dashboardService";

export default function EditorPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [dashboard, setDashboard] = useState<any>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "EDITOR") {
      router.replace("/");
      return;
    }

    loadDashboard();
  }, [user, loading, router]);

  async function loadDashboard() {
    try {
      const data = await getEditorDashboard();

      setDashboard(data);
    } catch (error) {
      console.error(error);

      setError("Failed to load dashboard data.");
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user || user.role !== "EDITOR") {
    return null;
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h1>Editor Dashboard</h1>

        <p>
          Welcome, <strong>{user.firstName}</strong>!
        </p>

        <hr />

        <h3>What you can do</h3>

        <ul>
          <li>View Movies, Actors and Directors</li>

          <li>Edit Movies, Actors and Directors</li>

          <li>Cannot Delete Movies, Actors or Directors</li>
        </ul>

        <hr />

        <h2>Movie Statistics</h2>

        {error && <p>{error}</p>}

        {dashboard && (
          <>
            <p>
              Total Movies: <strong>{dashboard.totalMovies}</strong>
            </p>

            <h2>Recently Updated Movies</h2>

            {dashboard.recentMovies.length === 0 ? (
              <p>No movies found.</p>
            ) : (
              dashboard.recentMovies.map((movie: any) => (
                <div
                  key={movie.id}
                  style={{
                    border: "1px solid #ccc",
                    padding: "15px",
                    marginBottom: "15px",
                    borderRadius: "8px",
                  }}
                >
                  <h3>{movie.title}</h3>

                  {movie.posterPath && (
                    <img
                      src={movie.posterPath}
                      alt={movie.title}
                      width="150"
                      height="220"
                      style={{
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  )}

                  <p>
                    <strong>Director:</strong>{" "}
                    {movie.director?.name || "No director"}
                  </p>

                  <p>
                    <strong>Actors:</strong>{" "}
                    {movie.actors?.length
                      ? movie.actors.map((actor: any) => actor.name).join(", ")
                      : "No actors"}
                  </p>

                  <p>
                    Updated:{" "}
                    {new Date(movie.updatedAt).toLocaleDateString("en-GB")}
                  </p>

                  <Link href={`/movies/edit/${movie.id}`}>Edit Movie</Link>
                </div>
              ))
            )}
          </>
        )}

        <hr />

        <h3>Quick Links</h3>

        <p>
          <Link href="/movies">Movies</Link>
        </p>

        <p>
          <Link href="/actors">Actors</Link>
        </p>

        <p>
          <Link href="/directors">Directors</Link>
        </p>
      </div>
    </>
  );
}
