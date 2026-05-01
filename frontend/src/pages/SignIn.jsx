import { useState, useEffect } from "react";
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
  const [darkMode, setDarkMode] = useState(false);

  /* DARK MODE */
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

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

      // store logged in user locally
      localStorage.setItem("user", JSON.stringify({
        username: form.username,
        token: data.token
      }));
      window.dispatchEvent(new Event("userChanged"));
      navigate("/profile");

    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="page-shell min-h-screen flex items-center justify-center p-5">
        <div className="surface-card w-[400px] p-10 rounded-2xl shadow-lg text-center">

          <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>

          <p className="text-muted mb-5">
            Sign in to your Fit & Fresh account
          </p>

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
                name="username"
                placeholder="Email address"
                value={form.username}
                onChange={handleChange}
                className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
            />

            <button
                disabled={loading}
                className="mt-2 p-3 rounded-lg bg-[var(--color-accent)] text-white font-semibold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="mt-5 text-sm">
            Don't have an account?{" "}
            <span
                onClick={() => navigate("/register")}
                className="text-[var(--color-primary)] font-semibold cursor-pointer"
            >
          Create one
        </span>
          </p>

        </div>
      </div>
  ); }