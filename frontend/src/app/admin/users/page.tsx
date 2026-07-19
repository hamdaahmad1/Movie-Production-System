"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import Navbar from "@/app/components/Navbar";

import { useAuth } from "@/context/AuthContext";

import { getUsers, deleteUser } from "@/services/userService";

export default function UsersPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [users, setUsers] = useState<any[]>([]);

  async function loadUsers() {
    try {
      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");

      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      loadUsers();
    }
  }, [user]);

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) return;

    try {
      await deleteUser(id);

      alert("User deleted successfully");

      loadUsers();
    } catch (error) {
      console.error(error);

      alert("Failed to delete user");
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h1>User Management</h1>

        <br />

        <Link href="/admin/users/create">Create User</Link>

        <br />
        <br />

        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          users.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h2>
                {item.firstName} {item.lastName}
              </h2>
              <p>Username: {item.username}</p>
              <p>Email: {item.email}</p>
              <p>Role: {item.role}</p>
              <p>Created: {new Date(item.createdAt).toLocaleDateString()}</p>
              <Link href={`/admin/users/edit/${item.id}`}>Edit</Link>{" "}
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
