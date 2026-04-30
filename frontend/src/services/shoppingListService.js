const BASE_URL = "http://localhost:8080/api/users";

// GET shopping lists
export async function getShoppingLists(username, token) {
    const res = await fetch(`${BASE_URL}/${username}/shopping-lists`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch shopping lists");

    return res.json();
}

// ✅ ADD THIS (this is what your error is about)
export async function addToShoppingList(username, recipeId, token) {
    const res = await fetch(
        `${BASE_URL}/${username}/shopping-lists/recipe/${recipeId}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) throw new Error("Failed to add to shopping list");

    return res.text();
}