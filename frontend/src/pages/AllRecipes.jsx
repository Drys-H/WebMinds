import { Clock3, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAllRecipes, searchRecipes } from "../services/recipeService";
import { Link } from "react-router-dom";

const filters = {
  diet: ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free"],
  cookTime: ["Under 20 min", "20-40 min", "Over 40 min"],
  cuisine: ["Mediterranean", "Asian", "American", "Mexican"],
  difficulty: ["Easy", "Medium", "Hard"],
};

const sortOptions = ["Newest", "Most Popular", "Quick First"];

export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSort, setActiveSort] = useState("Newest");

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    try {
      const data = await getAllRecipes();
      setRecipes(Array.isArray(data) ? data : []);
      setError("");
    } catch (error) {
      setError("Recipes are unavailable right now.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      loadRecipes();
      return;
    }

    try {
      const data = await searchRecipes(value);
      setRecipes(Array.isArray(data) ? data : []);
      setError("");
    } catch (error) {
      setError("Search is unavailable right now.");
      setRecipes([]);
    }
  }

  const sortedRecipes = useMemo(() => {
    const copied = [...recipes];

    if (activeSort === "Quick First") {
      return copied.sort(
        (a, b) => (a.cookingTimeMinutes ?? 0) - (b.cookingTimeMinutes ?? 0)
      );
    }

    return copied;
  }, [recipes, activeSort]);

  return (
    <div className="bg-[#7e9a78]">
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-white">
          All Recipes
        </h1>

        <p className="mt-4 text-xl text-white/80">
          Discover healthy, delicious recipes curated for your lifestyle
        </p>

        {error && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Filters</h2>

            <FilterGroup title="DIET" items={filters.diet} />
            <FilterGroup title="COOK TIME" items={filters.cookTime} />
            <FilterGroup title="CUISINE" items={filters.cuisine} />
            <FilterGroup title="DIFFICULTY" items={filters.difficulty} />
          </aside>

          <div>
            <div className="mb-5 rounded-3xl bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative w-full lg:max-w-md">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      placeholder="Search recipes"
                      className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)]"
                    />
                  </div>

                  <p className="hidden text-sm text-slate-500 md:block">
                    Showing {sortedRecipes.length} recipes
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setActiveSort(option)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activeSort === option
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
                Loading recipes...
              </div>
            ) : sortedRecipes.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {sortedRecipes.map((recipe) => (
                  <LargeRecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900">
                  No recipes available yet
                </h3>
                <p className="mt-3 text-slate-500">
                  recipes will appear once creators upload them.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function FilterGroup({ title, items }) {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-sm font-bold tracking-wide text-slate-700">
        {title}
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center gap-3 text-sm text-slate-700"
          >
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function LargeRecipeCard({ recipe }) {
  const recipeId = recipe?.id;
  const title = recipe?.title || "Recipe title";
  const imageUrl =
    recipe?.imageUrl || "https://via.placeholder.com/900x600?text=Recipe";
  const cuisineType = recipe?.cuisineType || "Cuisine";
  const dietaryTag = recipe?.dietaryTag || "Tag";
  const cookingTimeMinutes = recipe?.cookingTimeMinutes ?? 0;
  const servings = recipe?.servings ?? 0;
  const authorUsername = recipe?.authorUsername || "Unknown";

  return (
    <Link
      to={recipeId ? `/recipes/${recipeId}` : "#"}
      className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="h-64 w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/900x600?text=Recipe";
          }}
        />

        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">
            {cuisineType}
          </span>
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">
            {dietaryTag}
          </span>
        </div>

        <button
          type="button"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-slate-500"
        >
          ❤
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-3xl font-bold leading-tight text-slate-900">
          {title}
        </h3>

        <p className="mt-3 text-base leading-7 text-slate-600">
          Discover this recipe and view the full details on the recipe page.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-4 w-4" />
            {cookingTimeMinutes} min
          </span>

          <span>{servings} servings</span>
        </div>

        <div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-500">
          by {authorUsername}
        </div>
      </div>
    </Link>
  );
}