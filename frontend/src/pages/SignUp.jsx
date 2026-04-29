import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const res = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          username: form.username,
          password: form.password
        })
      });

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      setSuccess("Account created successfully 🎉");

      setTimeout(() => navigate("/signin"), 1200);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex min-h-screen">

        {/* LEFT SIDE */}
        <div
            className="flex-1 bg-cover bg-center relative"
            style={{
              backgroundImage:
                  "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c')"
            }}
        >
          <div className="absolute bottom-10 left-10 max-w-md text-white">
            <h1 className="text-2xl font-bold">Join 8,000+ food lovers</h1>
            <p>Create your free account and start cooking healthier today.</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col justify-center p-16 bg-[var(--color-background)] text-[var(--color-text)]"> {/* UPDATED */}

          <h2 className="text-2xl font-bold">Create your account</h2>

          <p className="mt-2 text-[var(--color-text-muted)]">
            Already have one?{" "}
            <span
                className="text-[var(--color-primary)] cursor-pointer"
                onClick={() => navigate("/signin")}
            >
            Sign in
          </span>
          </p>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">

            <div className="flex gap-3">
              <input
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                  className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] w-full"
              /> {/* UPDATED */}

              <input
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                  className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] w-full"
              /> {/* UPDATED */}
            </div>

            <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
            /> {/* UPDATED */}

            <input
                name="username"
                placeholder="Username"
                onChange={handleChange}
                className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
            /> {/* UPDATED */}

            {/* PASSWORD */}
            <div className="relative">
              <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={handleChange}
                  className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] w-full"
              /> {/* UPDATED */}

              <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-[var(--color-text-muted)]"
                  onClick={() => setShowPassword(!showPassword)}
              >
              {showPassword ? "Hide" : "Show"}
            </span>
            </div>

            <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
            /> {/* UPDATED */}

            <button
                type="submit"
                disabled={loading}
                className="p-3 rounded-lg text-white font-semibold"
                style={{ background: "var(--color-accent)" }}
            >
              {loading ? "Creating..." : "Create Free Account →"}
            </button>

          </form>
        </div>
      </div>
  );
}