const API_BASE_URL = "http://localhost:8080/api";

export async function getShoppingList(username, token) {
    const response = await fetch(
        `${API_BASE_URL}/users/${username}/shopping-lists`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) throw new Error("Failed to fetch shopping list");

    return response.json();
}