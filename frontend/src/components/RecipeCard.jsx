import { Clock3 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function RecipeCard({ recipe, onSave }) {
  const recipeId = recipe?.id;
  const title = recipe?.title || "Recipe title";
  const imageUrl =
      recipe?.imageUrl || "https://via.placeholder.com/900x600?text=Recipe";
  const cuisineType = recipe?.cuisineType || "Cuisine";
  const dietaryTag = recipe?.dietaryTag || "Tag";
  const cookingTimeMinutes = recipe?.cookingTimeMinutes ?? 0;
  const servings = recipe?.servings ?? 0;
  const authorUsername = recipe?.authorUsername || "Unknown";
  const [saved, setSaved] = useState(false);

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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSave?.(recipeId);
                setSaved(true);
              }}
              className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full ${
                  saved
                      ? "bg-red-500 text-white"
                      : "bg-[var(--color-surface)]/95 text-[var(--color-text-muted)]"
              }`}
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