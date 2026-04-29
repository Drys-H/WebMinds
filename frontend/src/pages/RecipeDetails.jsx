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

  const handleSaveRecipe = async () => {
    const user = requireLogin();
    if (!user) return;

    try {
      await saveRecipe(user.username, id);
      alert("Recipe saved to your profile.");
    } catch (error) {
      console.error(error);
      alert("Could not save recipe.");
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

  const title = recipe?.title || "Recipe title";
  const imageUrl =
      recipe?.imageUrl || "https://via.placeholder.com/1400x700?text=Recipe";
  const cuisineType = recipe?.cuisineType || "Cuisine";
  const dietaryTag =
      recipe?.dietaryTag || recipe?.dietaryTags || recipe?.diet || "";
  const cookingTimeMinutes = recipe?.cookingTimeMinutes ?? 0;
  const servings = recipe?.servings ?? 0;
  const authorUsername = recipe?.authorUsername || "Unknown";

  if (loading) {
    return (
        <div className="bg-[var(--color-background)] px-4 py-20 text-center text-[var(--color-text-muted)]">
          Loading recipe details...
        </div>
    );
  }

  return (
      <div className="bg-[var(--color-background)] text-[var(--color-text)]">
        {error && (
            <div className="border-b border-amber-200 bg-amber-50">
              <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-amber-700 sm:px-6 lg:px-8">
                {error}
              </div>
            </div>
        )}

        <section className="relative overflow-hidden">
          <img
              src={imageUrl}
              alt={title}
              className="h-[360px] w-full object-cover sm:h-[420px] lg:h-[520px]"
              onError={(e) => {
                e.currentTarget.src =
                    "https://via.placeholder.com/1400x700?text=Recipe";
              }}
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0">
            <div className="mx-auto flex h-full max-w-7xl flex-col justify-between px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
              <div className="flex items-start justify-between gap-3">
                <Link
                    to="/recipes"
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold text-[var(--color-text)] shadow-sm sm:px-4 sm:text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>

                <div className="flex gap-2 sm:gap-3">
                  <button
                      type="button"
                      onClick={handleSaveRecipe}
                      className="grid h-10 w-10 place-items-center rounded-xl bg-[#ff5a5f] text-white shadow-sm sm:h-11 sm:w-11"
                      aria-label="Save recipe"
                  >
                    <Heart className="h-5 w-5" />
                  </button>

                  <button
                      type="button"
                      onClick={handleShare}
                      className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-surface)] text-[var(--color-text-muted)] shadow-sm sm:h-11 sm:w-11"
                      aria-label="Share recipe"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="pb-6 text-white sm:pb-8">
                <div className="mb-3 flex flex-wrap gap-2 sm:mb-4">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                  {cuisineType}
                </span>

                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                  {dietaryTag || "No dietary tag"}
                </span>
                </div>

                <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                  {title}
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 sm:text-lg">
                  Discover the full recipe details, preparation flow, and serving
                  info for this dish.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <StatBox
                      icon={
                        <Clock3 className="h-5 w-5 text-[var(--color-primary)]" />
                      }
                      value={`${cookingTimeMinutes}`}
                      label="minutes"
                  />

                  <StatBox
                      icon={
                        <Star className="h-5 w-5 text-[var(--color-accent)]" />
                      }
                      value={
                        averageRating !== null
                            ? Number(averageRating).toFixed(1)
                            : "--"
                      }
                      label="rating"
                  />

                  <StatBox
                      icon={
                        <Users className="h-5 w-5 text-[var(--color-primary)]" />
                      }
                      value={`${servings}`}
                      label="servings"
                  />
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">
                    Ingredients
                  </h2>

                  <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Shopping List
                  </button>
                </div>

                <ul className="space-y-3 text-[var(--color-text)]">
                  {ingredients.length > 0 ? (
                      ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
                            <span>{ingredient}</span>
                          </li>
                      ))
                  ) : (
                      <li className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
                        <span>No ingredients added.</span>
                      </li>
                  )}
                </ul>
              </div>

              <div className="mt-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6">
                <h2 className="text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">
                  Instructions
                </h2>

                <div className="mt-6 space-y-4">
                  {steps.length > 0 ? (
                      steps.map((step, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
                              {index + 1}
                            </div>

                            <p className="pt-1 text-sm leading-7 text-[var(--color-text)] sm:text-base">
                              {step}
                            </p>
                          </div>
                      ))
                  ) : (
                      <div className="flex gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
                          1
                        </div>

                        <p className="pt-1 text-sm leading-7 text-[var(--color-text)] sm:text-base">
                          No preparation steps added.
                        </p>
                      </div>
                  )}
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6">
                <h2 className="text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">
                  Reviews & Comments
                </h2>

                <form
                    onSubmit={handleSubmitReview}
                    className="mt-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-5"
                >
                  <h3 className="text-lg font-bold text-[var(--color-text)] sm:text-xl">
                    Leave a review
                  </h3>

                  <div className="mt-4 flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="text-2xl text-yellow-400"
                        >
                          {star <= rating ? "★" : "☆"}
                        </button>
                    ))}
                  </div>

                  <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this recipe..."
                      className="mt-4 h-28 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none"
                  />

                  <button
                      type="submit"
                      className="mt-4 w-full rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white sm:w-auto"
                  >
                    Submit Review
                  </button>
                </form>

                <div className="mt-8 space-y-4">
                  {comments.length > 0 ? (
                      comments.map((item) => (
                          <div
                              key={item.id}
                              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold text-[var(--color-text)]">
                                {item.authorUsername || "Guest"}
                              </p>

                              <p className="text-sm text-yellow-500">
                                {"★".repeat(Number(item.rating || 0))}
                              </p>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                              {item.text}
                            </p>
                          </div>
                      ))
                  ) : (
                      <p className="text-center text-[var(--color-text-muted)]">
                        No reviews yet. Be the first to review this recipe!
                      </p>
                  )}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6">
                <h3 className="text-2xl font-bold text-[var(--color-text)]">
                  Recipe by
                </h3>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-border)] text-xl font-bold">
                    {authorUsername.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-lg font-bold text-[var(--color-text)]">
                      {authorUsername}
                    </p>

                    <p className="text-sm text-[var(--color-text-muted)]">
                      View profile →
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6">
                <h3 className="text-2xl font-bold text-[var(--color-text)]">
                  Details
                </h3>

                <div className="mt-5 space-y-4 text-[var(--color-text)]">
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Cuisine
                    </p>
                    <p className="font-semibold">{cuisineType}</p>
                  </div>

                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Cook Time
                    </p>
                    <p className="font-semibold">{cookingTimeMinutes} min</p>
                  </div>

                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Servings
                    </p>
                    <p className="font-semibold">{servings}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6">
                <h3 className="text-2xl font-bold text-[var(--color-text)]">
                  Dietary Tags
                </h3>

                <div className="mt-5 flex flex-wrap gap-2">
                  {dietaryTag.split(",").map((tag) => (
                    <span
                      key={[tag]}
                      className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-sm font-semibold text-[var(--color-primary)]"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
  );
}

function StatBox({ icon, value, label }) {
  return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-center">
        <div className="mb-2 flex justify-center">{icon}</div>

        <p className="text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">
          {value}
        </p>

        <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
      </div>
  );
}