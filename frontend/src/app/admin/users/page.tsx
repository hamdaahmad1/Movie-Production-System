"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { Playfair_Display, JetBrains_Mono } from "next/font/google";

import Navbar from "@/app/components/Navbar";

import { useAuth } from "@/context/AuthContext";

import { getUsers, deleteUser } from "@/services/userService";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Palette — identical to the rest of the app, so every page reads as one product.
const INK = "#0B1120"; // page background
const PANEL = "#15181F"; // card background
const GOLD = "#E8B84B"; // marquee accent / admin
const CRIMSON = "#C1443B"; // curtain accent / editor / destructive
const TEAL = "#3FA9A0"; // screen-glow accent / viewer
const PAPER = "#F3EFE7"; // primary text
const MUTED = "#8B90A0"; // secondary text

const ROLE_STYLES: Record<string, { bg: string; color: string }> = {
  ADMIN: { bg: `${GOLD}1A`, color: GOLD },
  EDITOR: { bg: `${CRIMSON}1A`, color: CRIMSON },
  VIEWER: { bg: `${TEAL}1A`, color: TEAL },
};

function roleStyle(role: string) {
  return ROLE_STYLES[role] || { bg: "rgba(255,255,255,0.08)", color: MUTED };
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={MUTED} strokeWidth="1.6" />
      <path
        d="m20 20-4.3-4.3"
        stroke={MUTED}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="m6 9 6 6 6-6"
        stroke={MUTED}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface UserRow {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  [key: string]: any;
}

export default function UsersPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [users, setUsers] = useState<UserRow[]>([]);

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
        limit: 10,
      });

      setUsers(response.data);

      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Failed to load users.");
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
    const result = await Swal.fire({
      title: "Delete Actor?",
      text: "Are you sure you want to delete this actor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      background: "#121a33",
      color: "#fff",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const result = await deleteUser(id);

      if (!result.success) {
        toast.error(result.message || "Failed to delete user.");
        return;
      }

      toast.success("User deleted successfully!");

      loadUsers();
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong.");
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
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: INK }}
      >
        <p
          className={`${mono.className} text-xs tracking-[0.3em]`}
          style={{ color: MUTED }}
        >
          LOADING...
        </p>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const selectClass =
    "w-full appearance-none rounded-xl border py-2.5 pl-4 pr-9 text-sm outline-none transition disabled:opacity-50";

  return (
    <div className="min-h-screen" style={{ backgroundColor: INK }}>
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* HERO */}
        <div
          className="relative mb-10 overflow-hidden rounded-3xl border border-white/5 p-8 shadow-2xl lg:p-10"
          style={{
            background: `linear-gradient(135deg, ${PANEL} 0%, #12141B 55%, #0F1116 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
            style={{ backgroundColor: `${GOLD}1A` }}
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full blur-3xl"
            style={{ backgroundColor: `${CRIMSON}1A` }}
          />

          {/* marquee lights */}
          <div className="relative mb-8 flex flex-wrap gap-2">
            {Array.from({ length: 28 }).map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: GOLD,
                  animation: `marquee-pulse 2.4s ease-in-out ${
                    i * 0.08
                  }s infinite`,
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span
                className={`${mono.className} inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.2em]`}
                style={{
                  borderColor: `${GOLD}4D`,
                  backgroundColor: `${GOLD}1A`,
                  color: GOLD,
                }}
              >
                USER MANAGEMENT
              </span>

              <h1
                className={`${playfair.className} mt-5 text-4xl font-bold leading-tight lg:text-5xl`}
                style={{ color: PAPER }}
              >
                Manage Users
              </h1>

              <p
                className="mt-3 max-w-xl text-[15px] leading-relaxed"
                style={{ color: MUTED }}
              >
                Search, filter, and manage every account on MovieVerse.
              </p>
            </div>

            <div className="flex w-fit gap-3">


              <Link
                href="/admin/users/create"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.03]"
                style={{
                  background: `linear-gradient(90deg, ${GOLD}, ${CRIMSON})`,
                  color: INK,
                }}
              >
                + Create User
              </Link>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div
          className="mb-8 rounded-2xl border border-white/5 p-6"
          style={{ backgroundColor: PANEL }}
        >
          <h3
            className={`${mono.className} mb-4 text-xs font-semibold uppercase tracking-widest`}
            style={{ color: MUTED }}
          >
            Search &amp; Filter
          </h3>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </span>

              <input
                type="text"
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition"
                style={{
                  backgroundColor: INK,
                  borderColor: "rgba(255,255,255,0.08)",
                  color: PAPER,
                }}
              />
            </div>

            <div className="relative w-full md:w-44">
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                className={selectClass}
                style={{
                  backgroundColor: INK,
                  borderColor: "rgba(255,255,255,0.08)",
                  color: PAPER,
                }}
              >
                <option value="">All Roles</option>
                <option value="ADMIN">ADMIN</option>
                <option value="EDITOR">EDITOR</option>
                <option value="VIEWER">VIEWER</option>
              </select>
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                <ChevronIcon />
              </span>
            </div>

            <div className="relative w-full md:w-48">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className={selectClass}
                style={{
                  backgroundColor: INK,
                  borderColor: "rgba(255,255,255,0.08)",
                  color: PAPER,
                }}
              >
                <option value="">Sort By</option>
                <option value="username">Username</option>
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
                <option value="createdAt">Created Date</option>
              </select>
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                <ChevronIcon />
              </span>
            </div>

            <div className="relative w-full md:w-40">
              <select
                value={filters.order}
                onChange={(e) =>
                  handleFilterChange("order", e.target.value as "asc" | "desc")
                }
                className={selectClass}
                style={{
                  backgroundColor: INK,
                  borderColor: "rgba(255,255,255,0.08)",
                  color: PAPER,
                }}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                <ChevronIcon />
              </span>
            </div>
          </div>
        </div>

        {/* USER LIST */}
        {users.length === 0 ? (
          <div
            className="rounded-2xl border border-white/5 p-10 text-center"
            style={{ backgroundColor: PANEL }}
          >
            <p style={{ color: MUTED }}>No users found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {users.map((item) => {
              const role = roleStyle(item.role);

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 rounded-2xl border border-white/5 p-5 shadow-lg transition hover:border-white/10 sm:flex-row sm:items-center sm:justify-between"
                  style={{ backgroundColor: PANEL }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`${mono.className} flex h-12 w-12 flex-none items-center justify-center rounded-full text-sm font-semibold`}
                      style={{ backgroundColor: role.bg, color: role.color }}
                    >
                      {item.firstName?.[0]}
                      {item.lastName?.[0]}
                    </div>

                    <div>
                      <h3
                        className="text-base font-semibold"
                        style={{ color: PAPER }}
                      >
                        {item.firstName} {item.lastName}
                      </h3>
                      <p className="text-sm" style={{ color: MUTED }}>
                        @{item.username} · {item.email}
                      </p>
                      <p
                        className={`${mono.className} mt-1 text-[11px] tracking-wide`}
                        style={{ color: MUTED }}
                      >
                        JOINED{" "}
                        {new Date(item.createdAt)
                          .toLocaleDateString("en-GB")
                          .toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-none items-center gap-3">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-medium"
                      style={{ backgroundColor: role.bg, color: role.color }}
                    >
                      {item.role}
                    </span>

                    <Link
                      href={`/admin/users/edit/${item.id}`}
                      className="rounded-full px-4 py-1.5 text-sm font-medium transition hover:opacity-80"
                      style={{ backgroundColor: `${GOLD}1A`, color: GOLD }}
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-full px-4 py-1.5 text-sm font-medium transition hover:opacity-80"
                      style={{ backgroundColor: `${CRIMSON}1A`, color: CRIMSON }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            aria-label="Previous page"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: PANEL, color: PAPER }}
          >
            ‹
          </button>

          <span
            className={`${mono.className} text-xs tracking-widest`}
            style={{ color: MUTED }}
          >
            PAGE {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            aria-label="Next page"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: PANEL, color: PAPER }}
          >
            ›
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-pulse {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}
