import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  Share2,
  Users,
  Star,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { getRecipeById } from "../services/recipeService";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
        setError("");
      } catch (err) {
        setError("Recipe details are unavailable right now.");
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id]);

  const steps = useMemo(() => {
    if (!recipe?.preparationSteps) return [];
    return recipe.preparationSteps
      .split(/\r?\n|\.\s+/)
      .map((step) => step.trim())
      .filter(Boolean);
  }, [recipe]);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe?.title || "Recipe",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Recipe link copied");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const title = recipe?.title || "Recipe title";
  const imageUrl =
    recipe?.imageUrl || "https://via.placeholder.com/1400x700?text=Recipe";
  const cuisineType = recipe?.cuisineType || "Cuisine";
  const dietaryTag = recipe?.dietaryTag || "Tag";
  const cookingTimeMinutes = recipe?.cookingTimeMinutes ?? 0;
  const servings = recipe?.servings ?? 0;
  const authorUsername = recipe?.authorUsername || "Unknown";

  return (
    <div className="bg-[#f7f8f5]">
      {error && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-amber-700">
            {error}
          </div>
        </div>
      )}

      <section className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-[420px] w-full object-cover md:h-[520px]"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/1400x700?text=Recipe";
          }}
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-7xl flex-col justify-between px-4 py-6">
            <div className="flex items-start justify-between gap-4">
              <Link
                to="/recipes"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Recipes
              </Link>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="grid h-11 w-11 place-items-center rounded-xl bg-[#ff5a5f] text-white shadow-sm"
                >
                  <Heart className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="grid h-11 w-11 place-items-center rounded-xl bg-white text-slate-700 shadow-sm"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="pb-8 text-white">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                  {cuisineType}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                  {dietaryTag}
                </span>
              </div>

              <h1 className="max-w-3xl text-5xl font-extrabold leading-tight md:text-6xl">
                {title}
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-white/85">
                Discover the full recipe details, preparation flow, and serving
                info for this dish.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatBox
                  icon={<Clock3 className="h-5 w-5 text-[var(--color-primary)]" />}
                  value={`${cookingTimeMinutes}`}
                  label="minutes"
                />
                <StatBox
                  icon={<Star className="h-5 w-5 text-[var(--color-accent)]" />}
                  value={recipe ? "4.8" : "--"}
                  label="rating"
                />
                <StatBox
                  icon={<Users className="h-5 w-5 text-[var(--color-primary)]" />}
                  value={`${servings}`}
                  label="servings"
                />
                <StatBox
                  icon={<ShoppingCart className="h-5 w-5 text-[var(--color-primary)]" />}
                  value={recipe ? "Ready" : "--"}
                  label="details"
                />
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-3xl font-extrabold text-slate-950">
                  Ingredients
                </h2>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Shopping List
                </button>
              </div>

              <div className="space-y-4 text-slate-700">
                {recipe ? (
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                      Fresh ingredients will display here when the backend returns ingredient details.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                      This section is ready for real ingredient data.
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                      Ingredients will appear here once recipe data is available.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                      This layout is already prepared for the backend response.
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-3xl font-extrabold text-slate-950">
                Instructions
              </h2>

              <div className="mt-6 space-y-4">
                {steps.length > 0 ? (
                  steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <p className="pt-1 text-slate-700">{step}</p>
                    </div>
                  ))
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
                        1
                      </div>
                      <p className="pt-1 text-slate-700">
                        Preparation steps will appear here when the backend returns them.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
                        2
                      </div>
                      <p className="pt-1 text-slate-700">
                        This section is already styled and ready for real recipe instructions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-3xl font-extrabold text-slate-950">
                Reviews & Comments
              </h2>

              <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                <h3 className="text-xl font-bold text-slate-900">Leave a review</h3>
                <p className="mt-4 text-sm text-slate-500">
                  Reviews will be connected once the review/comment flow is fully integrated.
                </p>

                <textarea
                  placeholder="Share your thoughts about this recipe..."
                  className="mt-4 h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />

                <button className="mt-4 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">
                  Submit Review
                </button>
              </div>

              <p className="mt-8 text-center text-slate-500">
                No reviews yet. Be the first to review this recipe!
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">Recipe by</h3>

              <div className="mt-5 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-slate-200" />
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    {authorUsername}
                  </p>
                  <p className="text-sm text-slate-500">View profile →</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">Details</h3>

              <div className="mt-5 space-y-4 text-slate-700">
                <div>
                  <p className="text-sm text-slate-500">Cuisine</p>
                  <p className="font-semibold">{cuisineType}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Cook Time</p>
                  <p className="font-semibold">{cookingTimeMinutes} min</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Servings</p>
                  <p className="font-semibold">{servings}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">
                Dietary Tags
              </h3>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-2 text-sm font-semibold text-[var(--color-primary)]">
                  {dietaryTag}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function StatBox({ icon, value, label }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-center">
      <div className="mb-2 flex justify-center">{icon}</div>
      <p className="text-3xl font-extrabold text-slate-950">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}