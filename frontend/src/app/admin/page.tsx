"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import Navbar from "../components/Navbar";

import { getAdminDashboard } from "@/services/dashboardService";

import { AdminDashboard } from "@/types/dashboard";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();

  const { user, loading} = useAuth();

  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);

  const [error, setError] = useState("");
  const ITEMS_PER_PAGE = 5;

  const [moviePage, setMoviePage] = useState(1);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/movies");
      return;
    }

    loadDashboard();
  }, [user, loading]);

  async function loadDashboard() {
    try {
      const data = await getAdminDashboard();

      setDashboard(data);
    } catch {
      setError("Failed to load dashboard");
    }
  }

  const paginatedMovies =
    dashboard?.recentMovies.slice(
      (moviePage - 1) * ITEMS_PER_PAGE,
      moviePage * ITEMS_PER_PAGE
    ) || [];

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div style={{ padding: "30px" }}>
      <Navbar />

      <h1>Admin Dashboard</h1>
      <Link href="/admin/users">Manage Users</Link>

      <p>
        Welcome <strong>{user.firstName}</strong>
      </p>

      <br />
      <br />

      {error && <p>{error}</p>}

      {dashboard && (
        <>
          <h2>Statistics</h2>

          <div>
            <p>
              Total Movies:
              <strong> {dashboard.totalMovies}</strong>
            </p>

            <p>
              Total Actors:
              <strong> {dashboard.totalActors}</strong>
            </p>

            <p>
              Total Directors:
              <strong> {dashboard.totalDirectors}</strong>
            </p>

            <p>
              Total Users:
              <strong> {dashboard.totalUsers}</strong>
            </p>
          </div>

          <br />

          <h2>Recent Movies</h2>

          {paginatedMovies.map((movie) => (
            <div
              key={movie.id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
            >
              {movie.posterPath && (
                <img
                  src={movie.posterPath}
                  alt={movie.title}
                  style={{
                    width: "150px",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "15px",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}

              <h3>{movie.title}</h3>

              <p>
                <strong>Rating:</strong> {movie.rating}/10
              </p>

              <p>
                <strong>Genre:</strong> {movie.genre}
              </p>

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
            </div>
          ))}
          <div style={{ marginTop: "20px" }}>
            <button
              disabled={moviePage === 1}
              onClick={() => setMoviePage((p) => p - 1)}
            >
              Previous
            </button>

            <span style={{ margin: "0 10px" }}>Page {moviePage}</span>

            <button
              disabled={
                moviePage * ITEMS_PER_PAGE >= dashboard.recentMovies.length
              }
              onClick={() => setMoviePage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
