"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import Navbar from "@/app/components/Navbar";
import CustomSelect from "@/app/components/CustomSelect";

import { useAuth } from "@/context/AuthContext";

import { getUser, updateUser } from "@/services/userService";
import { authService } from "@/services/authService";

import toast from "react-hot-toast";

const inputClass =
  "w-full rounded-lg bg-navy-700 border border-navy-600 px-3 py-2.5 text-sm text-white placeholder:text-ink-400 focus:outline-none focus:border-accent";
const labelClass = "mb-1.5 block text-sm font-medium text-ink-200";

const roleOptions = [
  { value: "ADMIN", label: "ADMIN" },
  { value: "EDITOR", label: "EDITOR" },
  { value: "VIEWER", label: "VIEWER" },
];

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 pt-2">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>}
      </div>
    </div>
  );
}

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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

    try {
      await updateUser(id, form);
      toast.dismiss(toastId);

      toast.success("User updated successfully");

      router.push("/admin/users");
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900 text-ink-200">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />

      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push("/admin/users")}
            className="rounded-full bg-navy-800 px-4 py-2 text-sm text-white hover:bg-navy-700"
          >
            ← Users List
          </button>
        </div>

        <h1 className="text-2xl font-bold text-white">Edit User</h1>
        <p className="mt-1 mb-6 text-sm text-ink-400">
          Update account details for this user.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-2xl border border-navy-700 bg-navy-800 p-6 shadow-xl shadow-black/20 md:p-8"
        >
          <SectionHeader title="Basic Details" />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="e.g. Jane"
                value={form.firstName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="e.g. Doe"
                value={form.lastName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <hr className="border-navy-700" />

          <SectionHeader
            title="Account"
            subtitle="Used to sign in to MovieVerse."
          />

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. jane.doe@example.com"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
            {emailAvailable === true && (
              <p className="mt-1.5 text-xs text-emerald-400">
                Email is available
              </p>
            )}
            {emailAvailable === false && (
              <p className="mt-1.5 text-xs text-rose-400">
                Email already exists
              </p>
            )}
          </div>

          <hr className="border-navy-700" />

          <SectionHeader
            title="Permissions"
            subtitle="Determines what this user can access."
          />

          <div>
            <label className={labelClass}>Role</label>
            <CustomSelect
              value={form.role}
              onChange={(val: string) =>
                setForm((prev) => ({ ...prev, role: val }))
              }
              options={roleOptions}
              placeholder="Select Role"
            />
          </div>

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/admin/users")}
              className="rounded-full border border-navy-600 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
