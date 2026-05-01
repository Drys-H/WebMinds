import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.username || !form.password) {
      return "All fields are required";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return "Enter a valid email";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        username: form.username,
        password: form.password
      });

      setSuccess("Account created successfully 🎉");
      setTimeout(() => navigate("/signin"), 1200);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={container}>

        {/* LEFT SIDE */}
        <div style={leftSide}>
          <div style={overlay}>
            <h1>Join 8,000+ food lovers</h1>
            <p>Create your free account and start cooking healthier today.</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={rightSide}>
          <h2>Create your account</h2>

          <p>
            Already have one?{" "}
            <span style={link} onClick={() => navigate("/signin")}>
            Sign in
          </span>
          </p>

          {error && <p style={errorText}>{error}</p>}
          {success && <p style={successText}>{success}</p>}

          <form onSubmit={handleSubmit} style={formStyle}>

            <div style={{ display: "flex", gap: "10px" }}>
              <input name="firstName" placeholder="First Name" onChange={handleChange} style={input} />
              <input name="lastName" placeholder="Last Name" onChange={handleChange} style={input} />
            </div>

            <input name="email" placeholder="Email" onChange={handleChange} style={input} />
            <input name="username" placeholder="Username" onChange={handleChange} style={input} />

            {/* PASSWORD */}
            <div style={{ position: "relative" }}>
              <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={handleChange}
                  style={input}
              />
              <span style={toggle} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </span>
            </div>

            <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
                style={input}
            />

            <button type="submit" style={submitBtn} disabled={loading}>
              {loading ? "Creating..." : "Create Free Account →"}
            </button>

          </form>
        </div>
      </div>
  );
}

/* STYLES */

const container = {
  display: "flex",
  height: "100vh"
};

const leftSide = {
  flex: 1,
  backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative"
};

const overlay = {
  position: "absolute",
  bottom: "40px",
  left: "40px",
  color: "white",
  maxWidth: "400px"
};

const rightSide = {
  flex: 1,
  padding: "60px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  background: "var(--color-background)",
  color: "var(--color-text)"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  marginTop: "20px"
};

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid var(--color-border)",
  width: "100%",
  background: "var(--color-surface)",
  color: "var(--color-text)",
};

const submitBtn = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "var(--color-accent)",
  color: "white",
  cursor: "pointer"
};

const errorText = {
  color: "red",
  fontSize: "14px"
};

const successText = {
  color: "green",
  fontSize: "14px"
};

const link = {
  color: "var(--color-primary)",
  cursor: "pointer"
};

const toggle = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "12px"
};
