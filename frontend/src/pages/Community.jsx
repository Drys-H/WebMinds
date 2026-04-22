import { Link } from "react-router-dom";
import { ChefHat, Star, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAllRecipes } from "../services/recipeService";

const communityTabs = ["All Creators", "Top Rated", "Most Recipes"];

export default function Community() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All Creators");

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getAllRecipes();
        setRecipes(Array.isArray(data) ? data : []);
        setError("");
      } catch (error) {
        setRecipes([]);
        setError("No community available yet.");
      }
    }

    loadRecipes();
  }, []);

  const creatorCards = useMemo(() => {
    const grouped = recipes.reduce((acc, recipe) => {
      const author = recipe?.authorUsername || "Unknown";
      if (!acc[author]) {
        acc[author] = {
          name: author,
          username: `@${author.toLowerCase().replace(/\s+/g, "")}`,
          recipes: 0,
          tags: new Set(),
        };
      }

      acc[author].recipes += 1;

      if (recipe?.dietaryTag) acc[author].tags.add(recipe.dietaryTag);
      if (recipe?.cuisineType) acc[author].tags.add(recipe.cuisineType);

      return acc;
    }, {});

    let creators = Object.values(grouped).map((creator) => ({
      ...creator,
      tags: Array.from(creator.tags).slice(0, 3),
    }));

    if (activeTab === "Most Recipes") {
      creators = creators.sort((a, b) => b.recipes - a.recipes);
    }

    return creators.slice(0, 3);
  }, [recipes, activeTab]);

  const topRecipes = useMemo(() => {
    const list = [...recipes];

    if (activeTab === "Top Rated") {
      return list;
    }

    return list.slice(0, 6);
  }, [recipes, activeTab]);

  return (
      <div className="bg-[var(--color-background)] text-[var(--color-text)]">
        <section className="bg-[var(--color-hero-bg)]">
          <div className="mx-auto max-w-7xl px-4 py-14">
            <div className="flex items-center gap-3 text-[var(--color-hero-text)]">
              <ChefHat className="h-8 w-8" />
              <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
                Community
              </h1>
            </div>

            <p className="mt-5 max-w-3xl text-xl text-[var(--color-hero-subtext)]">
              Meet our talented recipe creators and discover their amazing culinary creations
            </p>
          </div>
        </section>

        {error && (
            <div className="border-b border-amber-200 bg-amber-50">
              <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-amber-700">
                {error}
              </div>
            </div>
        )}

        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8 flex flex-wrap gap-3">
            {communityTabs.map((tab) => (
                <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                        activeTab === tab
                            ? "bg-[var(--color-primary)] text-white"
                            : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-background)]"
                    }`}
                >
                  {tab}
                </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {creatorCards.length > 0 ? (
                creatorCards.map((creator, index) => (
                    <CreatorCard key={creator.name} creator={creator} index={index} />
                ))
            ) : (
                <>
                  <CreatorPlaceholder />
                  <CreatorPlaceholder />
                  <CreatorPlaceholder />
                </>
            )}
          </div>

          <section className="mt-12 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
            <div className="mb-8 flex items-center gap-3">
              <Trophy className="h-6 w-6 text-[var(--color-accent)]" />
              <h2 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)]">
                Top Community Recipes
              </h2>
            </div>

            {topRecipes.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {topRecipes.slice(0, 6).map((recipe) => (
                      <CommunityRecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
            ) : (
                <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-10 text-center text-[var(--color-text-muted)]">
                  Community recipes will appear here once available.
                </div>
            )}
          </section>
        </section>
      </div>
  );
}

function CreatorCard({ creator, index }) {
  const avatarColors = [
    "bg-rose-100 text-rose-600",
    "bg-sky-100 text-sky-600",
    "bg-amber-100 text-amber-600",
  ];

  const colorClass = avatarColors[index % avatarColors.length];

  return (
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div
              className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold ${colorClass}`}
          >
            {creator.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <h3 className="text-3xl font-extrabold leading-tight text-[var(--color-text)]">
              {creator.name}
            </h3>
            <p className="mt-1 text-[var(--color-text-muted)]">{creator.username}</p>

            <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.8 avg rating</span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-lg leading-8 text-[var(--color-text-muted)]">
          Passionate about sharing recipes and inspiring healthier cooking choices.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {creator.tags.length > 0 ? (
              creator.tags.map((tag) => (
                  <span
                      key={tag}
                      className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-sm font-medium text-[var(--color-primary)]"
                  >
              {tag}
            </span>
              ))
          ) : (
              <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-sm font-medium text-[var(--color-primary)]">
            Recipe Creator
          </span>
          )}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-extrabold text-[var(--color-text)]">{creator.recipes}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Recipes</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[var(--color-text)]">--</p>
            <p className="text-sm text-[var(--color-text-muted)]">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[var(--color-text)]">--</p>
            <p className="text-sm text-[var(--color-text-muted)]">Following</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="flex-1 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-text)]">
            View Profile
          </button>
          <button className="rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">
            Follow
          </button>
        </div>
      </div>
  );
}

function CreatorPlaceholder() {
  return (
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-[var(--color-border)]" />
          <div className="flex-1">
            <div className="h-7 w-40 rounded bg-[var(--color-border)]" />
            <div className="mt-3 h-4 w-28 rounded bg-[var(--color-background)]" />
          </div>
        </div>

        <div className="mt-6 h-5 w-full rounded bg-[var(--color-background)]" />
        <div className="mt-3 h-5 w-5/6 rounded bg-[var(--color-background)]" />

        <div className="mt-6 flex gap-2">
          <div className="h-8 w-24 rounded-full bg-[var(--color-background)]" />
          <div className="h-8 w-24 rounded-full bg-[var(--color-background)]" />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="h-14 rounded bg-[var(--color-background)]" />
          <div className="h-14 rounded bg-[var(--color-background)]" />
          <div className="h-14 rounded bg-[var(--color-background)]" />
        </div>

        <div className="mt-6 flex gap-3">
          <div className="h-11 flex-1 rounded-xl bg-[var(--color-background)]" />
          <div className="h-11 w-24 rounded-xl bg-[var(--color-background)]" />
        </div>
      </div>
  );
}

function CommunityRecipeCard({ recipe }) {
  const recipeId = recipe?.id;
  const title = recipe?.title || "Recipe title";
  const imageUrl =
      recipe?.imageUrl || "https://via.placeholder.com/900x600?text=Recipe";
  const authorUsername = recipe?.authorUsername || "Unknown";

  return (
      <Link to={recipeId ? `/recipes/${recipeId}` : "#"} className="group block">
        <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
          <div className="relative">
            <img
                src={imageUrl}
                alt={title}
                className="h-56 w-full object-cover transition group-hover:scale-[1.02]"
                onError={(e) => {
                  e.currentTarget.src =
                      "https://via.placeholder.com/900x600?text=Recipe";
                }}
            />

            <div className="absolute right-3 top-3 rounded-full bg-[var(--color-surface)] px-3 py-1 text-sm font-semibold text-[var(--color-text)] shadow-sm">
              ★ 4.9
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-2xl font-bold leading-tight text-[var(--color-text)]">
              {title}
            </h3>
            <p className="mt-2 text-[var(--color-text-muted)]">by {authorUsername}</p>
          </div>
        </div>
      </Link>
  );
}