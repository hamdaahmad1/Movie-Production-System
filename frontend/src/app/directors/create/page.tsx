"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createDirector } from "@/services/directorService";

export default function CreateDirector() {
  const router = useRouter();

  const [director, setDirector] = useState({
    name: "",
    dob: "",
  });

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      await createDirector(director);

      alert("Director created successfully!");

      router.push("/directors");
    } catch (error) {
      console.error(error);
      alert("Failed to create director.");
    }
  }

  return (
    <div>
      <h1>Create Director</h1>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <br />
        <input
          type="text"
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
          onChange={(e) =>
            setDirector({
              ...director,
              dob: e.target.value,
            })
          }
        />

        <br />
        <br />

        <button type="submit">Create Director</button>
      </form>
    </div>
  );
}
