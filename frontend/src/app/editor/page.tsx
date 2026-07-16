"use client";

import Navbar from "@/app/components/Navbar";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function EditorPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "EDITOR") {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <div>
        <h1>Editor Dashboard</h1>

        <p>Welcome, {user?.firstName}!</p>

        <hr />

        <h3>What you can do</h3>

        <ul>
          <li>View Movies, Actors and Directors</li>
          <li>Create Movies, Actors and Directors</li>
          <li>Edit Movies, Actors and Directors</li>
          <li>Cannot Delete Movies, Actors or Directors</li>
        </ul>

        <hr />

        <h3>Quick Links</h3>

        <p><Link href="/movies">Movies</Link></p>
        <p><Link href="/actors">Actors</Link></p>
        <p><Link href="/directors">Directors</Link></p>
      </div>
    </>
  );
}