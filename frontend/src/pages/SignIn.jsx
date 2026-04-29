import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function SignIn() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await loginUser(form);

      localStorage.setItem("user", JSON.stringify({
        username: form.username,
        token: data.token
      }));

      navigate("/profile");

    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex justify-center items-center min-h-screen px-4 bg-[var(--color-background)] text-[var(--color-text)]">

        <div className="w-full max-w-md p-10 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg text-center">

          <h2 className="text-2xl font-bold mb-2">
            Welcome Back
          </h2>

          <p className="text-[var(--color-text-muted)] mb-6">
            Sign in to your Fresh & Fit account
          </p>

          {error && (
              <p className="text-red-500 text-sm mb-4">
                {error}
              </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
                name="username"
                placeholder="Email address"
                value={form.username}
                onChange={handleChange}
                className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />

            <button
                disabled={loading}
                className="mt-2 p-3 rounded-lg text-white font-semibold"
                style={{ background: "var(--color-accent)" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="mt-6 text-sm text-[var(--color-text-muted)]">
            Don't have an account?{" "}
            <span
                onClick={() => navigate("/register")}
                className="text-[var(--color-primary)] cursor-pointer font-semibold"
            >
            Create one
          </span>
          </p>

        </div>
      </div>
  );
}