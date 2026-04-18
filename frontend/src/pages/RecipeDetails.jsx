import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id]);

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

  if (loading) {
    return <div className="p-6">Loading recipe...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!recipe || !recipe.id) {
    return <div className="p-6">Recipe not found</div>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          to="/recipes"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to recipes
        </Link>

        <img
          src={recipe.imageUrl || "https://via.placeholder.com/800x400?text=Recipe"}
          alt={recipe.title}
          className="mt-6 h-80 w-full rounded-3xl object-cover"
        />

        <div className="mt-6 flex items-center justify-between gap-4">
          <h1 className="text-4xl font-bold text-slate-900">{recipe.title}</h1>
          <button
            onClick={handleShare}
            className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-white"
          >
            Share
          </button>
        </div>

        <div className="mt-4 space-y-2 text-slate-600">
          <p><strong>Author:</strong> {recipe.authorUsername || "Unknown"}</p>
          <p><strong>Cuisine:</strong> {recipe.cuisineType || "N/A"}</p>
          <p><strong>Dietary Tag:</strong> {recipe.dietaryTag || "N/A"}</p>
          <p><strong>Cooking Time:</strong> {recipe.cookingTimeMinutes || 0} min</p>
          <p><strong>Servings:</strong> {recipe.servings || 0}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Preparation Steps</h2>
          <p className="mt-3 whitespace-pre-line text-slate-700">
            {recipe.preparationSteps || "No preparation steps available."}
          </p>
        </div>
      </div>
    </div>
  );
}