import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <header style={{ padding: "20px", borderBottom: "1px solid #ddd" }}>
        <Link to="/">Fresh & Fit</Link>
      </header>

      <main>
        <Outlet />
      </main>

      <footer style={{ padding: "20px", borderTop: "1px solid #ddd", marginTop: "40px" }}>
        Footer Test
      </footer>
    </div>
  );
}