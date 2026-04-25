import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "../utils/auth";

export default function SignIn() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    fetch("http://localhost:8080/api/users/login") // ✅ CORRECT ENDPOINT
      .then(() => {})
    
    fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error("Invalid login");
        return res.json();
      })
      .then(data => {
        setUser(data); // ✅ USE UTIL
        navigate("/profile");
      })
      .catch(() => {
        setError("Invalid email or password");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={container}>
      <div style={card}>

        <h2>Sign In</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit} style={formStyle}>

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            style={input}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            style={input}
          />

          <button style={btn}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

      </div>
    </div>
  );
}

/* STYLES */
const container = { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" };
const card = { padding: "30px", background: "white", borderRadius: "10px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "10px" };
const input = { padding: "10px" };
const btn = { padding: "10px", background: "#6f8f6b", color: "white", border: "none" };
