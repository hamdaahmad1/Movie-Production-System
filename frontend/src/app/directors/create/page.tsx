"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createDirector } from "@/services/directorService";
import { useAuth } from "@/context/AuthContext";
import { uploadImage } from "@/services/uploadService";
import { getImageUrl } from "@/app/utils/imageUrl";

export default function CreateDirector() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [uploading, setUploading] = useState(false);

  const [director, setDirector] = useState({
    name: "",
    dob: "",
    nationality: "",
    biography: "",
    imagePath: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/movies");
    }
  }, [user, loading, router]);

  function validateForm() {
    const name = director.name.trim();
    const nationality = director.nationality.trim();
    const biography = director.biography.trim();
    const imagePath = director.imagePath.trim();

    if (!name) {
      return "Name is required";
    }

    if (name.length < 2) {
      return "Name must be at least 2 characters long";
    }

    if (name.length > 100) {
      return "Name cannot exceed 100 characters";
    }

    if (!/^[A-Za-z\s.'-]+$/.test(name)) {
      return "Name can only contain letters, spaces, apostrophes, hyphens and periods";
    }

    if (/(.)\1{4,}/.test(name)) {
      return "Name contains too many repeated characters";
    }

    if (!director.dob) {
      return "Date of birth is required";
    }

    const dob = new Date(director.dob);

    if (dob > new Date()) {
      return "Date of birth cannot be in the future";
    }

    if (!nationality) {
      return "Nationality is required";
    }

    if (nationality.length < 2) {
      return "Nationality must be at least 2 characters long";
    }

    if (nationality.length > 50) {
      return "Nationality cannot exceed 50 characters";
    }

    if (!/^[A-Za-z\s]+$/.test(nationality)) {
      return "Nationality can only contain letters and spaces";
    }

    if (!biography) {
      return "Biography is required";
    }

    if (biography.length < 20) {
      return "Biography must be at least 20 characters long";
    }

    if (biography.length > 1000) {
      return "Biography cannot exceed 1000 characters";
    }

    /* if (imagePath) {
      try {
        new URL(imagePath);
      } catch {
        return "Image URL must be valid";
      }

      if (imagePath.length > 500) {
        return "Image URL cannot exceed 500 characters";
      }
    } */

    return "";
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    // Allowed file types
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG and PNG images are allowed.");

      e.target.value = "";
      return;
    }

    // File size limit (2 MB)
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image size must be less than 2 MB.");

      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const result = await uploadImage(file, "directors");

      setDirector((prev) => ({
        ...prev,
        imagePath: result.imagePath,
      }));
    } catch (error) {
      console.error(error);

      alert("Image upload failed.");
    } finally {
      setUploading(false);

      // allows selecting same file again
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    try {
      await createDirector({
        name: director.name.trim(),
        dob: director.dob,
        nationality: director.nationality.trim(),
        biography: director.biography.trim(),
        imagePath: director.imagePath.trim() || null,
      });

      alert("Director created successfully!");

      router.push("/directors");
    } catch (error: any) {
      console.error(error);

      setError(error.message || "Failed to create director.");
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
      <h1>Create Director</h1>

      <button onClick={() => router.push("/")}>Home</button>

      <button onClick={() => router.push("/directors")}>Directors List</button>

      <br />
      <br />

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Name</label>

        <br />

        <input
          type="text"
          maxLength={100}
          value={director.name}
          onChange={(e) =>
            setDirector({
              ...director,
              name: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Date of Birth</label>

        <br />

        <input
          type="date"
          value={director.dob}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) =>
            setDirector({
              ...director,
              dob: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Nationality</label>

        <br />

        <input
          type="text"
          maxLength={50}
          value={director.nationality}
          onChange={(e) =>
            setDirector({
              ...director,
              nationality: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Biography</label>

        <br />

        <textarea
          maxLength={1000}
          rows={5}
          value={director.biography}
          onChange={(e) =>
            setDirector({
              ...director,
              biography: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Image URL</label>

        <br />

        <input type="file" 
        accept=".jpg,.jpeg,.png"
         onChange={handleImageUpload} />

        <br />

        <small>Optional. Upload a profile image.</small>

        <br />

        {uploading && <p>Uploading image...</p>}

        <br />

        {director.imagePath && (
          <>
            <img
              src={getImageUrl(director.imagePath)}
              width={160}
              height={200}
              style={{
                objectFit: "cover",
                border: "1px solid #ccc",
              }}

            />
            <br />
            <br />

            <button
              type="button"
              onClick={() =>
                setDirector({
                  ...director,
                  imagePath: "",
                })
              }
            >
              Remove Image
            </button>
          </>
        )}

        <br />
        <br />

        <button type="submit">Create Director</button>
      </form>
    </div>
  );
}
