import { useEffect, useState } from "react";
import { getAllRecipes, searchRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";

export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    try {
      const data = await getAllRecipes();
      setRecipes(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      loadRecipes();
      return;
    }

    try {
      const data = await searchRecipes(value);
      setRecipes(data || []);
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return <div className="p-6">Loading recipes...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">All Recipes</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search recipes"
        className="mb-8 w-full rounded-full border border-slate-300 px-5 py-3 outline-none"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}