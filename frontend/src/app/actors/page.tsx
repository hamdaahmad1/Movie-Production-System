"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@/app/components/Navbar";
import PersonCard from "@/app/components/PersonCard";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { getActors, deleteActor } from "@/services/actorService";
import { Actor } from "@/types/actor";
import CustomSelect from "@/app/components/CustomSelect";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function ActorsPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isEditor = user?.role === "EDITOR";

  const [loadingActors, setLoadingActors] = useState(false);

  const [actors, setActors] = useState<Actor[]>([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    birthYear: "",
    sortBy: "",
    order: "desc" as "asc" | "desc",
  });

  async function loadActors() {
    const toastId = toast.loading("Loading actors...");

    setLoadingActors(true);

    try {
      const response = await getActors({
        search: filters.search,
        birthYear: filters.birthYear ? Number(filters.birthYear) : undefined,
        sortBy: filters.sortBy,
        order: filters.order,
        page,
        limit: 10,
      });

      setActors(response.data);

      setTotalPages(response.totalPages);

      toast.dismiss(toastId);
    } catch (error) {
      console.error(error);

      toast.dismiss(toastId);

      toast.error("Failed to load actors.");
    } finally {
      setLoadingActors(false);
    }
  }

  useEffect(() => {
    loadActors();
  }, [page, filters]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

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
      const toastId = toast.loading("Deleting actor...");

      const response = await deleteActor(id);

      toast.dismiss(toastId);

      if (!response.success) {
        toast.error(response.message || "Failed to delete actor.");
        return;
      }

      toast.success("Actor deleted successfully!");

      loadActors();
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 403) {
        toast.error("You can only delete actors that you created.");
        return;
      }

      toast.error("Failed to delete actor.");
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
          <h1 className="text-2xl font-bold text-white">Actors</h1>

          {(isAdmin || isEditor) && (
            <Link
              href="/actors/create"
              className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              + Create Actor
            </Link>
          )}
        </div>
        <div className="mb-8 flex flex-wrap gap-3 rounded-2xl bg-navy-800 p-4">
          <input
            type="text"
            placeholder="Search actor..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className={`${inputClass} flex-1 min-w-[220px]`}
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

        {actors.length === 0 ? (
          <p className="text-ink-400">No actors found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {actors.map((actor) => (
              <PersonCard
                key={actor.id}
                name={actor.name}
                imagePath={actor.imagePath}
                subtitle={
                  actor.dob
                    ? new Date(actor.dob).toLocaleDateString("en-GB")
                    : "Unknown DOB"
                }
                href={`/actors/${actor.id}`}
                actions={
                  <>
                    <Link
                      href={`/actors/${actor.id}`}
                      className="rounded-full bg-navy-700 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-navy-600"
                    >
                      View Details
                    </Link>
                    
                    {(isAdmin || isEditor) && (
                      <Link
                        href={`/actors/edit/${actor.id}`}
                        className="rounded-full bg-navy-700 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-navy-600"
                      >
                        Edit
                      </Link>
                    )}

                    {(isAdmin || actor.createdById === user?.id) && (
                      <button
                        onClick={() => handleDelete(actor.id)}
                        className="rounded-full bg-rose-500/20 px-2.5 py-1 text-[11px] font-medium text-rose-300 hover:bg-rose-500/30"
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
            className="rounded-full bg-navy-800 px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-ink-400">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-full bg-navy-800 px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
