import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createRecipe, getRecipeById, updateRecipe } from "../services/recipeService";

const dietaryOptions = [
  "Vegan",
  "Vegetarian",
  "Gluten-Free",
  "Dairy-Free",
  "High Protein",
  "Quick Meals",
  "Keto",
  "Low Carb",
  "Paleo",
];

export default function CreateRecipe() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ FIXED
  const isEditMode = !!id;    // ✅ FIXED

  const [form, setForm] = useState({
    title: "",
    description: "",
    cookingTimeMinutes: "",
    servings: "",
    ingredients: [""],
    instructions: [""],
    imageUrl: "",
    cuisineType: "",
    dietaryTags: [],
  });

  // 🔐 auth check (unchanged)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      navigate("/signin");
    }
  }, [navigate]);

  // ✅ LOAD RECIPE FOR EDIT (fixed id usage)
  useEffect(() => {
    if (!id) return;

    async function loadRecipe() {
      try {
        const data = await getRecipeById(id);

        setForm({
          title: data.title || "",
          description: data.description || "",
          cookingTimeMinutes: data.cookingTimeMinutes || "",
          servings: data.servings || "",
          imageUrl: data.imageUrl || "",
          cuisineType: data.cuisineType || "",

          ingredients:
              Array.isArray(data.ingredients) && data.ingredients.length > 0
                  ? data.ingredients
                  : [""],

          instructions: data.preparationSteps
              ? data.preparationSteps.split("\n")
              : [""],

          dietaryTags: data.dietaryTag
              ? data.dietaryTag.split(", ").filter(Boolean)
              : [],
        });
      } catch (err) {
        console.error("Failed to load recipe:", err);
      }
    }

    loadRecipe();
  }, [id]); // ✅ FIXED

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleListChange(type, index, value) {
    const updated = [...form[type]];
    updated[index] = value;
    setForm({ ...form, [type]: updated });
  }

  function addField(type) {
    setForm({ ...form, [type]: [...form[type], ""] });
  }

  function removeField(type, index) {
    const updated = form[type].filter((_, i) => i !== index);
    setForm({ ...form, [type]: updated.length ? updated : [""] });
  }

  function toggleDietaryTag(tag) {
    const selected = form.dietaryTags.includes(tag);

    setForm({
      ...form,
      dietaryTags: selected
          ? form.dietaryTags.filter((item) => item !== tag)
          : [...form.dietaryTags, tag],
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.token) {
      navigate("/signin");
      return;
    }

    const recipeData = {
      title: form.title,
      description: form.description,
      cookingTimeMinutes: Number(form.cookingTimeMinutes),
      servings: Number(form.servings),
      ingredients: form.ingredients.filter((i) => i.trim() !== ""),
      preparationSteps: form.instructions
          .filter((s) => s.trim() !== "")
          .join("\n"),
      cuisineType: form.cuisineType,
      dietaryTag: form.dietaryTags.join(", "),
      imageUrl: form.imageUrl,
      authorUsername: user.username,
    };

    try {
      if (isEditMode) {
        await updateRecipe(id, recipeData); // ✅ FIXED
        alert("Recipe updated successfully!");
      } else {
        await createRecipe(recipeData);
        alert("Recipe created successfully!");
      }

      navigate("/recipes");

    } catch (error) {
      console.error(error);
      alert("Could not save recipe.");
    }
  }

  return (
      <div className="bg-[var(--color-background)] text-[var(--color-text)] min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto bg-[var(--color-surface)] p-8 rounded-3xl shadow-sm border border-[var(--color-border)]">
          <h1 className="text-3xl font-bold mb-6">
            {isEditMode ? "Edit Recipe" : "Create Recipe"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
                type="text"
                name="title"
                placeholder="Recipe title"
                value={form.title}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border"
                required
            />

            <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border"
                rows={4}
                required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                  type="number"
                  name="cookingTimeMinutes"
                  placeholder="Cooking time (min)"
                  value={form.cookingTimeMinutes}
                  onChange={handleChange}
                  className="p-3 rounded-xl border"
                  required
              />

              <input
                  type="number"
                  name="servings"
                  placeholder="Servings"
                  value={form.servings}
                  onChange={handleChange}
                  className="p-3 rounded-xl border"
                  required
              />
            </div>

            {/* INGREDIENTS */}
            <section>
              <div className="flex justify-between mb-3">
                <h2 className="font-bold">Ingredients</h2>
                <button type="button" onClick={() => addField("ingredients")}>
                  + Add Ingredient
                </button>
              </div>

              {form.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                        value={ingredient}
                        onChange={(e) =>
                            handleListChange("ingredients", index, e.target.value)
                        }
                        className="w-full p-3 border rounded-xl"
                    />
                    <button type="button" onClick={() => removeField("ingredients", index)}>×</button>
                  </div>
              ))}
            </section>

            {/* INSTRUCTIONS */}
            <section>
              <div className="flex justify-between mb-3">
                <h2 className="font-bold">Instructions</h2>
                <button type="button" onClick={() => addField("instructions")}>
                  + Add Step
                </button>
              </div>

              {form.instructions.map((step, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                  <textarea
                      value={step}
                      onChange={(e) =>
                          handleListChange("instructions", index, e.target.value)
                      }
                      className="w-full p-3 border rounded-xl"
                  />
                    <button type="button" onClick={() => removeField("instructions", index)}>×</button>
                  </div>
              ))}
            </section>

            {/* IMAGE */}
            <input
                type="url"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border"
            />

            <button className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl">
              {isEditMode ? "Update Recipe" : "Create Recipe"}
            </button>

          </form>
        </div>
      </div>
  );
}


