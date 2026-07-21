"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();

  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        marginBottom: "25px",
        alignItems: "center",
      }}
    >
      <Link href="/">Home</Link>

      <Link href="/movies">Movies</Link>

      <Link href="/actors">Actors</Link>

      <Link href="/directors">Directors</Link>

      {user?.role === "ADMIN" && (
        <Link href="/admin">Admin</Link>
      )}
    
      {user?.role === "EDITOR" && (
        <Link href="/editor">Editor</Link>
      )}
       {user?.role === "VIEWER" && (
        <Link href="/viewer">Viewer</Link>
      )}
      
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}