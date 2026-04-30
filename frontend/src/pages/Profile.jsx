import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getSavedRecipes,
  removeSavedRecipe,
  getAllRecipes,
  getShoppingLists
} from "../services/recipeService";

export default function Profile() {
  const navigate = useNavigate();

  const [myRecipes, setMyRecipes] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("recipes");
  const [savedRecipes, setSavedRecipes] = useState([]);

  // ✅ SHOPPING LIST FROM BACKEND
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      navigate("/signin");
      return;
    }

    setUser(savedUser);

    // LOAD MY RECIPES
    async function loadMyRecipes() {
      const recipes = await getAllRecipes();
      setMyRecipes(
          recipes.filter(
              (recipe) => recipe.authorUsername === savedUser.username
          )
      );
    }

    loadMyRecipes();

    // LOAD SAVED RECIPES
    async function loadSavedRecipes() {
      try {
        const data = await getSavedRecipes(savedUser.username);
        setSavedRecipes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load saved recipes:", error);
      }
    }

    loadSavedRecipes();

    // ✅ LOAD SHOPPING LIST FROM BACKEND
    async function loadShoppingList() {
      try {
        const data = await getShoppingLists(
            savedUser.username
        );

        // flatten ingredients
        const items = data.flatMap(
            (list) => list.ingredients || []
        );

        setShoppingList(items);
      } catch (err) {
        console.error("Failed to load shopping list:", err);
      }
    }

    loadShoppingList();
  }, [navigate]);

  // =========================
  // DELETE OWN RECIPE
  // =========================
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/recipes/${id}`, {
        method: "DELETE",
      });

      setMyRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("Failed to delete recipe");
    }
  };

  // REMOVE SAVED
  const handleRemoveSaved = async (recipeId) => {
    try {
      await removeSavedRecipe(user.username, recipeId);
      setSavedRecipes((prev) =>
          prev.filter((recipe) => recipe.id !== recipeId)
      );
    } catch (error) {
      alert("Could not remove saved recipe.");
    }
  };

  if (!user) {
    return (
        <div className="p-10 text-center text-[var(--color-text-muted)]">
          Loading profile...
        </div>
    );
  }

  return (
      <div className="bg-[var(--color-background)] text-[var(--color-text)] min-h-screen">

        {/* HEADER */}
        <div className="bg-[var(--color-primary)] text-white py-12">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">

            <div className="flex items-center gap-6">
              <img
                  src={user.profileImage || "https://i.pravatar.cc/150"}
                  alt="profile"
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />

              <div>
                <h1 className="text-3xl font-bold">
                  {user.firstName || ""} {user.lastName || ""}
                </h1>

                <p className="text-white/80">@{user.username}</p>

                <div className="flex gap-8 mt-4 text-sm">
                  <Stat label="Saved" value={savedRecipes.length} />
                  <Stat label="Shopping Items" value={shoppingList.length} />
                </div>
              </div>
            </div>

            <button
                onClick={() => navigate("/create")}
                className="bg-white text-[var(--color-primary)] px-5 py-2 rounded-xl font-semibold"
            >
              Create Recipe
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="max-w-6xl mx-auto px-4 py-10">

          {/* TABS */}
          <div className="flex gap-3 mb-8">
            <Tab active={activeTab === "recipes"} onClick={() => setActiveTab("recipes")}>
              My Recipes
            </Tab>

            <Tab active={activeTab === "saved"} onClick={() => setActiveTab("saved")}>
              Saved
            </Tab>

            <Tab active={activeTab === "shopping"} onClick={() => setActiveTab("shopping")}>
              Shopping List
            </Tab>
          </div>

          {/* ================= SHOPPING LIST ================= */}
          {activeTab === "shopping" && (
              shoppingList.length === 0 ? (
                  <EmptyState
                      title="Shopping list is empty"
                      text="Save recipes to auto-add ingredients."
                  />
              ) : (
                  <div className="bg-[var(--color-surface)] p-6 rounded-2xl border">
                    <h2 className="text-lg font-bold mb-4">
                      Shopping List ({shoppingList.length} items)
                    </h2>

                    <ul className="space-y-3">
                      {shoppingList.map((item, index) => (
                          <li
                              key={index}
                              className="flex items-center gap-3 border p-3 rounded-xl"
                          >
                            {typeof item === "string" ? item : item.name}
                          </li>
                      ))}
                    </ul>
                  </div>
              )
          )}

          {/* ================= MY RECIPES ================= */}
          {activeTab === "recipes" && (
              myRecipes.length === 0 ? (
                  <EmptyState
                      title="No recipes yet"
                      text="You haven’t created any recipes yet."
                      button="Create Your First Recipe"
                      onClick={() => navigate("/create")}
                  />
              ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {myRecipes.map((recipe) => (
                        <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                          <SavedRecipeCard
                              recipe={recipe}
                              isOwner={true}
                              onDelete={() => handleDelete(recipe.id)}
                          />
                        </Link>
                    ))}
                  </div>
              )
          )}

          {/* ================= SAVED ================= */}
          {activeTab === "saved" && (
              savedRecipes.length === 0 ? (
                  <EmptyState
                      title="No saved recipes"
                      text="Save recipes to see them here."
                  />
              ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {savedRecipes.map((recipe) => (
                        <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                          <SavedRecipeCard
                              recipe={recipe}
                              onRemove={() => handleRemoveSaved(recipe.id)}
                          />
                        </Link>
                    ))}
                  </div>
              )
          )}

        </div>
      </div>
  );
}

/* ===== CARD ===== */
function SavedRecipeCard({ recipe, onRemove, onDelete, isOwner }) {
  return (
      <div className="overflow-hidden rounded-3xl bg-[var(--color-surface)] shadow-sm border border-[var(--color-border)]">

        <img
            src={recipe.imageUrl || "https://via.placeholder.com/600x400"}
            alt={recipe.title}
            className="h-48 w-full object-cover"
        />

        <div className="p-4">
          <h3 className="text-xl font-bold">{recipe.title}</h3>

          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {recipe.cuisineType || "Cuisine"} • {recipe.dietaryTag || "Tag"}
          </p>

          <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-[var(--color-text-muted)]">
            {recipe.cookingTimeMinutes || 0} min
          </span>

            <div className="flex gap-3">

              {isOwner && (
                  <Link
                      to={`/edit/${recipe.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-500 text-sm font-semibold"
                  >
                    Edit
                  </Link>
              )}

              {isOwner && (
                  <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete();
                      }}
                      className="text-red-500 text-sm font-semibold"
                  >
                    Delete
                  </button>
              )}

              {onRemove && (
                  <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove();
                      }}
                      className="text-red-500 text-sm font-semibold"
                  >
                    Remove
                  </button>
              )}

            </div>
          </div>
        </div>
      </div>
  );
}

/* ===== SMALL COMPONENTS ===== */
function Stat({ label, value }) {
  return (
      <div>
        <p className="font-bold text-lg">{value}</p>
        <p className="text-xs opacity-80">{label}</p>
      </div>
  );
}

function Tab({ children, active, onClick }) {
  return (
      <button
          onClick={onClick}
          className={`px-5 py-2 rounded-full text-sm font-semibold ${
              active
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
          }`}
      >
        {children}
      </button>
  );
}

function EmptyState({ title, text, button, onClick }) {
  return (
      <div className="bg-[var(--color-surface)] rounded-3xl p-12 text-center border">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-[var(--color-text-muted)] mt-3">{text}</p>

        {button && (
            <button
                onClick={onClick}
                className="mt-6 bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-semibold"
            >
              {button}
            </button>
        )}
      </div>
  );
}