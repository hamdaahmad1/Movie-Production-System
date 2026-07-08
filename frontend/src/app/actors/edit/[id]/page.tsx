"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getActor, updateActor } from "@/services/actorService";

export default function EditActor() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [actor, setActor] = useState({
    name: "",
    dob: "",
    nationality: "",
  });

  useEffect(() => {
    async function loadActor() {
      try {
        const data = await getActor(id);

        setActor({
          name: data.name,
          dob: data.dob.split("T")[0],
          nationality: data.nationality,
        });
      } catch (error) {
        console.error(error);
      }
    }

    if (id) {
      loadActor();
    }
  }, [id]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      await updateActor(id, actor);

      alert("Actor updated successfully!");

      router.push("/actors");
    } catch (error) {
      console.error(error);
      alert("Failed to update actor.");
    }
  }

  return (
    <div>
      <h1>Edit Actor</h1>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <br />
        <input
          type="text"
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
          onChange={(e) =>
            setActor({
              ...actor,
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

        <button type="submit">Update Actor</button>
      </form>
    </div>
  );
}
