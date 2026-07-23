"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getActor, updateActor } from "@/services/actorService";

export default function EditActor() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const params = useParams();
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  const id = Number(params.id);

  const [actor, setActor] = useState({
    name: "",
    dob: "",
    gender: "",
    biography: "",
    awards: "",
    nationality: "",
  });

  const [error, setError] = useState("");

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
    async function loadActor() {
      try {
        const data = await getActor(id);

        setActor({
          name: data.name,
          dob: data.dob.split("T")[0],
          gender: data.gender,
          biography: data.biography,
          awards: String(data.awards),
          nationality: data.nationality,
        });
        setPreviewImage(data.imagePath || "");
      } catch (error) {
        console.error(error);
        setError("Failed to load actor.");
      }
    }

    if (id) {
      loadActor();
    }
  }, [id]);

  function validateForm() {
    const name = actor.name.trim();
    const gender = actor.gender.trim();
    const biography = actor.biography.trim();
    const nationality = actor.nationality.trim();
    const awards = Number(actor.awards);

    if (!name) {
      return "Name is required";
    }

    if (name.length < 2) {
      return "Name must be at least 2 characters long";
    }

    if (name.length > 100) {
      return "Name cannot exceed 100 characters";
    }

    if (!/^[A-Za-z\s'-]+$/.test(name)) {
      return "Name can only contain letters, spaces, apostrophes and hyphens";
    }

    if (/(.)\1{4,}/.test(name)) {
      return "Name contains too many repeated characters";
    }

    if (!actor.dob) {
      return "Date of birth is required";
    }

    if (new Date(actor.dob) > new Date()) {
      return "Date of birth cannot be in the future";
    }

    if (!gender) {
      return "Gender is required";
    }

    if (!["Male", "Female", "Other"].includes(gender)) {
      return "Please select a valid gender";
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

    if (actor.awards === "") {
      return "Awards field is required";
    }

    if (isNaN(awards)) {
      return "Awards must be a number";
    }

    if (awards < 0) {
      return "Awards cannot be negative";
    }

    if (awards > 500) {
      return "Awards cannot exceed 500";
    }

    if (image) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(image.type)) {
        return "Only JPG, PNG and WEBP images are allowed";
      }

      if (image.size > 5 * 1024 * 1024) {
        return "Image size cannot exceed 5MB";
      }
    }

    return "";
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
      const formData = new FormData();

      formData.append("name", actor.name.trim());

      formData.append("dob", actor.dob);

      formData.append("gender", actor.gender.trim());

      formData.append("biography", actor.biography.trim());

      formData.append("nationality", actor.nationality.trim());

      formData.append("awards", String(Number(actor.awards)));

      if (image) {
        formData.append("image", image);
      }

      await updateActor(id, formData);

      alert("Actor updated successfully!");

      router.push("/actors");
    } catch (error: any) {
      console.error(error);

      setError(error.message || "Failed to update actor.");
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return null;
  }

  return (
    <div>
      <h1>Edit Actor</h1>

      <button onClick={() => router.push("/")}>Home</button>

      <button onClick={() => router.push("/actors")}>Actors List</button>

      <br />
      <br />

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Name</label>

        <br />

        <input
          type="text"
          maxLength={100}
          value={actor.name}
          onChange={(e) =>
            setActor({
              ...actor,
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
          value={actor.dob}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) =>
            setActor({
              ...actor,
              dob: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Gender</label>

        <br />

        <select
          value={actor.gender}
          onChange={(e) =>
            setActor({
              ...actor,
              gender: e.target.value,
            })
          }
        >
          <option value="">Select Gender</option>

          <option value="Male">Male</option>

          <option value="Female">Female</option>

          <option value="Other">Other</option>
        </select>

        <br />
        <br />

        <label>Nationality</label>

        <br />

        <input
          type="text"
          maxLength={50}
          value={actor.nationality}
          onChange={(e) =>
            setActor({
              ...actor,
              nationality: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Biography</label>

        <br />

        <textarea
          value={actor.biography}
          onChange={(e) =>
            setActor({
              ...actor,
              biography: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Awards</label>

        <br />

        <input
          type="number"
          min={0}
          max={500}
          value={actor.awards}
          onChange={(e) =>
            setActor({
              ...actor,
              awards: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Actor Image</label>

        <br />

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              setImage(file);

              setPreviewImage(URL.createObjectURL(file));
            }
          }}
        />

        <br />
        <br />

        {previewImage && (
          <img
            src={previewImage}
            alt={actor.name}
            width={150}
            height={200}
            style={{
              objectFit: "cover",
            }}
          />
        )}

        <br />
        <br />

        <button type="submit">Update Actor</button>
      </form>
    </div>
  );
}
