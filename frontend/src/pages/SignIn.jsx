import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { loginUser } from "../services/api";
import { setUser } from "../utils/auth";

export default function SignIn() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
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

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await loginUser(form);

      setUser(data);

      navigate("/profile");

    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      {/* DARK MODE TOGGLE */}
      <div style={toggleWrap}>
        <button onClick={() => setDarkMode(!darkMode)} style={toggleBtn}>
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div style={container}>

        <div style={card}>

          <h2 style={title}>
            Welcome Back
          </h2>

          <p style={subtitle}>
            Sign in to your Fit & Fresh account
          </p>

          {error && <p style={errorText}>{error}</p>}

          <form onSubmit={handleSubmit} style={formStyle}>

            <input
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <button style={signInBtn} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p style={bottomText}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")} style={link}>
              Create one
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "80vh"
};

const card = {
  width: "400px",
  padding: "40px",
  borderRadius: "20px",
  background: "var(--surface)",
  textAlign: "center",
  boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
};

const title = {
  marginBottom: "10px"
};

const subtitle = {
  color: "var(--text-light)",
  marginBottom: "20px"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px"
};

const signInBtn = {
  background: "var(--primary)",
  color: "white",
  marginTop: "10px"
};

const errorText = {
  color: "#e76f51",
  marginBottom: "10px"
};

const bottomText = {
  marginTop: "20px",
  fontSize: "14px"
};

const link = {
  color: "#6f8f6b",
  cursor: "pointer",
  fontWeight: "600"
};

const toggleWrap = {
  display: "flex",
  justifyContent: "flex-end",
  padding: "20px 60px"
};

const toggleBtn = {
  background: "var(--surface)",
  border: "1px solid var(--border)"
};
