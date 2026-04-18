import { Menu, Search, User, X } from "lucide-react";
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
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[var(--color-background)] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-[var(--color-primary)]">FRESH</span>
            <span className="text-[var(--color-accent)]">&amp;</span>
            <span className="text-[var(--color-primary)]">FIT</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition ${
                    isActive
                      ? "text-[var(--color-primary)]"
                      : "text-slate-600 hover:text-[var(--color-primary)]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search recipes"
                className="w-72 rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
              />
            </form>

            <button className="rounded-full border border-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white">
              Sign In
            </button>

            <button className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
              Get Started
            </button>

            <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600">
              <User className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[var(--color-border)] bg-white md:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <form onSubmit={handleSearchSubmit} className="mb-4 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search recipes"
                    className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--color-primary)] focus:bg-white"
                  />
                </div>
                <button className="rounded-full bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white">
                  Go
                </button>
              </form>

              <div className="space-y-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-2xl px-4 py-3 text-sm font-semibold ${
                        isActive
                          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "text-slate-700"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-bold">
                <span className="text-[#6B8E6F]">FRESH</span>
                <span className="text-[#E88D67]">&</span>
                <span className="text-[#6B8E6F]">FIT</span>
              </h3>
              <p className="text-sm text-gray-600">
                Join thousands of food lovers cooking healthier every day.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Explore</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/recipes" className="hover:text-[#6B8E6F]">All Recipes</Link></li>
                <li><Link to="/categories" className="hover:text-[#6B8E6F]">Categories</Link></li>
                <li><Link to="/community" className="hover:text-[#6B8E6F]">Community</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Community</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#6B8E6F]">Blog</a></li>
                <li><a href="#" className="hover:text-[#6B8E6F]">About Us</a></li>
                <li><a href="#" className="hover:text-[#6B8E6F]">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#6B8E6F]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#6B8E6F]">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 Fresh&amp;Fit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}