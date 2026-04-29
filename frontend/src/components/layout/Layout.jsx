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
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">

        {/* HEADER */}
        <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

            {/* LOGO */}
            <Link to="/" className="text-xl font-extrabold tracking-tight sm:text-2xl">
              <span className="text-[var(--color-primary)]">FRESH</span>
              <span className="text-[var(--color-accent)]">&amp;</span>
              <span className="text-[var(--color-primary)]">FIT</span>
            </Link>

            {/* NAV */}
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

            {/* RIGHT SIDE */}
            <div className="hidden items-center gap-3 lg:flex">

              <button className="rounded-full border border-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white">
                <Link to="/signin">Sign In</Link>
              </button>

              <button className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
                <Link to="/register">Get Started</Link>
              </button>

              <button className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-text)]">
                <User className="h-4 w-4" />
              </button>
            </div>

            {/* MOBILE */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)]"
                  onClick={() => setMobileMenuOpen((open) => !open)}
              >
                {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {mobileMenuOpen && (
              <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] md:hidden">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

                  <form onSubmit={handleSearchSubmit} className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                          type="search"
                          value={search}
                          onChange={(event) => setSearch(event.target.value)}
                          placeholder="Search recipes"
                          className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <button className="w-full rounded-full bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white sm:w-auto">
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
                                        : "text-[var(--color-text)]"
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

        {/* MAIN */}
        <main>
          <Outlet />
        </main>

        {/* FOOTER */}
        <footer className="mt-16 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

              <div>
                <h3 className="mb-4 text-lg font-bold">
                  <span className="text-[#6B8E6F]">FRESH</span>
                  <span className="text-[#E88D67]">&</span>
                  <span className="text-[#6B8E6F]">FIT</span>
                </h3>
                <p className="text-sm text-slate-500">
                  Join thousands of food lovers cooking healthier every day.
                </p>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">Explore</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li><Link to="/recipes">All Recipes</Link></li>
                  <li><Link to="/categories">Categories</Link></li>
                  <li><Link to="/community">Community</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">Community</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li>Blog</li>
                  <li>About Us</li>
                  <li>Contact</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>

            </div>

            <div className="mt-8 border-t border-[var(--color-border)] pt-8 text-center text-sm text-slate-500">
              <p>&copy; 2026 Fresh&amp;Fit. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
  );
}