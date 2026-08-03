"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@/app/components/Navbar";
import PersonCard from "@/app/components/PersonCard";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CustomSelect from "@/app/components/CustomSelect";

import { getDirectors, deleteDirector } from "@/services/directorService";

import { Director } from "@/types/director";

import toast from "react-hot-toast";
import Swal from "sweetalert2";
const GOLD = "#F4C430";
const CRIMSON = "#C1121F";
const INK = "#05070F";

export default function DirectorsPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isEditor = user?.role === "EDITOR";

  const [directors, setDirectors] = useState<Director[]>([]);


  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    birthYear: "",
    sortBy: "",
    order: "desc" as "asc" | "desc",
  });

  async function loadDirectors() {
    const toastId = toast.loading("Loading directors...");

    try {
      const response = await getDirectors({
        search: filters.search,
        birthYear: filters.birthYear ? Number(filters.birthYear) : undefined,
        sortBy: filters.sortBy,
        order: filters.order,
        page,
        limit: 10,
      });

      setDirectors(response.data);
      setTotalPages(response.totalPages);

      toast.dismiss(toastId);
    } catch (error) {
      console.error(error);

      toast.dismiss(toastId);

      toast.error("Failed to load directors.");
    }
  }

  useEffect(() => {
    loadDirectors();
  }, [page, filters]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Delete Director?",
      text: "Are you sure you want to delete this director?",
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
      const toastId = toast.loading("Deleting director...");

      const response = await deleteDirector(id);

      toast.dismiss(toastId);

      if (!response.success) {
        toast.error(response.message || "Failed to delete director.");
        return;
      }

      toast.success("Director deleted successfully!");

      loadDirectors();
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 403) {
        toast.error("You can only delete directors that you created.");
        return;
      }

      toast.error("Failed to delete director.");
    }
  }

  function handleFilterChange(key: string, value: string) {
    setPage(1);

    setFilters({
      ...filters,
      [key]: value,
    });
  }

  const inputClass =
    "rounded-lg bg-navy-800 border border-navy-600 px-3 py-2 text-sm text-white placeholder:text-ink-400 focus:outline-none focus:border-accent";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900 text-ink-200">
        Loading...
      </div>
    );
  }

  if (!user) return null;
  const sortOptions = [
    { value: "", label: "Sort By" },
    { value: "name", label: "Name" },
    { value: "dob", label: "Date of Birth" },
    { value: "createdAt", label: "Created Date" },
  ];

  const orderOptions = [
    { value: "desc", label: "Descending" },
    { value: "asc", label: "Ascending" },
  ];

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-white">Directors</h1>

          {(isAdmin || isEditor) && (
            <Link
              href="/movies/create"
              className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: `linear-gradient(90deg, ${GOLD}, ${CRIMSON})`,
                color: INK,
              }}
            >
              + Create Movie
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          )}
        </div>
        <div className="mb-8 flex flex-wrap gap-3 rounded-2xl bg-navy-800 p-4">
          <input
            type="text"
            placeholder="Search director..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className={`${inputClass} min-w-[220px] flex-1`}
          />

          <input
            type="number"
            placeholder="Birth Year"
            max={new Date().getFullYear()}
            value={filters.birthYear}
            onChange={(e) => handleFilterChange("birthYear", e.target.value)}
            className={`${inputClass} w-40`}
          />

          <CustomSelect
            value={filters.sortBy}
            onChange={(value) => handleFilterChange("sortBy", value)}
            options={sortOptions}
            placeholder="Sort By"
            className="w-48"
          />

          <CustomSelect
            value={filters.order}
            onChange={(value) => handleFilterChange("order", value)}
            options={orderOptions}
            placeholder="Order"
            className="w-44"
          />
        </div>

        {directors.length === 0 ? (
          <p className="text-ink-400">No directors found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {directors.map((director) => (
              <PersonCard
                key={director.id}
                name={director.name}
                imagePath={director.imagePath}
                subtitle={
                  director.dob
                    ? new Date(director.dob).toLocaleDateString("en-GB")
                    : "Unknown DOB"
                }
                href={`/directors/${director.id}`}
                actions={
                  <>
                    <Link
                      href={`/directors/${director.id}`}
                      className="rounded-full bg-navy-700 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-navy-600"
                    >
                      View Details
                    </Link>

                    {(isAdmin || isEditor) && (
                      <Link
                        href={`/directors/edit/${director.id}`}
                        className="rounded-full bg-navy-700 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-navy-600"
                      >
                        Edit
                      </Link>
                    )}

                    {(isAdmin || director.createdById === user?.id) && (
                      <button
                        onClick={() => handleDelete(director.id)}
                        className="rounded-full bg-rose-500/20 px-2.5 py-1 text-[11px] font-medium text-rose-300 transition hover:bg-rose-500/30"
                      >
                        Delete
                      </button>
                    )}
                  </>
                }
              />
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-full bg-navy-800 px-4 py-2 text-sm text-white transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-ink-400">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-full bg-navy-800 px-4 py-2 text-sm text-white transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
