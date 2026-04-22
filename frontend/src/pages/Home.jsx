import { Link } from "react-router-dom";
import {
  Search,
  Sparkles,
  Star,
  ArrowRight,
  Flame,
  Heart,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAllRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";

const chipFilters = ["All", "Keto", "Vegan", "High Protein"];

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getAllRecipes();
        setRecipes(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        setError("Recipes are unavailable right now.");
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  const filteredRecipes = useMemo(() => {
    if (!searchTerm.trim()) return recipes;

    const term = searchTerm.toLowerCase();

    return recipes.filter((recipe) =>
      [
        recipe?.title,
        recipe?.cuisineType,
        recipe?.dietaryTag,
        recipe?.authorUsername,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [recipes, searchTerm]);

  const featuredRecipe = filteredRecipes[0] || null;
  const trendingRecipes = filteredRecipes.slice(0, 4);
  const freshRecipes = filteredRecipes.slice(4, 8);
  const seasonalRecipes = filteredRecipes.slice(8, 10);

  return (
    <div className="bg-[#f7f8f5]">
      {error && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-amber-700">
            {error}
          </div>
        </div>
      )}

      <section className="border-b border-slate-200">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-6 flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]">
              <Sparkles className="h-4 w-4" />
              Healthy & Delicious Recipes
            </div>

            <h1 className="max-w-xl text-5xl font-extrabold leading-tight tracking-tight text-slate-950 md:text-6xl">
              Cook Fresh,
              <br />
              Live <span className="italic text-[var(--color-primary)]">Healthy</span>,
              <br />
              Feel Great
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
              Discover thousands of nutritious recipes, filter by dietary needs,
              and share your own creation with a community that loves good food.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/recipes"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Explore Recipes
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/community"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-primary)] bg-white px-6 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white"
              >
                <Sparkles className="h-4 w-4" />
                Join Community
              </Link>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-extrabold text-[var(--color-primary)]">
                  12,000+
                </p>
                <p className="text-sm text-slate-500">Healthy Recipes</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[var(--color-primary)]">
                  8,000+
                </p>
                <p className="text-sm text-slate-500">Food Lovers</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[var(--color-primary)]">
                  4.9★
                </p>
                <p className="text-sm text-slate-500">Avg Rating</p>
              </div>
            </div>
          </div>

          <div>
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-200">
              {featuredRecipe ? (
                <>
                  <img
                    src={
                      featuredRecipe.imageUrl ||
                      "https://via.placeholder.com/900x600?text=Recipe"
                    }
                    alt={featuredRecipe.title || "Featured recipe"}
                    className="h-[340px] w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/900x600?text=Recipe";
                    }}
                  />

                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                        🔥 Featured
                      </span>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{featuredRecipe.cookingTimeMinutes ?? 0} min</span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900">
                      {featuredRecipe.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {featuredRecipe.cuisineType || "Cuisine"} •{" "}
                      {featuredRecipe.dietaryTag || "Tag"}
                    </p>

                    <Link
                      to={`/recipes/${featuredRecipe.id}`}
                      className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      View Recipe
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-[340px] w-full bg-slate-200" />
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                        🔥 Featured
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900">
                      Featured recipe coming soon
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      recipe will be shown here once available.
                    </p>

                    <Link
                      to="/recipes"
                      className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Explore Recipes
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mx-auto max-w-3xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search recipes, categories, or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white py-4 pl-12 pr-5 text-sm outline-none transition focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {chipFilters.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RecipeSection
        title="Trending Now"
        subtitle="Most popular recipes this week"
        recipes={trendingRecipes}
        loading={loading}
      />

      <RecipeSection
        title="Fresh & New"
        subtitle="Latest recipes from our community"
        recipes={freshRecipes}
        loading={loading}
      />

      <RecipeSection
        title="Seasonal Favorites"
        subtitle="Perfect for this time of year"
        recipes={seasonalRecipes}
        loading={loading}
      />
      <section className="mt-12 bg-[var(--color-primary)] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm text-white/80">
              <Heart className="h-4 w-4" />
              Join Our Community
            </div>

            <h2 className="max-w-md text-4xl font-extrabold leading-tight">
              Share Your Culinary Creations
            </h2>

            <p className="mt-5 max-w-lg text-white/80">
              Connect with thousands of food lovers, share your recipes, and
              discover new favorites from our talented community of home cooks.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--color-primary)]">
                Create Free Account
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoBox
              title="12,000+"
              text="Healthy recipes with dietary filters"
              icon="🍽️"
            />
            <InfoBox
              title="Smart shopping"
              text="lists synced with recipes"
              icon="🛒"
            />
            <InfoBox
              title="Share recipes"
              text="and build following"
              icon="🧑‍🍳"
            />
            <InfoBox
              title="Personalised weekly"
              text="meal planner"
              icon="📅"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function RecipeSection({ title, subtitle, recipes, loading }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-3xl font-extrabold text-slate-950">
            <Flame className="h-5 w-5 text-[var(--color-accent)]" />
            {title}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>

        <Link
          to="/recipes"
          className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            Loading recipes...
          </div>
        ) : recipes.length > 0 ? (
          recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
        ) : (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            Recipes will appear here when the backend data is available.
          </div>
        )}
      </div>
    </section>
  );
}

function InfoBox({ title, text, icon }) {
  return (
    <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
      <div className="text-2xl">{icon}</div>
      <h3 className="mt-3 text-2xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-white/80">{text}</p>
    </div>
  );
}