import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";

import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import AllRecipes from "../pages/AllRecipes";
import RecipeDetails from "../pages/RecipeDetails";
import Categories from "../pages/Categories";
import Community from "../pages/Community";
import Profile from "../pages/Profile";
import CreateRecipe from "../pages/CreateRecipe";
import ShoppingList from "../pages/ShoppingList";

export default function AppRoutes() {
  return (
      <Routes>

        <Route path="/" element={<Layout />}>

          <Route index element={<Home />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />

          <Route path="recipes" element={<AllRecipes />} />
          <Route path="recipes/:recipeId" element={<RecipeDetails />} />

          <Route path="categories" element={<Categories />} />
          <Route path="community" element={<Community />} />

          <Route path="profile" element={<Profile />} />
          <Route path="profile/shopping-list" element={<ShoppingList />} />

          <Route path="create" element={<CreateRecipe />} />

          {/* fallback */}
          <Route path="*" element={<Home />} />

        </Route>

      </Routes>
  );
}
