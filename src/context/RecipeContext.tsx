import React, { createContext, useState, useContext, ReactNode } from 'react';
import AuthContext from './AuthContext';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  image: string;
  category: string;
  difficulty: string;
  user: {
    _id: string;
    name: string;
    profileImage: string;
  };
  createdAt: string;
  likes: string[];
  likesCount: number;
}

interface RecipeContextType {
  recipes: Recipe[];
  userRecipes: Recipe[];
  loading: boolean;
  error: string | null;
  fetchRecipes: (keyword?: string, category?: string, difficulty?: string) => Promise<void>;
  fetchUserRecipes: () => Promise<void>;
  createRecipe: (recipeData: FormData) => Promise<void>;
  updateRecipe: (id: string, recipeData: FormData) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  likeRecipe: (id: string) => Promise<void>;
  clearError: () => void;
}

const RecipeContext = createContext<RecipeContextType>({
  recipes: [],
  userRecipes: [],
  loading: false,
  error: null,
  fetchRecipes: async () => {},
  fetchUserRecipes: async () => {},
  createRecipe: async () => {},
  updateRecipe: async () => {},
  deleteRecipe: async () => {},
  likeRecipe: async () => {},
  clearError: () => {},
});

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  const fetchRecipes = async (keyword = '', category = '', difficulty = '') => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/recipes?`;
      if (keyword) url += `keyword=${keyword}&`;
      if (category) url += `category=${category}&`;
      if (difficulty) url += `difficulty=${difficulty}&`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recipes');
      }

      setRecipes(data.recipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRecipes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/recipes/user', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user recipes');
      }

      setUserRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createRecipe = async (recipeData: FormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: recipeData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create recipe');
      }

      // Update recipes list
      setRecipes([data, ...recipes]);
      setUserRecipes([data, ...userRecipes]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateRecipe = async (id: string, recipeData: FormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: recipeData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update recipe');
      }

      // Update recipes lists
      setRecipes(recipes.map(recipe => recipe._id === id ? data : recipe));
      setUserRecipes(userRecipes.map(recipe => recipe._id === id ? data : recipe));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete recipe');
      }

      // Update recipes lists
      setRecipes(recipes.filter(recipe => recipe._id !== id));
      setUserRecipes(userRecipes.filter(recipe => recipe._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const likeRecipe = async (id: string) => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${id}/like`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to like recipe');
      }

      // Update recipes with new likes
      setRecipes(
        recipes.map(recipe =>
          recipe._id === id
            ? { ...recipe, likes: data.likes, likesCount: data.likesCount }
            : recipe
        )
      );
      
      setUserRecipes(
        userRecipes.map(recipe =>
          recipe._id === id
            ? { ...recipe, likes: data.likes, likesCount: data.likesCount }
            : recipe
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        userRecipes,
        loading,
        error,
        fetchRecipes,
        fetchUserRecipes,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        likeRecipe,
        clearError,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeContext;