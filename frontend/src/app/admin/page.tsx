"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "../components/Navbar";

export default function AdminPage() {
  const router = useRouter();

  const { user, loading, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";
const isEditor = user?.role === "EDITOR";
const isViewer = user?.role === "VIEWER";

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/movies");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  async function handleLogout() {
    await logout();

    router.replace("/login");
  }

  return (
    <div style={{ padding: "30px" }}>
        <Navbar/>

      <h1>Admin Dashboard</h1>

      <p>
        Welcome <strong>{user.firstName}</strong>
      </p>

      <br />
    </div>
  );
}
