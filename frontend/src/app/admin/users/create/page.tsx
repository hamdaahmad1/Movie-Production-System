"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/context/AuthContext";

import { createUser } from "@/services/userService";
import { authService } from "@/services/authService";

export default function CreateUserPage() {
  const router = useRouter();
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  const { user, loading } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "VIEWER",
  });

  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

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
  async function checkUsername(username: string) {
    if (username.length < 4) {
      setUsernameAvailable(null);

      return;
    }

    try {
      const result = await authService.checkUsername(username);

      setUsernameAvailable(result.available);
    } catch {
      setUsernameAvailable(null);
    }
  }

  async function checkEmail(email: string) {
    if (!email.includes("@")) {
      setEmailAvailable(null);

      return;
    }

    try {
      const result = await authService.checkEmail(email);

      setEmailAvailable(result.available);
    } catch {
      setEmailAvailable(null);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (name === "username") {
      checkUsername(value);
    }

    if (name === "email") {
      checkEmail(value);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    if (usernameAvailable === false) {
      setError("Username already exists");

      return;
    }

    if (emailAvailable === false) {
      setError("Email already exists");

      return;
    }

    setSubmitting(true);

    try {
      await createUser(form);

      alert("User created successfully");

      router.push("/admin/users");
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create user");
    } finally {
      setSubmitting(false);
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
        <h1>Create User</h1>

        {error && <p>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>First Name</label>

          <br />

          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />

          <br />
          <br />

          <label>Last Name</label>

          <br />

          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />

          <br />
          <br />

          <label>Username</label>

          <br />

          <input
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          {usernameAvailable === true && (
            <p style={{ color: "green" }}>Username available</p>
          )}

          {usernameAvailable === false && (
            <p style={{ color: "red" }}>Username already exists</p>
          )}

          <br />
          <br />

          <label>Email</label>

          <br />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          {emailAvailable === true && (
            <p style={{ color: "green" }}>Email available</p>
          )}

          {emailAvailable === false && (
            <p style={{ color: "red" }}>Email already exists</p>
          )}

          <br />
          <br />

          <label>Password</label>

          <br />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <br />
          <br />

          <label>Role</label>

          <br />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="ADMIN">ADMIN</option>

            <option value="EDITOR">EDITOR</option>

            <option value="VIEWER">VIEWER</option>
          </select>

          <br />
          <br />

          <button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
