"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDirector, updateDirector } from "@/services/directorService";
import toast from "react-hot-toast";
import Navbar from "@/app/components/Navbar";
import ImageUpload from "@/app/components/ImageUpload";

const inputClass =
  "w-full rounded-lg bg-navy-700 border border-navy-600 px-3 py-2.5 text-sm text-white placeholder:text-ink-400 focus:outline-none focus:border-accent";
const labelClass = "mb-1.5 block text-sm font-medium text-ink-200";

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

export default function EditDirector() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  const params = useParams();
  const id = Number(params.id);

  const [director, setDirector] = useState({
    name: "",
    dob: "",
    nationality: "",
    biography: "",
    image: "",
  });

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN" && user.role !== "EDITOR") {
      router.replace("/movies");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadDirector() {
      const toastId = toast.loading("Loading director...");
      try {
        const data = await getDirector(id);
        setDirector({
          name: data.name,
          dob: data.dob.split("T")[0],
          nationality: data.nationality,
          biography: data.biography,
          image: data.imagePath || "",
        });
        setImagePreview(data.imagePath || "");
        toast.dismiss(toastId);
      } catch (error) {
        console.error(error);
        toast.dismiss(toastId);
        toast.error("Failed to load director.");
      }
    }

    if (id) loadDirector();
  }, [id]);

  function validateForm() {
    const name = director.name.trim();
    const nationality = director.nationality.trim();
    const biography = director.biography.trim();

    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters long";
    if (name.length > 100) return "Name cannot exceed 100 characters";
    if (!/^[A-Za-z\s.'-]+$/.test(name))
      return "Name can only contain letters, spaces, apostrophes, hyphens and periods";
    if (/(.)\1{4,}/.test(name))
      return "Name contains too many repeated characters";

    if (!director.dob) return "Date of birth is required";
    const dob = new Date(director.dob);
    if (dob > new Date()) return "Date of birth cannot be in the future";

    if (!nationality) return "Nationality is required";
    if (nationality.length < 2)
      return "Nationality must be at least 2 characters long";
    if (nationality.length > 50)
      return "Nationality cannot exceed 50 characters";
    if (!/^[A-Za-z\s]+$/.test(nationality))
      return "Nationality can only contain letters and spaces";

    if (!biography) return "Biography is required";
    if (biography.length < 20)
      return "Biography must be at least 20 characters long";
    if (biography.length > 1000)
      return "Biography cannot exceed 1000 characters";

    if (image) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(image.type))
        return "Only JPG, PNG and WEBP images are allowed";
      if (image.size > 5 * 1024 * 1024) return "Image size cannot exceed 5MB";
    }

    return "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    const loadingToast = toast.loading("Updating director...");

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", director.name.trim());
      formData.append("dob", director.dob);
      formData.append("biography", director.biography.trim());
      formData.append("nationality", director.nationality.trim());
      if (image) formData.append("image", image);

      await updateDirector(id, formData);
      toast.success("Director updated successfully!");
      router.push("/directors");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update director."
      );
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

  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />

      <div className="mx-auto max-w-2xl px-6 py-10">
        <button
          onClick={() => router.push("/directors")}
          className="mb-6 rounded-full bg-navy-800 px-4 py-2 text-sm text-white hover:bg-navy-700"
        >
          ← Directors List
        </button>

        <h1 className="text-2xl font-bold text-white">Edit Director</h1>
        <p className="mt-1 mb-6 text-sm text-ink-400">
          Update this director's details.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-2xl border border-navy-700 bg-navy-800 p-6 shadow-xl shadow-black/20 md:p-8"
        >
          <SectionHeader title="Basic Details" />
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              maxLength={100}
              value={director.name}
              onChange={(e) =>
                setDirector({ ...director, name: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input
                type="date"
                value={director.dob}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setDirector({ ...director, dob: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Nationality</label>
              <input
                type="text"
                maxLength={50}
                value={director.nationality}
                onChange={(e) =>
                  setDirector({ ...director, nationality: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <hr className="border-navy-700" />

          <SectionHeader title="Biography" />
          <div>
            <label className={labelClass}>Biography</label>
            <textarea
              rows={5}
              maxLength={1000}
              value={director.biography}
              onChange={(e) =>
                setDirector({ ...director, biography: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <hr className="border-navy-700" />

          <SectionHeader
            title="Photo"
            subtitle="Optional. JPG, PNG or WEBP, up to 5MB."
          />
          <ImageUpload
            label="Director Image"
            file={image}
            preview={imagePreview}
            setFile={setImage}
            setPreview={setImagePreview}
            alt={director.name}
            removeButtonText="Remove Image"
          />

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/directors")}
              className="rounded-full border border-navy-600 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Director"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
