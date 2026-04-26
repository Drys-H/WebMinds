import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  const recipeId = recipe?.id;
  const title = recipe?.title || "Recipe title";
  const imageUrl =
      recipe?.imageUrl || "https://via.placeholder.com/400x300?text=Recipe";
  const cuisineType = recipe?.cuisineType || "Cuisine";
  const dietaryTag = recipe?.dietaryTag || "Tag";
  const cookingTimeMinutes = recipe?.cookingTimeMinutes ?? 0;
  const servings = recipe?.servings ?? 0;
  const authorUsername = recipe?.authorUsername || "Unknown";

  return (
      <Link
          to={recipeId ? `/recipes/${recipeId}` : "#"}
          className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
      >
        <img
            src={imageUrl}
            alt={title}
            className="h-44 w-full object-cover sm:h-52"
            onError={(e) => {
              e.currentTarget.src =
                  "https://via.placeholder.com/400x300?text=Recipe";
            }}
        />

        <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
            {title}
          </h3>

          <p className="text-sm text-slate-600">
            {cuisineType} • {dietaryTag}
          </p>

          <div className="text-sm text-slate-500">
            {cookingTimeMinutes} min • {servings} servings
          </div>

          <p className="mt-auto text-sm text-slate-500">
            By {authorUsername}
          </p>
        </div>
      </Link>
  );
}