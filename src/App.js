import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import RecipeList from "./components/RecipeList";
import RecipeModal from "./components/RecipeModal";

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Favorites Logic
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
    setFavoriteRecipes(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes));
  }, [favoriteRecipes]);

  const toggleFavorite = (recipe) => {
    setFavoriteRecipes((prev) => {
      const exists = prev.some((fav) => fav.idMeal === recipe.idMeal);
      if (exists) {
        return prev.filter((fav) => fav.idMeal !== recipe.idMeal);
      } else {
        return [...prev, recipe];
      }
    });
  };

  // Function to fetch recipes
  const fetchRecipes = async (searchTerm) => {
    setLoading(true);
    setError("");
    setRecipes([]);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
      );
      const data = await response.json();
      if (data.meals) {
        setRecipes(data.meals);
      } else {
        setError("No recipes found.");
      }
    } catch (error) {
      setError("Something went wrong. Try again!");
    }
    setLoading(false);
  };

  // Use correct recipes source for RecipeList:
  const recipesToShow = showFavorites ? favoriteRecipes : recipes;
  const favoriteIds = favoriteRecipes.map((fav) => fav.idMeal);

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "1rem" }}>
      <h1>Recipe Finder</h1>
      <button
        style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}
        onClick={() => setShowFavorites((prev) => !prev)}
      >
        {showFavorites ? "Show Search Results" : "Show Favorites"}
      </button>
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={() => fetchRecipes(query)}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <RecipeList
        recipes={recipesToShow}
        onRecipeSelect={setSelectedRecipe}
        favorites={favoriteIds}
        onToggleFavorite={toggleFavorite}
      />
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isFavorite={favoriteRecipes.some(
            (fav) => fav.idMeal === selectedRecipe.idMeal
          )}
          onToggleFavorite={() => toggleFavorite(selectedRecipe)}
        />
      )}
    </div>
  );
}

export default App;
