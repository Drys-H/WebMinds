import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <img
        src={recipe.imageUrl || "https://via.placeholder.com/400x300?text=Recipe"}
        alt={recipe.title}
        className="h-52 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="text-xl font-bold text-slate-900">{recipe.title}</h3>

        <p className="mt-2 text-sm text-slate-600">
          {recipe.cuisineType || "Cuisine"} • {recipe.dietaryTag || "Tag"}
        </p>

        <div className="mt-3 text-sm text-slate-500">
          {recipe.cookingTimeMinutes || 0} min • {recipe.servings || 0} servings
        </div>

        <p className="mt-3 text-sm text-slate-500">
          By {recipe.authorUsername || "Unknown"}
        </p>
      </div>
    </Link>
  );
}