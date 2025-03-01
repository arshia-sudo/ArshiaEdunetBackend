import React, { useContext, useEffect } from 'react';
import { Settings, BookOpen, Heart, Clock } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import RecipeContext from '../context/RecipeContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { userRecipes, loading, fetchUserRecipes } = useContext(RecipeContext);

  useEffect(() => {
    fetchUserRecipes();
  }, [fetchUserRecipes]);

  return (
    <div className="min-h-screen bg-secondary-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-secondary rounded-lg shadow-md p-6 mb-8 border border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={user?.profileImage || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">{user?.name || 'User'}</h1>
                <p className="text-gray-400">{user?.bio || 'Food enthusiast & home chef'}</p>
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md text-sm font-medium text-gray-300 bg-secondary-light hover:bg-secondary transition duration-150">
              <Settings className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-800 pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userRecipes.length}</div>
              <div className="text-sm text-gray-400">Recipes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-gray-400">Following</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-8">
          <nav className="-mb-px flex space-x-8">
            <a href="#" className="border-primary text-primary whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              My Recipes
            </a>
            <a href="#" className="border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Favorites
            </a>
            <a href="#" className="border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </a>
          </nav>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading recipes...</p>
          </div>
        ) : userRecipes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">You haven't created any recipes yet.</p>
            <a href="/create" className="mt-4 inline-block px-4 py-2 bg-primary text-black rounded-md hover:bg-primary-dark transition duration-150">
              Create Your First Recipe
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userRecipes.map((recipe) => (
              <div key={recipe._id} className="bg-secondary rounded-lg overflow-hidden border border-gray-800 hover:border-primary transition duration-150">
                <img
                  src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">{recipe.title}</h3>
                  <div className="text-sm text-gray-400">
                    Published on {new Date(recipe.createdAt).toLocaleDateString()}
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="text-gray-400 hover:text-primary transition duration-150">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-primary transition duration-150">
                      <Settings className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;