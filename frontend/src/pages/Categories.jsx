import { Link } from "react-router-dom";
import { Clock3, Globe, Leaf, Utensils } from "lucide-react";
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

const defaultMealTypes = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Desserts",
  "Appetizers",
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
    <div className="bg-[#f7f8f5]">
      <section className="bg-[var(--color-primary)]">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-6xl">
            Recipe Categories
          </h1>
          <p className="mt-5 max-w-3xl text-xl text-white/85">
            Browse recipes by your favorite categories and discover new dishes
          </p>
        </div>
      </section>

      {error && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-amber-700">
            {error}
          </div>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12">
        <CategorySection
          icon={
            <div className="rounded-2xl bg-green-100 p-3 text-[var(--color-primary)]">
              <Leaf className="h-6 w-6" />
            </div>
          }
          title="By Dietary Preference"
          items={dietaryCategories}
        />

        <CategorySection
          icon={
            <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
              <Globe className="h-6 w-6" />
            </div>
          }
          title="By Cuisine"
          items={cuisineCategories}
        />

        <CategorySection
          icon={
            <div className="rounded-2xl bg-violet-100 p-3 text-violet-600">
              <Utensils className="h-6 w-6" />
            </div>
          }
          title="By Meal Type"
          items={defaultMealTypes}
        />

        <CategorySection
          icon={
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
              <Clock3 className="h-6 w-6" />
            </div>
          }
          title="By Cooking Time"
          items={defaultCookingTimes}
        />

        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-extrabold text-slate-950">Popular Tags</h2>

          <div className="mt-8 flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <Link
                key={tag}
                to="/recipes"
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
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
    <section className="mb-14">
      <div className="mb-8 flex items-center gap-4">
        {icon}
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-950">
          {title}
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {items.map((item) => (
          <Link
            key={item}
            to="/recipes"
            className="flex min-h-[72px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center text-lg font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            {item}
          </Link>
        ))}
      </div>
    </section>
  );
}