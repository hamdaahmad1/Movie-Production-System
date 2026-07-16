"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/app/components/Navbar";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <div style={{ padding: "30px" }}>
        <h1>Movie Management System</h1>

        <p>Welcome to the Movie Management System.</p>

        <br />

        <Link href="/register">
          <button>Register</button>
        </Link>

        <br />
        <br />

        <p>Already have an account?</p>

        <Link href="/login">
          <button>Login</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <Navbar />

      <h1>Movie Management System</h1>

      <p>
        Welcome <strong>{user.firstName}</strong> ({user.role})
      </p>

      <p>Select a module from the navigation bar.</p>
    </div>
  );
}