const BASE_URL = "http://localhost:8080/api";

/* ================= RECIPES ================= */

export const getAllRecipes = async () => {
  const res = await fetch(`${BASE_URL}/recipes`);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
};

export const createRecipe = async (recipe) => {
  const res = await fetch(`${BASE_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(recipe)
  });

  if (!res.ok) throw new Error("Failed to create recipe");
  return res.json();
};

/* ================= AUTH ================= */

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Register failed");
  return res.text();
};
