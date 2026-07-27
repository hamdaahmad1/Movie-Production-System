"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import Navbar from "@/app/components/Navbar";

import { useAuth } from "@/context/AuthContext";

import { getUser, updateUser } from "@/services/userService";
import { authService } from "@/services/authService";

import toast from "react-hot-toast";

export default function EditUserPage() {
  const router = useRouter();

  const params = useParams();

  const id = Number(params.id);

  const { user, loading } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "VIEWER",
  });

  const [oldEmail, setOldEmail] = useState("");

  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/");
      return;
    }

    loadUser();
  }, [user, loading]);

  async function loadUser() {
    const toastId = toast.loading("Loading user...");
    try {
      const data = await getUser(id);

      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
      });

      setOldEmail(data.email);
      toast.dismiss(toastId);
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);

      toast.error("Failed to load user");
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

    if (name === "email") {
      checkEmail(value);
    }
  }

  async function checkEmail(email: string) {
    if (!email) {
      setEmailAvailable(null);
      return;
    }

    if (email === oldEmail) {
      setEmailAvailable(true);
      return;
    }

    try {
      const result = await authService.checkEmail(email);

      setEmailAvailable(result.available);
    } catch {
      setEmailAvailable(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (emailAvailable === false) {
      toast.error("Email already exists");

      return;
    }
    setSaving(true);
    const toastId = toast.loading("Updating user...");

    try 
    {
    

      await updateUser(id, form);
      toast.dismiss(toastId);

      toast.success("User updated successfully");

      router.push("/admin/users");
    } catch (error: any) 
    {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
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
        <h1>Edit User</h1>

        

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

          <label>Email</label>

          <br />

          <input name="email" value={form.email} onChange={handleChange} />

          {emailAvailable === true && (
            <p style={{ color: "green" }}>Email is available.</p>
          )}

          {emailAvailable === false && (
            <p style={{ color: "red" }}>Email already exists.</p>
          )}

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

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
}
