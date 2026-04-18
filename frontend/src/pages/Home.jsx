import { useEffect, useState } from "react";
import { getAllRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getAllRecipes();
        setRecipes(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  if (loading) {
    return <div className="p-6">Loading recipes...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  const trendingRecipes = recipes.slice(0, 4);
  const freshRecipes = recipes.slice(4, 8);
  const seasonalRecipes = recipes.slice(8, 10);

  return (
    <div className="bg-[#f7f8f5]">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-4xl font-bold">Cook Fresh, Live Healthy, Feel Great</h1>
        <p className="mt-4 text-slate-600">Discover nutritious recipes from the backend.</p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-6 text-3xl font-bold">Trending Now</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {trendingRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-6 text-3xl font-bold">Fresh & New</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {freshRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-6 text-3xl font-bold">Seasonal Favorites</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {seasonalRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </div>
  );
}