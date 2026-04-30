import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  Share2,
  Users,
  Star,
  Heart,
  ShoppingCart,
} from "lucide-react";
import {
  getRecipeById,
  getCommentsForRecipe,
  addComment,
  addRecipeRating,
  getAverageRecipeRating,
  saveRecipe,
} from "../services/recipeService";

const API_BASE_URL = "http://localhost:8080/api";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [averageRating, setAverageRating] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await getRecipeById(id);
        const commentsData = await getCommentsForRecipe(id);
        const ratingData = await getAverageRecipeRating(id);

        setRecipe(data);
        setComments(Array.isArray(commentsData) ? commentsData : []);
        setAverageRating(ratingData);
        setError("");
      } catch (err) {
        setError("Recipe details are unavailable right now.");
        setRecipe(null);
        setComments([]);
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id]);

  const steps = useMemo(() => {
    if (!recipe?.preparationSteps) return [];

    if (Array.isArray(recipe.preparationSteps)) {
      return recipe.preparationSteps.filter(Boolean);
    }

    return String(recipe.preparationSteps)
        .split(/\r?\n|\.\s+/)
        .map((step) => step.trim())
        .filter(Boolean);
  }, [recipe]);

  const ingredients = useMemo(() => {
    if (!recipe?.ingredients) return [];

    if (Array.isArray(recipe.ingredients)) {
      return recipe.ingredients.filter(Boolean);
    }

    return String(recipe.ingredients)
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);
  }, [recipe]);

  function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  function requireLogin() {
    const user = getLoggedInUser();

    if (!user?.username || !user?.token) {
      navigate("/signin");
      return null;
    }

    return user;
  }

  // ✅ FIXED SAVE FUNCTION (backend + local sync)
  const handleSaveRecipe = async () => {
    const user = requireLogin();
    if (!user) return;

    try {
      // save recipe
      await saveRecipe(user.username, id);

      // add to shopping list (backend)
      const res = await fetch(
          `${API_BASE_URL}/users/${user.username}/shopping-lists/recipe/${id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Shopping list error:", text);
      }

      // ✅ local fallback (so Profile updates instantly)
      const existing =
          JSON.parse(localStorage.getItem("shoppingList")) || [];

      const merged = [...existing];

      ingredients.forEach((i) => {
        if (!merged.includes(i)) {
          merged.push(i);
        }
      });

      localStorage.setItem("shoppingList", JSON.stringify(merged));

      alert("Recipe saved & added to shopping list!");
    } catch (error) {
      console.error(error);
      alert("Something failed");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      alert("Recipe link copied!");
    } catch (error) {
      alert(url);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const user = requireLogin();
    if (!user) return;

    if (!rating || !comment.trim()) {
      alert("Please add a rating and comment.");
      return;
    }

    try {
      await addRecipeRating(id, user.username, rating);

      const newComment = await addComment(id, {
        text: comment,
        rating,
        authorUsername: user.username,
      });

      const updatedRating = await getAverageRecipeRating(id);

      setComments((prev) => [newComment, ...prev]);
      setAverageRating(updatedRating);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error(error);
      alert("Could not submit review.");
    }
  };

  if (loading) {
    return (
        <div className="bg-[var(--color-background)] px-4 py-20 text-center text-[var(--color-text-muted)]">
          Loading recipe details...
        </div>
    );
  }

  return (
      <div className="bg-[var(--color-background)] text-[var(--color-text)]">

        {/* HEADER */}
        <section className="relative">
          <img
              src={recipe?.imageUrl || "https://via.placeholder.com/1400x700"}
              alt={recipe?.title}
              className="w-full h-[400px] object-cover"
          />

          <div className="absolute top-5 left-5 flex gap-3">
            <Link to="/recipes" className="bg-white px-3 py-2 rounded">
              <ArrowLeft />
            </Link>

            <button onClick={handleSaveRecipe} className="bg-red-500 p-3 rounded text-white">
              <Heart />
            </button>

            <button onClick={handleShare} className="bg-white p-3 rounded">
              <Share2 />
            </button>
          </div>
        </section>

        {/* INGREDIENTS */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Ingredients</h2>

          <ul className="space-y-2">
            {ingredients.map((i, index) => (
                <li key={index}>{i}</li>
            ))}
          </ul>
        </div>

      </div>
  );
}

function StatBox({ icon, value, label }) {
  return (
      <div className="rounded-2xl border p-4 text-center">
        <div>{icon}</div>
        <p className="text-xl font-bold">{value}</p>
        <p>{label}</p>
      </div>
  );
}