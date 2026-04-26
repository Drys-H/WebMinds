import { Clock3, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAllRecipes, searchRecipes } from "../services/recipeService";
import { Link } from "react-router-dom";

const filters = {
  diet: ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free"],
  cookTime: ["Under 20 min", "20-40 min", "Over 40 min"],
  cuisine: ["Mediterranean", "Asian", "American", "Mexican"],
};

const sortOptions = ["Newest", "Most Popular", "Quick First"];

export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSort, setActiveSort] = useState("Newest");

  const [selectedFilters, setSelectedFilters] = useState({
    diet: [],
    cookTime: [],
    cuisine: [],
  });

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    try {
      setLoading(true);
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
      setLoading(true);
      const data = await searchRecipes(value);
      setRecipes(Array.isArray(data) ? data : []);
      setError("");
    } catch (error) {
      setError("Search is unavailable right now.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(type, value) {
    setSelectedFilters((prev) => {
      const isSelected = prev[type].includes(value);

      return {
        ...prev,
        [type]: isSelected
            ? prev[type].filter((item) => item !== value)
            : [...prev[type], value],
      };
    });
  }

  const filteredRecipes = useMemo(() => {
    let result = [...recipes];

    if (selectedFilters.diet.length > 0) {
      result = result.filter((recipe) =>
          selectedFilters.diet.includes(recipe?.dietaryTag)
      );
    }

    if (selectedFilters.cuisine.length > 0) {
      result = result.filter((recipe) =>
          selectedFilters.cuisine.includes(recipe?.cuisineType)
      );
    }


    if (selectedFilters.cookTime.length > 0) {
      result = result.filter((recipe) => {
        const time = recipe?.cookingTimeMinutes ?? 0;

        return selectedFilters.cookTime.some((filter) => {
          if (filter === "Under 20 min") return time < 20;
          if (filter === "20-40 min") return time >= 20 && time <= 40;
          if (filter === "Over 40 min") return time > 40;
          return true;
        });
      });
    }

    if (activeSort === "Quick First") {
      result.sort(
          (a, b) => (a.cookingTimeMinutes ?? 0) - (b.cookingTimeMinutes ?? 0)
      );
    }

    return result;
  }, [recipes, selectedFilters, activeSort]);

  return (
      <div className="bg-[var(--color-background)] text-[var(--color-text)]">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-5xl">
            All Recipes
          </h1>

          <p className="mt-4 text-base text-[var(--color-text-muted)] sm:text-xl">
            Discover healthy, delicious recipes curated for your lifestyle
          </p>

          {error && (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {error}
              </div>
          )}

          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[260px_1fr]">
            <aside className="h-fit rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6">
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                Filters
              </h2>

              <FilterGroup
                  title="DIET"
                  type="diet"
                  items={filters.diet}
                  selected={selectedFilters.diet}
                  onChange={handleFilterChange}
              />

              <FilterGroup
                  title="COOK TIME"
                  type="cookTime"
                  items={filters.cookTime}
                  selected={selectedFilters.cookTime}
                  onChange={handleFilterChange}
              />

              <FilterGroup
                  title="CUISINE"
                  type="cuisine"
                  items={filters.cuisine}
                  selected={selectedFilters.cuisine}
                  onChange={handleFilterChange}
              />
            </aside>

            <div>
              <div className="mb-5 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative w-full lg:max-w-md">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <input
                          type="text"
                          value={searchTerm}
                          onChange={handleSearch}
                          placeholder="Search recipes"
                          className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-11 pr-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
                      />
                    </div>

                    <p className="text-sm text-[var(--color-text-muted)]">
                      Showing {filteredRecipes.length} recipes
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
                                    : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]"
                            }`}
                        >
                          {option}
                        </button>
                    ))}
                  </div>
                </div>
              </div>

              {loading ? (
                  <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center text-[var(--color-text-muted)] shadow-sm">
                    Loading recipes...
                  </div>
              ) : filteredRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {filteredRecipes.map((recipe) => (
                        <LargeRecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
              ) : (
                  <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center shadow-sm">
                    <h3 className="text-2xl font-bold text-[var(--color-text)]">
                      No recipes available yet
                    </h3>
                    <p className="mt-3 text-[var(--color-text-muted)]">
                      Try changing your search or filters.
                    </p>
                  </div>
              )}
            </div>
          </div>
        </section>
      </div>
  );
}

function FilterGroup({ title, type, items, selected, onChange }) {
  return (
      <div className="mt-8">
        <h3 className="mb-4 text-sm font-bold tracking-wide text-[var(--color-text-muted)]">
          {title}
        </h3>

        <div className="space-y-3">
          {items.map((item) => (
              <label
                  key={item}
                  className="flex items-center gap-3 text-sm text-[var(--color-text)]"
              >
                <input
                    type="checkbox"
                    checked={selected.includes(item)}
                    onChange={() => onChange(type, item)}
                    className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
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
          className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition hover:shadow-md"
      >
        <div className="relative">
          <img
              src={imageUrl}
              alt={title}
              className="h-48 w-full object-cover sm:h-64"
              onError={(e) => {
                e.currentTarget.src =
                    "https://via.placeholder.com/900x600?text=Recipe";
              }}
          />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--color-surface)]/95 px-3 py-1 text-xs font-semibold text-[var(--color-text)]">
            {cuisineType}
          </span>
            <span className="rounded-full bg-[var(--color-surface)]/95 px-3 py-1 text-xs font-semibold text-[var(--color-text)]">
            {dietaryTag}
          </span>
          </div>

          <button
              type="button"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-[var(--color-surface)]/95 text-[var(--color-text-muted)]"
          >
            ❤
          </button>
        </div>

        <div className="p-5">
          <h3 className="text-2xl font-bold leading-tight text-[var(--color-text)] sm:text-3xl">
            {title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">
            Discover this recipe and view the full details on the recipe page.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)]">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-4 w-4" />
            {cookingTimeMinutes} min
          </span>

            <span>{servings} servings</span>
          </div>

          <div className="mt-4 border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-text-muted)]">
            by {authorUsername}
          </div>
        </div>
      </Link>
  );
}