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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />

        {/* AUTH */}
        <Route path="signin" element={<SignIn />} />
        <Route path="register" element={<SignUp />} />

        {/* RECIPES */}
        <Route path="recipes" element={<AllRecipes />} />
        <Route path="recipes/:id" element={<RecipeDetails />} />

        {/* CREATE */}
        <Route path="create" element={<CreateRecipe />} />

        <Route path="edit/:id" element={<CreateRecipe />} />

        {/* OTHER */}
        <Route path="categories" element={<Categories />} />
        <Route path="community" element={<Community />} />

        {/* PROFILE */}
        <Route path="profile" element={<Profile />} />

        {/* FALLBACK */}
        <Route path="*" element={<Home />} />

      </Route>
    </Routes>
  );
}