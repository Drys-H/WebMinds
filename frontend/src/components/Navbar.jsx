import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div style={navbar}>
      <h2>
        <span style={{ color: "#6f8f6b" }}>Fit</span>
        <span style={{ color: "#f4a261" }}>&</span>
        <span style={{ color: "#6f8f6b" }}>Fresh</span>
      </h2>

      <div style={links}>
        <span onClick={() => navigate("/")}>Home</span>
        <span onClick={() => navigate("/recipes")}>Recipes</span>
        <span onClick={() => navigate("/categories")}>Categories</span>
        <span onClick={() => navigate("/community")}>Community</span>
      </div>
    </div>
  );
}

const navbar = {
  display: "flex",
  justifyContent: "space-between",
  padding: "20px",
  background: "white",
  borderBottom: "1px solid #eee"
};

const links = {
  display: "flex",
  gap: "20px",
  cursor: "pointer"
};
