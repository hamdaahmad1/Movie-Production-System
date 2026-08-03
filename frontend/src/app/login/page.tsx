"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import { authService } from "@/services/authService";
import toast from "react-hot-toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Palette — identical to the rest of the app (admin / editor / viewer),
// so login feels like part of the same product.
const INK = "#0B1120"; // page background
const PANEL = "#15181F"; // card background
const GOLD = "#E8B84B"; // marquee accent
const CRIMSON = "#C1443B"; // curtain accent / errors
const PAPER = "#F3EFE7"; // primary text
const MUTED = "#8B90A0"; // secondary text

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 6.5C3 5.67 3.67 5 4.5 5h15c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
        stroke={MUTED}
        strokeWidth="1.6"
      />
      <path
        d="m4 6.5 8 6.2 8-6.2"
        stroke={MUTED}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="4.5"
        y="10.5"
        width="15"
        height="9.5"
        rx="2"
        stroke={MUTED}
        strokeWidth="1.6"
      />
      <path
        d="M7.5 10.5V7.8a4.5 4.5 0 0 1 9 0v2.7"
        stroke={MUTED}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z"
        stroke={MUTED}
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3" stroke={MUTED} strokeWidth="1.6" />
      {off && (
        <path
          d="M4 4l16 16"
          stroke={MUTED}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const { refreshUser } = useAuth();

  const [loggingIn, setLoggingIn] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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

      toast.error("Please fix the validation errors.");

      return;
    }

    let loadingToast;

    try {
      setLoggingIn(true);

      loadingToast = toast.loading("Logging in...");

      const response = await authService.login(form);

      await refreshUser();

      toast.dismiss(loadingToast);

      toast.success("Login successful!");

      if (response.user.role === "ADMIN") {
        window.location.assign("/admin");
      } else if (response.user.role === "EDITOR") {
        router.replace("/editor");
      } else if (response.user.role === "VIEWER") {
        router.replace("/viewer");
      } else {
        router.replace("/");
      }
    } catch (error: any) {
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }

      const message = error.response?.data?.message || "Login failed";

      setErrors((prev) => ({
        ...prev,
        general: message,
      }));

      toast.error(message);
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6 py-12"
      style={{ backgroundColor: INK }}
    >
      {/* ambient glow, matches the dashboard heroes */}
      <div
        className="pointer-events-none fixed -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: `${GOLD}14` }}
      />
      <div
        className="pointer-events-none fixed -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: `${CRIMSON}14` }}
      />

      <div className="relative w-full max-w-md">
        {/* marquee lights */}
        <div className="relative mb-6 flex justify-center gap-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: GOLD,
                animation: `marquee-pulse 2.4s ease-in-out ${
                  i * 0.08
                }s infinite`,
              }}
            />
          ))}
        </div>

        <div
          className="relative overflow-hidden rounded-3xl border border-white/5 p-8 shadow-2xl sm:p-10"
          style={{
            background: `linear-gradient(160deg, ${PANEL} 0%, #12141B 60%, #0F1116 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
            style={{ backgroundColor: `${GOLD}14` }}
          />

          <div className="relative flex flex-col items-center text-center">
            <div
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, ${CRIMSON})`,
              }}
            >
              🎬
            </div>

            <span
              className={`${mono.className} rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.2em]`}
              style={{
                borderColor: `${GOLD}4D`,
                backgroundColor: `${GOLD}1A`,
                color: GOLD,
              }}
            >
              MOVIEVERSE
            </span>

            <h1
              className={`${playfair.className} mt-4 text-3xl font-bold leading-tight sm:text-4xl`}
              style={{ color: PAPER }}
            >
              Welcome Back
            </h1>

            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: MUTED }}
            >
              Log in to continue to your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative mt-8 space-y-5">
            <div>
              <label
                htmlFor="login"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide"
                style={{ color: MUTED }}
              >
                Email or Username
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                  <MailIcon />
                </span>

                <input
                  id="login"
                  name="login"
                  value={form.login}
                  onChange={handleChange}
                  disabled={loggingIn}
                  placeholder="jane.doe@example.com"
                  className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--accent)] disabled:opacity-50"
                  style={{
                    backgroundColor: INK,
                    borderColor: errors.login
                      ? `${CRIMSON}80`
                      : "rgba(255,255,255,0.08)",
                    color: PAPER,
                  }}
                />
              </div>

              {errors.login && (
                <p className="mt-1.5 text-xs" style={{ color: CRIMSON }}>
                  {errors.login}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide"
                style={{ color: MUTED }}
              >
                Password
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                  <LockIcon />
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loggingIn}
                  placeholder="••••••••"
                  className="w-full rounded-xl border py-3 pl-10 pr-11 text-sm outline-none transition disabled:opacity-50"
                  style={{
                    backgroundColor: INK,
                    borderColor: errors.password
                      ? `${CRIMSON}80`
                      : "rgba(255,255,255,0.08)",
                    color: PAPER,
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs" style={{ color: CRIMSON }}>
                  {errors.password}
                </p>
              )}
            </div>

            {errors.general && (
              <div
                className="rounded-xl border px-4 py-3 text-sm"
                style={{
                  borderColor: `${CRIMSON}4D`,
                  backgroundColor: `${CRIMSON}14`,
                  color: CRIMSON,
                }}
              >
                {errors.general}
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: `linear-gradient(90deg, ${GOLD}, ${CRIMSON})`,
                color: INK,
              }}
            >
              {loggingIn ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div
            className="relative mt-6 border-t pt-6 text-center"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <p className="text-sm" style={{ color: MUTED }}>
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold transition hover:opacity-80"
                style={{ color: GOLD }}
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-pulse {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}
