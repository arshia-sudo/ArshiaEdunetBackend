import React, { useState, useContext } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RecipeContext from '../context/RecipeContext';

const CreateRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [category, setCategory] = useState('Other');
  const [difficulty, setDifficulty] = useState('Medium');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const { createRecipe, loading, error } = useContext(RecipeContext);
  const navigate = useNavigate();

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty ingredients and steps
    const filteredIngredients = ingredients.filter(item => item.trim() !== '');
    const filteredSteps = steps.filter(step => step.trim() !== '');
    
    if (filteredIngredients.length === 0 || filteredSteps.length === 0) {
      alert('Please add at least one ingredient and one instruction step');
      return;
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('prepTime', prepTime);
    formData.append('cookTime', cookTime);
    formData.append('servings', servings);
    formData.append('category', category);
    formData.append('difficulty', difficulty);
    
    // Append ingredients and steps as arrays
    filteredIngredients.forEach(ingredient => {
      formData.append('ingredients', ingredient);
    });
    
    filteredSteps.forEach(step => {
      formData.append('instructions', step);
    });
    
    // Append image if exists
    if (image) {
      formData.append('image', image);
    }
    
    await createRecipe(formData);
    
    // Navigate to recipes page if no errors
    if (!error) {
      navigate('/recipes');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Recipe</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Recipe Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700">
                Prep Time (minutes)
              </label>
              <input
                type="number"
                id="prepTime"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700">
                Cook Time (minutes)
              </label>
              <input
                type="number"
                id="cookTime"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700">
                Servings
              </label>
              <input
                type="number"
                id="servings"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Dessert">Dessert</option>
                <option value="Snack">Snack</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Recipe Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-orange-50 file:text-orange-700
                hover:file:bg-orange-100"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Recipe preview"
                  className="h-32 w-auto object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h2>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => {
                    const newIngredients = [...ingredients];
                    newIngredients[index] = e.target.value;
                    setIngredients(newIngredients);
                  }}
                  placeholder="e.g., 2 cups flour"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  disabled={ingredients.length === 1}
                >
                  <Minus className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Ingredient
          </button>
        </div>

        {/* Steps */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  value={step}
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[index] = e.target.value;
                    setSteps(newSteps);
                  }}
                  placeholder={`Step ${index + 1}`}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  disabled={steps.length === 1}
                >
                  <Minus className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStep}
            className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Step
          </button>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70"
          >
            {loading ? 'Creating Recipe...' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;