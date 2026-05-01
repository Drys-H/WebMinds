const API_BASE_URL = "http://localhost:8080/api";

/* ================= RECIPES ================= */

export async function getAllRecipes() {
  const response = await fetch(`${API_BASE_URL}/recipes`);

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return response.json();
}

export async function getRecipeById(id) {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch recipe");
  }

  return response.json();
}

export async function searchRecipes(keyword) {
  const response = await fetch(
      `${API_BASE_URL}/recipes/search?keyword=${encodeURIComponent(keyword)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search recipes");
  }

  return response.json();
}

/* ================= COMMENTS ================= */

export async function getCommentsForRecipe(recipeId) {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/comments`);

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
}

export async function addComment(recipeId, commentData) {
  const user = JSON.parse(localStorage.getItem("user"));

  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    },
    body: JSON.stringify(commentData),
  });

  if (!response.ok) throw new Error("Failed to add comment");
  return response.json();
}

/* ================= RATINGS ================= */

export async function addRecipeRating(recipeId, username, score) {
  const user = JSON.parse(localStorage.getItem("user"));

  const response = await fetch(
      `${API_BASE_URL}/recipes/${recipeId}/ratings?username=${encodeURIComponent(
          username
      )}&score=${score}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
  );

  if (!response.ok) throw new Error("Failed to add rating");
  return response.text();
}

export async function getAverageRecipeRating(recipeId) {
  const response = await fetch(
      `${API_BASE_URL}/recipes/${recipeId}/ratings/average`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch average rating");
  }

  return response.json();
}

/* ================= AUTH HELPERS ================= */

function getAuthHeaders() {
  const user = JSON.parse(localStorage.getItem("user"));

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  };
}

function handleAuthError(response) {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("user");
    alert("Session expired. Please sign in again.");
    window.location.href = "/signin";
    return true;
  }

  return false;
}

/* ================= SAVED RECIPES ================= */

export async function saveRecipe(username, recipeId) {
  const response = await fetch(
      `${API_BASE_URL}/users/${username}/saved-recipes/${recipeId}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
  );

  if (!response.ok) {
    throw new Error("Failed to save recipe");
  }

  return response.text();
}

export async function getSavedRecipes(username) {
  const response = await fetch(
      `${API_BASE_URL}/users/${username}/saved-recipes`,
      {
        headers: getAuthHeaders(),
      }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch saved recipes");
  }

  return response.json();
}

export async function removeSavedRecipe(username, recipeId) {
  const response = await fetch(
      `${API_BASE_URL}/users/${username}/saved-recipes/${recipeId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
  );

  if (!response.ok) {
    throw new Error("Failed to remove saved recipe");
  }

  return response.text();
}

/* ================= SHOPPING LIST (NEW ✅) ================= */

// ➕ ADD RECIPE INGREDIENTS TO SHOPPING LIST
export async function addRecipeToShoppingList(username, recipeId) {
  const user = JSON.parse(localStorage.getItem("user"));

  const response = await fetch(
      `${API_BASE_URL}/users/${username}/shopping-lists/recipe/${recipeId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
  );

  if (handleAuthError(response)) return;

  if (!response.ok) {
    const text = await response.text();
    console.error("Shopping list error:", text);
    throw new Error("Failed to add recipe to shopping list");
  }

  return response.text();
}

// ➕ GET SHOPPING LIST
export async function getShoppingLists(username) {
  const user = JSON.parse(localStorage.getItem("user"));

  const response = await fetch(
      `${API_BASE_URL}/users/${username}/shopping-lists`,
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
  );

  if (handleAuthError(response)) return [];

  if (!response.ok) {
    throw new Error("Failed to fetch shopping list");
  }

  return response.json();
}

/* ================= CREATE / UPDATE ================= */

export async function createRecipe(recipeData) {
  const user = JSON.parse(localStorage.getItem("user"));

  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    },
    body: JSON.stringify(recipeData),
  });

  if (handleAuthError(response)) return;

  if (!response.ok) {
    throw new Error("Failed to create recipe");
  }

  return response.json();
}

export async function updateRecipe(id, recipeData) {
  const user = JSON.parse(localStorage.getItem("user"));

  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify(recipeData),
  });

  if (!response.ok) {
    console.error("Backend error:", text);
    throw new Error("Failed to update recipe");
  }

  return await response.text();
}