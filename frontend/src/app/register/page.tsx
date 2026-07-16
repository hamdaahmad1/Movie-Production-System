"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/authService";

import {
  validateFirstName,
  validateLastName,
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/app/utils/validators";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

  const [role, setRole] = useState("VIEWER");

  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");

    if (name === "username") {
      checkUsername(value);
    }

    if (name === "email") {
      checkEmail(value);
    }
  }

  async function checkUsername(username: string) {
    const validationError = validateUsername(username);

    if (validationError) {
      setUsernameAvailable(null);
      return;
    }

    try {
      const result = await authService.checkUsername(username);

      setUsernameAvailable(result.available);
    } catch {
      setUsernameAvailable(null);
    }
  }

  async function checkEmail(email: string) {
    const validationError = validateEmail(email);

    if (validationError) {
      setEmailAvailable(null);
      return;
    }

    try {
      const result = await authService.checkEmail(email);

      setEmailAvailable(result.available);
    } catch {
      setEmailAvailable(null);
    }
  }

  function validateForm() {
    const firstNameError = validateFirstName(form.firstName);

    if (firstNameError) return firstNameError;

    const lastNameError = validateLastName(form.lastName);

    if (lastNameError) return lastNameError;

    const usernameError = validateUsername(form.username);

    if (usernameError) return usernameError;

    if (usernameAvailable === false) return "Username already exists.";

    const emailError = validateEmail(form.email);

    if (emailError) return emailError;
    if (emailAvailable === false) return "Email already exists.";

    const passwordError = validatePassword(form.password);

    if (passwordError) return passwordError;

    const confirmPasswordError = validateConfirmPassword(
      form.password,
      form.confirmPassword
    );

    if (confirmPasswordError) return confirmPasswordError;

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

    setLoading(true);

    try {
      const response = await authService.register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: role as "VIEWER" | "EDITOR",
      });

      alert("Registration successful!");

      if (response.user.role === "EDITOR") {
        router.push("/editor");
      } else {
        router.push("/viewer");
      }
    } catch (error: any) {
      setError(error.response?.data?.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Register</h1>

      <button onClick={() => router.push("/")}>Home</button>

      <button onClick={() => router.push("/login")}>Login</button>

      <br />
      <br />

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <br />

        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
        />

        <br />
        <br />

        <label>Last Name</label>
        <br />

        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
        />

        <br />
        <br />

        <label>Username</label>
        <br />

        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
        />

        {usernameAvailable === true && (
          <p style={{ color: "green" }}>Username is available.</p>
        )}

        {usernameAvailable === false && (
          <p style={{ color: "red" }}>Username already exists.</p>
        )}

        <br />

        <label>Email</label>
        <br />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        {emailAvailable === true && (
          <p style={{ color: "green" }}>Email is available.</p>
        )}

        {emailAvailable === false && (
          <p style={{ color: "red" }}>Email already exists.</p>
        )}

        <br />
        <br />

        <label>Password</label>
        <br />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <br />
        <br />

        <label>Confirm Password</label>
        <br />

        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <label>
          <input
            type="radio"
            value="VIEWER"
            checked={role === "VIEWER"}
            onChange={(e) => setRole(e.target.value)}
          />
          Viewer
        </label>

        <label>
          <input
            type="radio"
            value="EDITOR"
            checked={role === "EDITOR"}
            onChange={(e) => setRole(e.target.value)}
          />
          Editor
        </label>

        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <br />

      <p>
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
}
