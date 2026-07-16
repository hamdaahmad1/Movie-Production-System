"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    login: "",
    password: "",
    general: "",
  });

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "login":
        if (!value.trim()) return "Email or Username is required";
        if (value.trim().length < 3) return "Must be at least 3 characters";
        if (value.length > 100) return "Cannot exceed 100 characters";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (value.length > 100) return "Password cannot exceed 100 characters";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
      general: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginError = validateField("login", form.login);

    const passwordError = validateField("password", form.password);

    if (loginError || passwordError) {
      setErrors({
        login: loginError,
        password: passwordError,
        general: "",
      });
      return;
    }

    try {
      const response = await authService.login(form);
      await refreshUser();

      if (response.user.role === "ADMIN") {
        router.replace("/admin");
      } else if (response.user.role === "EDITOR") {
        router.replace("/editor");
      } else if (response.user.role === "VIEWER") {
        router.replace("/viewer");
      } else {
        router.replace("/");
      }
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.response?.data?.message || "Login failed",
      }));
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email or Username</label>
          <br />

          <input name="login" value={form.login} onChange={handleChange} />

          <p style={{ color: "red" }}>{errors.login}</p>
        </div>

        <div>
          <label>Password</label>
          <br />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <p style={{ color: "red" }}>{errors.password}</p>
        </div>

        <p style={{ color: "red" }}>{errors.general}</p>

        <button type="submit">Login</button>

        <br />

        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}
