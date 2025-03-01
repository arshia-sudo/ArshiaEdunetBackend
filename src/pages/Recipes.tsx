import React, { useContext, useEffect, useState } from 'react';
import { Clock, User, Heart } from 'lucide-react';
import RecipeContext from '../context/RecipeContext';
import AuthContext from '../context/AuthContext';

const Recipes = () => {
  const { recipes, loading, error, fetchRecipes, likeRecipe } = useContext(RecipeContext);
  const { user } = useContext(AuthContext);
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(searchTerm, category);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    fetchRecipes(searchTerm, e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    // In a real app, you would sort the recipes here or fetch sorted recipes from the backend
  };

  const handleLike = (id: string) => {
    if (user) {
      likeRecipe(id);
    } else {
      alert('Please log in to like recipes');
    }
  };

  const isLikedByUser = (likes: string[]) => {
    return user ? likes.includes(user._id) : false;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">All Recipes</h1>
        
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-l-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600"
          >
            Search
          </button>
        </form>
        
        <div className="flex space-x-4 w-full md:w-auto">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Dessert">Desserts</option>
            <option value="Snack">Snacks</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="latest">Sort by: Latest</option>
            <option value="popular">Most Popular</option>
            <option value="cookTime">Cooking Time</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading recipes...</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No recipes found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <img
                src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-4">{recipe.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{recipe.user.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.prepTime + recipe.cookTime} mins</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {recipe.difficulty}
                  </span>
                  <button 
                    onClick={() => handleLike(recipe._id)}
                    className={`flex items-center space-x-1 ${isLikedByUser(recipe.likes) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart className="h-5 w-5" fill={isLikedByUser(recipe.likes) ? 'currentColor' : 'none'} />
                    <span>{recipe.likesCount}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;