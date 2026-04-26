import { Menu, Moon, Search, Sun, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/recipes", label: "Recipes" },
  { to: "/categories", label: "Categories" },
  { to: "/community", label: "Community" },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  /* ✅ FIXED DARK MODE */
  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = search.trim();

    if (!query) {
      navigate("/recipes");
      return;
    }

    navigate(`/recipes?q=${encodeURIComponent(query)}`);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] dark:bg-slate-950 dark:text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

          {/* LOGO */}
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-[var(--color-primary)]">FRESH</span>
            <span className="text-[var(--color-accent)]">&amp;</span>
            <span className="text-[var(--color-primary)]">FIT</span>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition ${
                    isActive
                      ? "text-[var(--color-primary)]"
                      : "text-slate-600 hover:text-[var(--color-primary)] dark:text-slate-300 dark:hover:text-[var(--color-primary)]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT SIDE BUTTONS */}
          <div className="hidden items-center gap-3 lg:flex">

            {/* DARK MODE BUTTON */}
            <button
              onClick={toggleDarkMode}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* ✅ FIXED NAVIGATION */}
            <button
              onClick={() => navigate("/signin")}
              className="rounded-full border border-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/register")}
              className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Get Started
            </button>

            <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 dark:border-slate-700 dark:text-slate-300">
              <User className="h-4 w-4" />
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 dark:border-slate-700"
            >
              {darkMode ? <Sun /> : <Moon />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 dark:border-slate-700"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="border-t bg-white md:hidden dark:bg-slate-900">
            <div className="px-4 py-4">

              <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search recipes"
                  className="flex-1 rounded-full border p-2"
                />
                <button className="bg-[var(--color-primary)] text-white px-4 rounded-full">
                  Go
                </button>
              </form>

              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2"
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* PAGE CONTENT */}
      <main>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t bg-[var(--color-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm">
          © 2026 Fresh&Fit
        </div>
      </footer>

    </div>
  );
}