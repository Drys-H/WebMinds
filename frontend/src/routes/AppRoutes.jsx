import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import AllRecipes from "../pages/AllRecipes";
import RecipeDetails from "../pages/RecipeDetails";
import Categories from "../pages/Categories";
import Community from "../pages/Community";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="recipes" element={<AllRecipes />} />
        <Route path="recipes/:id" element={<RecipeDetails />} />
        <Route path="categories" element={<Categories />} />
        <Route path="community" element={<Community />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}