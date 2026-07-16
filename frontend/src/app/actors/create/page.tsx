"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createActor } from "@/services/actorService";
import { useAuth } from "@/context/AuthContext";

export default function CreateActor() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [actor, setActor] = useState({
    name: "",
    dob: "",
    gender: "",
    biography: "",
    nationality: "",
    awards: "",
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
    const name = actor.name.trim();
    const gender = actor.gender.trim();
    const biography = actor.biography.trim();
    const nationality = actor.nationality.trim();
    const imagePath = actor.imagePath.trim();
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

    const dob = new Date(actor.dob);

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

    if (!gender) {
      return "Gender is required";
    }

    if (!["Male", "Female", "Other"].includes(gender)) {
      return "Please select a valid gender";
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

    if (imagePath) {
      try {
        new URL(imagePath);
      } catch {
        return "Image URL must be valid";
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
      await createActor({
        name: actor.name.trim(),
        dob: actor.dob,
        gender: actor.gender.trim(),
        biography: actor.biography.trim(),
        nationality: actor.nationality.trim(),
        awards: Number(actor.awards),
        imagePath: actor.imagePath.trim(),
      });

      alert("Actor created successfully!");

      router.push("/actors");
    } catch (error: any) {
      console.error(error);

      setError(error.message || "Failed to create actor.");
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
      <h1>Create Actor</h1>

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
          maxLength={1000}
          rows={5}
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

        <label>Image URL</label>

        <br />

        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={actor.imagePath}
          onChange={(e) =>
            setActor({
              ...actor,
              imagePath: e.target.value,
            })
          }
        />

        <br />
        <br />

        {actor.imagePath && (
          <img
            src={actor.imagePath}
            alt={actor.name}
            width={160}
            height={220}
            style={{
              objectFit: "cover",
            }}
          />
        )}

        <br />
        <br />

        <button type="submit">Create Actor</button>
      </form>
    </div>
  );
}
