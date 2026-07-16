"use client";

import Navbar from "@/app/components/Navbar";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ViewerPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "VIEWER") {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar />

      <div>
        <h1>Viewer Dashboard</h1>

        <p>Welcome, {user?.firstName}!</p>

        <hr />

        <h3>What You Can Do</h3>

        <ul>
          <li>View Movies</li>
          <li>View Actors</li>
          <li>View Directors</li>
        </ul>

        <hr />
      </div>
    </>
  );
}
