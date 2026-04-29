import { useState } from "react";

export default function CreateRecipe() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    cookingTimeMinutes: "",
    servings: "",
    image: null,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: URL.createObjectURL(file) });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
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

          {/* IMAGE UPLOAD */}
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