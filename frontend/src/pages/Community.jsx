import { useEffect, useState } from "react";
import { getAllRecipes } from "../services/recipeService";

export default function Community() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getAllRecipes();
        setRecipes(data || []);
      } catch (error) {
        console.error(error);
      }
    }

    loadRecipes();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Community</h1>

      <div className="space-y-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">{recipe.title}</h2>
            <p className="mt-2 text-slate-600">
              Shared by {recipe.authorUsername || "Unknown"}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {recipe.cuisineType || "Cuisine"} • {recipe.dietaryTag || "Tag"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}