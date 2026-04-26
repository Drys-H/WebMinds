import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
      <div className="flex flex-col items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-4 sm:flex-row sm:px-6 lg:px-8">

        <h2
            className="cursor-pointer text-xl font-bold sm:text-2xl"
            onClick={() => navigate("/")}
        >
          <span className="text-[#6f8f6b]">Fit</span>
          <span className="text-[#f4a261]">&</span>
          <span className="text-[#6f8f6b]">Fresh</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium sm:gap-6">
        <span
            className="cursor-pointer hover:text-[#6f8f6b]"
            onClick={() => navigate("/")}
        >
          Home
        </span>

          <span
              className="cursor-pointer hover:text-[#6f8f6b]"
              onClick={() => navigate("/recipes")}
          >
          Recipes
        </span>

          <span
              className="cursor-pointer hover:text-[#6f8f6b]"
              onClick={() => navigate("/categories")}
          >
          Categories
        </span>

          <span
              className="cursor-pointer hover:text-[#6f8f6b]"
              onClick={() => navigate("/community")}
          >
          Community
        </span>
        </div>
      </div>
  );
}