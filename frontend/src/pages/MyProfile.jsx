import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUserState] = useState(null);

  useEffect(() => {
    const loggedInUser = getUser();

    if (!loggedInUser) {
      navigate("/signin"); // 🔒 protect route
    } else {
      setUserState(loggedInUser);
    }
  }, []);

  if (!user) return null;

  return (
    <div style={page}>

      {/* NAVBAR */}
      <div style={navbar}>
        <h2>Fresh & Fit</h2>

        <div style={{ display: "flex", gap: "20px" }}>
          <span onClick={() => navigate("/")}>Home</span>

          <button
            onClick={() => {
              logout();
              navigate("/signin");
            }}
            style={logoutBtn}
          >
            Logout
          </button>
        </div>
      </div>

      {/* PROFILE INFO */}
      <div style={content}>
        <h1>{user.username || user.email}</h1>
        <p>{user.email}</p>
      </div>

    </div>
  );
}

/* STYLES */
const page = { minHeight: "100vh", background: "#f7f7f7" };
const navbar = { display: "flex", justifyContent: "space-between", padding: "20px", background: "white" };
const content = { padding: "40px" };
const logoutBtn = { padding: "8px 12px", background: "#e76f51", color: "white", border: "none" };
