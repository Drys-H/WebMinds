import { Link } from "react-router-dom";
import {
  Search,
  Sparkles,
  Star,
  ArrowRight,
  Flame,
  Heart,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAllRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";

const chipFilters = ["All", "Keto", "Vegan", "High Protein"];

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChip, setActiveChip] = useState("All");

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getAllRecipes();
        setRecipes(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  const filteredRecipes = useMemo(() => {
    let result = [...recipes];

    if (activeChip !== "All") {
      result = result.filter(
          (recipe) => recipe?.dietaryTag?.toLowerCase() === activeChip.toLowerCase()
      );
    }

    if (!searchTerm.trim()) return result;

    const term = searchTerm.toLowerCase();

    return result.filter((recipe) =>
        [
          recipe?.title,
          recipe?.cuisineType,
          recipe?.dietaryTag,
          recipe?.authorUsername,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(term)
    );
  }, [recipes, searchTerm, activeChip]);

  const featuredRecipe = filteredRecipes[0] || null;
  const trendingRecipes = filteredRecipes.slice(0, 4);
  const freshRecipes = filteredRecipes.slice(4, 8);
  const seasonalRecipes = filteredRecipes.slice(8, 10);

  return (
      <div className="bg-[var(--color-background)] text-[var(--color-text)]">
        {error && (
            <div className="border-b border-amber-200 bg-amber-50">
              <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-amber-700 sm:px-6 lg:px-8">
                {error}
              </div>
            </div>
        )}

        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
              <div className="mb-5 flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] sm:mb-6">
                <Sparkles className="h-4 w-4" />
                Healthy & Delicious Recipes
              </div>

              <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl">
                Cook Fresh,
                <br />
                Live{" "}
                <span className="italic text-[var(--color-primary)]">
                Healthy
              </span>
                ,
                <br />
                Feel Great
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-[var(--color-text-muted)] sm:mt-6 sm:text-lg sm:leading-8">
                Discover thousands of nutritious recipes, filter by dietary needs,
                and share your own creation with a community that loves good food.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link
                    to="/recipes"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Explore Recipes
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                    to="/community"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-primary)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white"
                >
                  <Sparkles className="h-4 w-4" />
                  Join Community
                </Link>
              </div>

              <div className="mt-8 grid max-w-md grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-6">
                <StatBox title="12,000+" text="Healthy Recipes" />
                <StatBox title="8,000+" text="Food Lovers" />
                <StatBox title="4.9★" text="Avg Rating" />
              </div>
            </div>

            <div>
              <div className="overflow-hidden rounded-[2rem] bg-[var(--color-surface)] shadow-xl ring-1 ring-[var(--color-border)]">
                {featuredRecipe ? (
                    <>
                      <img
                          src={
                              featuredRecipe.imageUrl ||
                              "https://via.placeholder.com/900x600?text=Recipe"
                          }
                          alt={featuredRecipe.title || "Featured recipe"}
                          className="h-64 w-full object-cover sm:h-[340px]"
                          onError={(e) => {
                            e.currentTarget.src =
                                "https://via.placeholder.com/900x600?text=Recipe";
                          }}
                      />

                      <div className="p-5 sm:p-6">
                        <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                        🔥 Featured
                      </span>

                          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{featuredRecipe.cookingTimeMinutes ?? 0} min</span>
                          </div>
                        </div>

                        <h2 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">
                          {featuredRecipe.title}
                        </h2>

                        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                          {featuredRecipe.cuisineType || "Cuisine"} •{" "}
                          {featuredRecipe.dietaryTag || "Tag"}
                        </p>

                        <Link
                            to={`/recipes/${featuredRecipe.id}`}
                            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                          View Recipe
                        </Link>
                      </div>
                    </>
                ) : (
                    <>
                      <div className="h-64 w-full bg-[var(--color-border)] sm:h-[340px]" />
                      <div className="p-5 sm:p-6">
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                      🔥 Featured
                    </span>

                        <h2 className="mt-3 text-xl font-bold text-[var(--color-text)] sm:text-2xl">
                          Featured recipe coming soon
                        </h2>

                        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                          Recipe will be shown here once available.
                        </p>

                        <Link
                            to="/recipes"
                            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                          Explore Recipes
                        </Link>
                      </div>
                    </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                    type="text"
                    placeholder="Search recipes, categories, or authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] py-4 pl-12 pr-5 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2 sm:gap-3">
                {chipFilters.map((chip) => (
                    <button
                        key={chip}
                        type="button"
                        onClick={() => setActiveChip(chip)}
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                            activeChip === chip
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                        }`}
                    >
                      {chip}
                    </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <RecipeSection
            title="Trending Now"
            subtitle="Most popular recipes this week"
            recipes={trendingRecipes}
            loading={loading}
        />

        <RecipeSection
            title="Fresh & New"
            subtitle="Latest recipes from our community"
            recipes={freshRecipes}
            loading={loading}
        />

        <RecipeSection
            title="Seasonal Favorites"
            subtitle="Perfect for this time of year"
            recipes={seasonalRecipes}
            loading={loading}
        />

        <section className="mt-10 bg-[var(--color-cta-bg)] text-white sm:mt-12">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:px-8">
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm text-white/80">
                <Heart className="h-4 w-4" />
                Join Our Community
              </div>

              <h2 className="max-w-md text-3xl font-extrabold leading-tight sm:text-4xl">
                Share Your Culinary Creations
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
                Connect with thousands of food lovers, share your recipes, and
                discover new favorites from our talented community of home cooks.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--color-primary)]">
                  Create Free Account
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoBox
                  title="12,000+"
                  text="Healthy recipes with dietary filters"
                  icon="🍽️"
              />
              <InfoBox
                  title="Smart shopping"
                  text="lists synced with recipes"
                  icon="🛒"
              />
              <InfoBox
                  title="Share recipes"
                  text="and build following"
                  icon="🧑‍🍳"
              />
              <InfoBox
                  title="Save favorites"
                  text="build your recipe collection"
                  icon="❤️"
              />
            </div>
          </div>
        </section>
      </div>
  );
}

function RecipeSection({ title, subtitle, recipes, loading }) {
  return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">
              <Flame className="h-5 w-5 text-[var(--color-accent)]" />
              {title}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {subtitle}
            </p>
          </div>

          <Link
              to="/recipes"
              className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
              <div className="col-span-full rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center text-[var(--color-text-muted)]">
                Loading recipes...
              </div>
          ) : recipes.length > 0 ? (
              recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
          ) : (
              <div className="col-span-full rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center text-[var(--color-text-muted)]">
                Recipes will appear here when the backend data is available.
              </div>
          )}
        </div>
      </section>
  );
}

function InfoBox({ title, text, icon }) {
  return (
      <div className="rounded-3xl bg-[var(--color-cta-card)] p-5 backdrop-blur sm:p-6">
        <div className="text-2xl">{icon}</div>
        <h3 className="mt-3 text-xl font-bold sm:text-2xl">{title}</h3>
        <p className="mt-2 text-sm text-white/80">{text}</p>
      </div>
  );
}

function StatBox({ title, text }) {
  return (
      <div>
        <p className="text-2xl font-extrabold text-[var(--color-primary)] sm:text-3xl">
          {title}
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">{text}</p>
      </div>
  );
}