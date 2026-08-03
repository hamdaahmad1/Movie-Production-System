"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import { authService } from "@/services/authService";

import {
  validateFirstName,
  validateLastName,
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/app/utils/validators";

import toast from "react-hot-toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Palette — identical to login / dashboards, so the whole app reads as one product.
const INK = "#0B1120"; // page background
const PANEL = "#15181F"; // card background
const GOLD = "#E8B84B"; // marquee accent
const CRIMSON = "#C1443B"; // curtain accent / errors
const TEAL = "#3FA9A0"; // screen-glow accent / success
const PAPER = "#F3EFE7"; // primary text
const MUTED = "#8B90A0"; // secondary text

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.4" stroke={MUTED} strokeWidth="1.6" />
      <path
        d="M5 19c1.2-3.2 4-4.8 7-4.8s5.8 1.6 7 4.8"
        stroke={MUTED}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

function FieldStatus({
  state,
  okText,
  badText,
}: {
  state: boolean | null;
  okText: string;
  badText: string;
}) {
  if (state === null) return null;

  const ok = state;

  return (
    <p
      className="mt-1.5 flex items-center gap-1.5 text-xs"
      style={{ color: ok ? TEAL : CRIMSON }}
    >
      <span
        className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold"
        style={{
          backgroundColor: ok ? `${TEAL}22` : `${CRIMSON}22`,
        }}
      >
        {ok ? "✓" : "✕"}
      </span>
      {ok ? okText : badText}
    </p>
  );
}

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

  const [loading, setLoading] = useState(false);

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

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
      toast.error(validationError);
      return;
    }

    setLoading(true);

    try {
      const toastId = toast.loading("Creating account...");
      await authService.register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      toast.dismiss(toastId);
      toast.success("Registration successful!");
      router.push("/viewer");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6 py-12"
      style={{ backgroundColor: INK }}
    >
      {/* ambient glow, matches the dashboard heroes / login */}
      <div
        className="pointer-events-none fixed -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: `${CRIMSON}14` }}
      />
      <div
        className="pointer-events-none fixed -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: `${GOLD}14` }}
      />

      <div className="relative w-full max-w-lg">
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
            style={{ backgroundColor: `${CRIMSON}14` }}
          />

          {/* top nav */}
          <div className="relative mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-full border px-4 py-1.5 text-xs font-medium transition hover:opacity-80"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                color: MUTED,
              }}
            >
              ← Home
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="rounded-full border px-4 py-1.5 text-xs font-medium transition hover:opacity-80"
              style={{
                borderColor: `${GOLD}4D`,
                backgroundColor: `${GOLD}1A`,
                color: GOLD,
              }}
            >
              Log In
            </button>
          </div>

          <div className="relative flex flex-col items-center text-center">
            <div
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${CRIMSON}, ${GOLD})`,
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
              Create Your Account
            </h1>

            <p
              className="mt-2 max-w-sm text-sm leading-relaxed"
              style={{ color: MUTED }}
            >
              Join MovieVerse to build your watchlist and share reviews.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide"
                  style={{ color: MUTED }}
                >
                  First Name
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                    <UserIcon />
                  </span>

                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Jane"
                    className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition disabled:opacity-50"
                    style={{
                      backgroundColor: INK,
                      borderColor: "rgba(255,255,255,0.08)",
                      color: PAPER,
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide"
                  style={{ color: MUTED }}
                >
                  Last Name
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                    <UserIcon />
                  </span>

                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Doe"
                    className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition disabled:opacity-50"
                    style={{
                      backgroundColor: INK,
                      borderColor: "rgba(255,255,255,0.08)",
                      color: PAPER,
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide"
                style={{ color: MUTED }}
              >
                Username
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                  <UserIcon />
                </span>

                <input
                  id="username"
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="janedoe"
                  className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition disabled:opacity-50"
                  style={{
                    backgroundColor: INK,
                    borderColor:
                      usernameAvailable === false
                        ? `${CRIMSON}80`
                        : "rgba(255,255,255,0.08)",
                    color: PAPER,
                  }}
                />
              </div>

              <FieldStatus
                state={usernameAvailable}
                okText="Username is available"
                badText="Username already exists"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide"
                style={{ color: MUTED }}
              >
                Email
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                  <MailIcon />
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="jane.doe@example.com"
                  className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition disabled:opacity-50"
                  style={{
                    backgroundColor: INK,
                    borderColor:
                      emailAvailable === false
                        ? `${CRIMSON}80`
                        : "rgba(255,255,255,0.08)",
                    color: PAPER,
                  }}
                />
              </div>

              <FieldStatus
                state={emailAvailable}
                okText="Email is available"
                badText="Email already exists"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
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
                    disabled={loading}
                    placeholder="••••••••"
                    className="w-full rounded-xl border py-3 pl-10 pr-11 text-sm outline-none transition disabled:opacity-50"
                    style={{
                      backgroundColor: INK,
                      borderColor: "rgba(255,255,255,0.08)",
                      color: PAPER,
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  >
                    <EyeIcon off={showPassword} />
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide"
                  style={{ color: MUTED }}
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                    <LockIcon />
                  </span>

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="••••••••"
                    className="w-full rounded-xl border py-3 pl-10 pr-11 text-sm outline-none transition disabled:opacity-50"
                    style={{
                      backgroundColor: INK,
                      borderColor: "rgba(255,255,255,0.08)",
                      color: PAPER,
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  >
                    <EyeIcon off={showConfirmPassword} />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: `linear-gradient(90deg, ${CRIMSON}, ${GOLD})`,
                color: INK,
              }}
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <div
            className="relative mt-6 border-t pt-6 text-center"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <p className="text-sm" style={{ color: MUTED }}>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold transition hover:opacity-80"
                style={{ color: GOLD }}
              >
                Login
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
