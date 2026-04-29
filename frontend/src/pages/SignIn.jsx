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

      navigate("/profile");

    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>

        <div style={container}>
          <div style={card}>

            <h2 style={title}>Welcome Back</h2>

            <p style={subtitle}>
              Sign in to your Fit & Fresh account
            </p>

            {error && <p style={errorText}>{error}</p>}

            <form onSubmit={handleSubmit} style={formStyle}>

              <input
                  name="username"
                  placeholder="Email address"
                  value={form.username}
                  onChange={handleChange}
                  style={input}
              />

              <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  style={input}
              />

              <button style={signInBtn} disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>

            </form>

            <p style={bottomText}>
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")} style={link}>
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
  minHeight: "100vh",
  padding: "20px"
};

const card = {
  width: "400px",
  padding: "40px",
  borderRadius: "20px",
  background: "var(--surface)",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
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
  background: "#e07a4f",
  color: "white",
  marginTop: "10px",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600"
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

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  outline: "none"
};



