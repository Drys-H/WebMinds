import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRecipe() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    cookingTimeMinutes: "",
    servings: "",
    ingredients: [""],
    instructions: [""],
    imageUrl: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.token) {
      navigate("/signin");
    }
  }, [navigate]);

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

  function handleImage(e) {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: URL.createObjectURL(file) });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const recipeData = {
      ...form,
      cookingTimeMinutes: Number(form.cookingTimeMinutes),
      servings: Number(form.servings),
      ingredients: form.ingredients.filter(Boolean),
      instructions: form.instructions.filter(Boolean),
    };

    console.log(recipeData);
    alert("Recipe created (frontend only)");
  }

  return (
      <div className="bg-[var(--color-background)] text-[var(--color-text)] min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto bg-[var(--color-surface)] p-8 rounded-3xl shadow-sm border border-[var(--color-border)]">
          <h1 className="text-3xl font-bold mb-6">Create Recipe</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
                type="text"
                name="title"
                placeholder="Recipe title"
                value={form.title}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-[var(--color-border)]"
                required
            />

            <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-[var(--color-border)]"
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
                  className="p-3 rounded-xl border border-[var(--color-border)]"
              />

              <input
                  type="number"
                  name="servings"
                  placeholder="Servings"
                  value={form.servings}
                  onChange={handleChange}
                  className="p-3 rounded-xl border border-[var(--color-border)]"
              />
            </div>

            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-lg">Ingredients</h2>
                <button
                    type="button"
                    onClick={() => addField("ingredients")}
                    className="text-sm font-semibold text-[var(--color-primary)]"
                >
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
                        placeholder={`Ingredient ${index + 1}`}
                        className="w-full p-3 rounded-xl border border-[var(--color-border)]"
                        required
                    />

                    <button
                        type="button"
                        onClick={() => removeField("ingredients", index)}
                        className="px-3 rounded-xl border border-[var(--color-border)]"
                    >
                      ×
                    </button>
                  </div>
              ))}
            </section>

            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-lg">Instructions</h2>
                <button
                    type="button"
                    onClick={() => addField("instructions")}
                    className="text-sm font-semibold text-[var(--color-primary)]"
                >
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
                    placeholder={`Step ${index + 1}`}
                    className="w-full p-3 rounded-xl border border-[var(--color-border)]"
                    rows={2}
                    required
                />

                    <button
                        type="button"
                        onClick={() => removeField("instructions", index)}
                        className="px-3 rounded-xl border border-[var(--color-border)]"
                    >
                      ×
                    </button>
                  </div>
              ))}
            </section>

            <div>
              <label className="block mb-2 text-sm font-semibold">
                Upload Image
              </label>

              <input type="file" onChange={handleImage} />

              {form.image && (
                  <img
                      src={form.image}
                      alt="preview"
                      className="mt-4 w-full h-60 object-cover rounded-xl"
                  />
              )}
            </div>

            <button
                type="submit"
                className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-semibold"
            >
              Create Recipe
            </button>
          </form>
        </div>
      </div>
  );
}