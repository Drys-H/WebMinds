import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";

import Home from "../pages/Home";
import AllRecipes from "../pages/AllRecipes";
import RecipeDetails from "../pages/RecipeDetails";
import Categories from "../pages/Categories";
import Community from "../pages/Community";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Profile from "../pages/Profile";
import CreateRecipe from "../pages/CreateRecipe";

import { isLoggedIn } from "../utils/auth";

/* 🔒 PROTECTED ROUTE */
const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/signin" />;
};

export default function AppRoutes() {
  return (
    <Routes>

      {/* MAIN APP (WITH NAVBAR LAYOUT) */}
      <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />

        <Route path="recipes" element={<AllRecipes />} />
        <Route path="recipes/:id" element={<RecipeDetails />} />

        <Route path="categories" element={<Categories />} />
        <Route path="community" element={<Community />} />

        {/*  PROTECTED INSIDE LAYOUT */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="create"
          element={
            <ProtectedRoute>
              <CreateRecipe />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* AUTH PAGES (NO NAVBAR) */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
