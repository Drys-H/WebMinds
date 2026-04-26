import { Link } from "react-router-dom";
import { Clock3, Globe, Leaf } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAllRecipes } from "../services/recipeService";

const defaultDietary = [
  "Vegan",
  "Vegetarian",
  "Gluten-Free",
  "Dairy-Free",
  "High Protein",
  "Quick Meals",
  "Keto",
  "Low Carb",
  "Paleo",
];

const defaultCuisine = [
  "Mediterranean",
  "Asian",
  "American",
  "Mexican",
  "Italian",
  "Indian",
  "Thai",
  "Japanese",
  "French",
];

const defaultCookingTimes = [
  "Under 15 min",
  "15-30 min",
  "30-45 min",
  "45-60 min",
  "Over 1 hour",
];

const popularTags = [
  "Quick & Easy",
  "Family Friendly",
  "Meal Prep",
  "Budget Friendly",
  "One Pot",
  "Low Carb",
  "Heart Healthy",
  "Weight Loss",
  "Comfort Food",
  "Summer Recipes",
  "Winter Warmers",
  "Holiday Specials",
  "BBQ & Grilling",
  "Soups & Stews",
  "Salads",
  "Smoothies",
];

export default function Categories() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getAllRecipes();
        setRecipes(Array.isArray(data) ? data : []);
        setError("");
      } catch (error) {
        setRecipes([]);
        setError("Categories are unavailable right now.");
      }
    }

    loadRecipes();
  }, []);

  const cuisineCategories = useMemo(() => {
    const backendValues = recipes
        .map((recipe) => recipe?.cuisineType)
        .filter(Boolean);

    const merged = [...new Set([...backendValues, ...defaultCuisine])];
    return merged.slice(0, 9);
  }, [recipes]);

  const dietaryCategories = useMemo(() => {
    const backendValues = recipes
        .map((recipe) => recipe?.dietaryTag)
        .filter(Boolean);

    const merged = [...new Set([...backendValues, ...defaultDietary])];
    return merged.slice(0, 9);
  }, [recipes]);

  return (
      <div className="bg-[var(--color-background)] text-[var(--color-text)]">
        <section className="bg-[var(--color-hero-bg)]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-hero-text)] sm:text-5xl lg:text-6xl">
              Recipe Categories
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-hero-subtext)] sm:mt-5 sm:text-xl">
              Browse recipes by your favorite categories and discover new dishes
            </p>
          </div>
        </section>

        {error && (
            <div className="border-b border-amber-200 bg-amber-50">
              <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-amber-700 sm:px-6 lg:px-8">
                {error}
              </div>
            </div>
        )}

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <CategorySection
              icon={
                <div className="rounded-2xl bg-green-100 p-3 text-[var(--color-primary)]">
                  <Leaf className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              }
              title="By Dietary Preference"
              items={dietaryCategories}
          />

          <CategorySection
              icon={
                <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
                  <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              }
              title="By Cuisine"
              items={cuisineCategories}
          />

          <CategorySection
              icon={
                <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                  <Clock3 className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              }
              title="By Cooking Time"
              items={defaultCookingTimes}
          />

          <section className="mt-10 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:mt-12 sm:p-8">
            <h2 className="text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">
              Popular Tags
            </h2>

            <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
              {popularTags.map((tag) => (
                  <Link
                      key={tag}
                      to="/recipes"
                      className="rounded-full bg-[var(--color-background)] px-3 py-2 text-xs font-medium text-[var(--color-text-muted)] transition hover:bg-[var(--color-border)] hover:text-[var(--color-primary)] sm:px-4 sm:text-sm"
                  >
                    {tag}
                  </Link>
              ))}
            </div>
          </section>
        </section>
      </div>
  );
}

function CategorySection({ icon, title, items }) {
  return (
      <section className="mb-10 sm:mb-14">
        <div className="mb-5 flex items-center gap-3 sm:mb-8 sm:gap-4">
          {icon}

          <h2 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl lg:text-4xl">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {items.map((item) => (
              <Link
                  key={item}
                  to="/recipes"
                  className="flex min-h-[64px] items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-center text-base font-semibold text-[var(--color-text)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] sm:min-h-[72px] sm:px-5 sm:py-4 sm:text-lg"
              >
                {item}
              </Link>
          ))}
        </div>
      </section>
  );
}