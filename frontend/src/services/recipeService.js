import { loginUser } from "./api";

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