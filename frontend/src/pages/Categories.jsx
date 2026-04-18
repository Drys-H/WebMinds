import { useEffect, useState } from "react";
import { getAllRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";

export default function Categories() {
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

  const grouped = recipes.reduce((acc, recipe) => {
    const key = recipe.cuisineType || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(recipe);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Categories</h1>

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="mb-10">
          <h2 className="mb-5 text-2xl font-semibold">{category}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {items.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}