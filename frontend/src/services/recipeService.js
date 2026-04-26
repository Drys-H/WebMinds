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