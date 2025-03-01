import React from 'react';
import { ChefHat, Users, Utensils } from 'lucide-react';

const Home = () => {
  const featuredRecipes = [
    {
      id: 1,
      title: "Classic Margherita Pizza",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      author: "Chef Maria",
      time: "30 mins"
    },
    {
      id: 2,
      title: "Thai Green Curry",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      author: "Chef John",
      time: "45 mins"
    },
    {
      id: 3,
      title: "Chocolate Lava Cake",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      author: "Chef Sarah",
      time: "25 mins"
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-light">
      {/* Hero Section */}
      <div className="bg-secondary py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-primary mb-6">
            Share Your Culinary Magic
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join our community of food lovers and share your favorite recipes with the world.
          </p>
          <div className="mt-8">
            <a href="/register" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-primary hover:bg-primary-dark transition duration-150">
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-secondary rounded-lg border border-gray-800">
            <ChefHat className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Expert Recipes</h3>
            <p className="text-gray-400">Access recipes from professional chefs worldwide</p>
          </div>
          <div className="text-center p-8 bg-secondary rounded-lg border border-gray-800">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Community</h3>
            <p className="text-gray-400">Connect with fellow food enthusiasts</p>
          </div>
          <div className="text-center p-8 bg-secondary rounded-lg border border-gray-800">
            <Utensils className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Easy Sharing</h3>
            <p className="text-gray-400">Share your recipes in just a few clicks</p>
          </div>
        </div>
      </div>

      {/* Featured Recipes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Featured Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-secondary rounded-lg overflow-hidden border border-gray-800 hover:border-primary transition duration-150">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">{recipe.title}</h3>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{recipe.author}</span>
                  <span>{recipe.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;