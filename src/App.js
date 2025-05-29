import React, { useState } from "react";
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

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "1rem" }}>
      <h1>Recipe Finder</h1>
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={() => fetchRecipes(query)}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <RecipeList recipes={recipes} onRecipeSelect={setSelectedRecipe} />
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}

export default App;
