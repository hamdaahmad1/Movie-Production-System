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

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    sortBy: "",
    order: "desc" as "asc" | "desc",
  });

  async function loadUsers() {
    try {
      const response = await getUsers({
        search: filters.search,
        role: filters.role || undefined,
        sortBy: filters.sortBy,
        order: filters.order,
        page,
        limit: 5,
      });

      setUsers(response.data);

      setTotalPages(response.totalPages);
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
  }, [user, page, filters]);

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) {
      return;
    }

    try {
      const result = await deleteUser(id);

      if (!result.success) {
        alert(result.message || "Failed to delete user.");
        return;
      }

      alert("User deleted successfully!");

      loadUsers();
    } catch (error) {
      console.error(error);

      alert("Something went wrong.");
    }
  }

  function handleFilterChange(key: string, value: string) {
    setPage(1);

    setFilters({
      ...filters,
      [key]: value,
    });
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

        <button onClick={() => router.push("/")}>Home</button>

        <br />
        <br />

        <Link href="/admin/users/create">Create User</Link>

        <br />
        <br />

        <h3>Search & Filter</h3>

        <input
          type="text"
          placeholder="Search users..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />

        <br />
        <br />

        <select
          value={filters.role}
          onChange={(e) => handleFilterChange("role", e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="EDITOR">EDITOR</option>
          <option value="VIEWER">VIEWER</option>
        </select>

        <br />
        <br />

        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="username">Username</option>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="email">Email</option>
          <option value="role">Role</option>
          <option value="createdAt">Created Date</option>
        </select>

        <br />
        <br />

        <select
          value={filters.order}
          onChange={(e) =>
            handleFilterChange("order", e.target.value as "asc" | "desc")
          }
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        <br />
        <br />

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px",
              }}
            >
              <h2>
                {item.firstName} {item.lastName}
              </h2>

              <p>
                <strong>Username:</strong> {item.username}
              </p>

              <p>
                <strong>Email:</strong> {item.email}
              </p>

              <p>
                <strong>Role:</strong> {item.role}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {new Date(item.createdAt).toLocaleDateString("en-GB")}
              </p>

              <Link href={`/admin/users/edit/${item.id}`}>Edit</Link>

              {" | "}

              <button onClick={() => handleDelete(item.id)}>Delete</button>
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

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
