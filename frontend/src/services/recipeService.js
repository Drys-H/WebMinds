const API_BASE_URL = "http://localhost:8080/api";

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

export async function getCommentsForRecipe(recipeId) {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/comments`);

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
}

export async function addComment(recipeId, commentData) {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  });

  if (!response.ok) {
    throw new Error("Failed to add comment");
  }

  return response.json();
}

export async function addRecipeRating(recipeId, username, score) {
  const response = await fetch(
      `${API_BASE_URL}/recipes/${recipeId}/ratings?username=${encodeURIComponent(
          username
      )}&score=${score}`,
      {
        method: "POST",
      }
  );

  if (!response.ok) {
    throw new Error("Failed to add rating");
  }

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

function getAuthHeaders() {
  const user = JSON.parse(localStorage.getItem("user"));

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  };
}

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

export async function createRecipe(recipeData) {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeData),
  });

  if (!response.ok) {
    throw new Error("Failed to create recipe");
  }

  return response.json();
}