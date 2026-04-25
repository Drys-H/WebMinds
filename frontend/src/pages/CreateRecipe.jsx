import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* CATEGORY DATA */
const dietary = [
  "Vegan","Vegetarian","Gluten-Free","Dairy-Free","High Protein","Quick Meals","Keto","Low Carb","Paleo",
];

const cuisines = [
  "Mediterranean","Asian","American","Mexican","Italian","Indian","Thai","Japanese","French",
];

const mealTypes = [
  "Breakfast","Lunch","Dinner","Snacks","Desserts","Appetizers",
];

export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const perPage = 6;

  const [filters, setFilters] = useState({
    diet: [],
    cuisine: [],
    mealType: [],
  });

  // 🌙 DARK MODE STATE
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const navigate = useNavigate();
  const location = useLocation();

  // SAVE DARK MODE
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  /* LOAD DATA */
  useEffect(() => {
    fetch("http://localhost:8080/api/recipes")
      .then(res => res.json())
      .then(data => {
        setRecipes(data);
        setFilteredRecipes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* FILTER LOGIC */
  useEffect(() => {
    let result = [...recipes];

    if (search) {
      result = result.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.diet.length > 0) {
      result = result.filter(r =>
        r.diet && filters.diet.some(d => r.diet.includes(d))
      );
    }

    if (filters.cuisine.length > 0) {
      result = result.filter(r =>
        filters.cuisine.includes(r.cuisineType)
      );
    }

    if (filters.mealType.length > 0) {
      result = result.filter(r =>
        filters.mealType.includes(r.mealType)
      );
    }

    if (sort === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    setFilteredRecipes(result);
    setPage(1);
  }, [search, filters, sort, recipes]);

  const toggleFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };

  const clearFilters = () => {
    setFilters({ diet: [], cuisine: [], mealType: [] });
  };

  /* PAGINATION */
  const start = (page - 1) * perPage;
  const paginated = filteredRecipes.slice(start, start + perPage);

  // 🎨 THEME COLORS
  const theme = darkMode
    ? {
        bg: "#1e1e1e",
        card: "#2a2a2a",
        text: "#fff",
        subText: "#bbb",
        border: "#444",
      }
    : {
        bg: "#f7f7f7",
        card: "#fff",
        text: "#000",
        subText: "#666",
        border: "#eee",
      };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.text }}>

      {/* NAVBAR */}
      <div style={{ ...navbar, background: theme.card }}>
        <h2>
          <span style={{ color: "#6f8f6b" }}>Fit</span>
          <span style={{ color: "#f4a261" }}>&</span>
          <span style={{ color: "#6f8f6b" }}>Fresh</span>
        </h2>

        <div style={navLinks}>
          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/")}>Recipes</span>
          <span onClick={() => navigate("/categories")}>Categories</span>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* 🌙 TOGGLE */}
          <button onClick={() => setDarkMode(!darkMode)} style={toggleBtn}>
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button style={createBtn} onClick={() => navigate("/create")}>
            + Create
          </button>

          <button style={signInBtn} onClick={() => navigate("/signin")}>
            Sign In
          </button>

          <button style={getStartedBtn} onClick={() => navigate("/signup")}>
            Get Started
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div style={topBar}>
        <input
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...searchBar, background: theme.card, color: theme.text }}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="az">A–Z</option>
        </select>
      </div>

      <div style={main}>

        {/* SIDEBAR */}
        <div style={{ ...sidebar, background: theme.card }}>
          <h3>Diet</h3>
          {dietary.map(d => (
            <label key={d}>
              <input type="checkbox" onChange={() => toggleFilter("diet", d)} />
              {d}
            </label>
          ))}

          <h3>Cuisine</h3>
          {cuisines.map(c => (
            <label key={c}>
              <input type="checkbox" onChange={() => toggleFilter("cuisine", c)} />
              {c}
            </label>
          ))}

          <button onClick={clearFilters} style={clearBtn}>
            Clear Filters
          </button>
        </div>

        {/* RECIPES */}
        <div style={grid}>

          {loading && <p>Loading...</p>}

          {!loading && paginated.map(recipe => (
            <div key={recipe.id} style={{ ...card, background: theme.card }}>
              <img
                src={recipe.image || "https://via.placeholder.com/400"}
                style={image}
                alt=""
              />

              <div style={{ padding: "15px" }}>
                <h3>{recipe.title}</h3>
                <p style={{ color: theme.subText }}>{recipe.description}</p>

                <div>
                  {recipe.diet?.map(tag => (
                    <span key={tag} style={tagStyle}>{tag}</span>
                  ))}
                </div>

                <button style={viewBtn}>View</button>
              </div>
            </div>
          ))}

          {/* PAGINATION */}
          <div style={pagination}>
            <button onClick={() => setPage(p => Math.max(p - 1, 1))}>Prev</button>
            <span>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)}>Next</button>
          </div>

        </div>

      </div>
    </div>
  );
}

/* STYLES */

const navbar = {
  display: "flex",
  justifyContent: "space-between",
  padding: "20px 60px",
  borderBottom: "1px solid #ddd"
};

const navLinks = {
  display: "flex",
  gap: "20px",
  cursor: "pointer"
};

const toggleBtn = {
  border: "none",
  background: "#ddd",
  borderRadius: "50%",
  padding: "8px",
  cursor: "pointer"
};

const createBtn = {
  background: "#f4a261",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "20px"
};

const signInBtn = {
  border: "1px solid #6f8f6b",
  padding: "8px 14px",
  borderRadius: "20px"
};

const getStartedBtn = {
  background: "#6f8f6b",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "20px"
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  padding: "20px 60px"
};

const searchBar = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ddd"
};

const main = {
  display: "flex",
  gap: "30px",
  padding: "20px 60px"
};

const sidebar = {
  width: "250px",
  padding: "20px",
  borderRadius: "12px"
};

const clearBtn = {
  marginTop: "10px",
  padding: "8px",
  border: "none"
};

const grid = {
  flex: 1,
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "20px"
};

const card = {
  borderRadius: "12px",
  overflow: "hidden"
};

const image = {
  width: "100%",
  height: "200px",
  objectFit: "cover"
};

const tagStyle = {
  background: "#e6f4ea",
  padding: "5px 10px",
  borderRadius: "20px",
  marginRight: "5px"
};

const viewBtn = {
  marginTop: "10px",
  background: "#6f8f6b",
  color: "white",
  border: "none",
  padding: "8px",
  borderRadius: "8px"
};

const pagination = {
  gridColumn: "span 2",
  display: "flex",
  justifyContent: "center",
  gap: "20px"
};
