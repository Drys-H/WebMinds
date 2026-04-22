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
      className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <img
        src={imageUrl}
        alt={title}
        className="h-52 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>

        <p className="mt-2 text-sm text-slate-600">
          {cuisineType} • {dietaryTag}
        </p>

        <div className="mt-3 text-sm text-slate-500">
          {cookingTimeMinutes} min • {servings} servings
        </div>

        <p className="mt-3 text-sm text-slate-500">
          By {authorUsername}
        </p>
      </div>
    </Link>
  );
}