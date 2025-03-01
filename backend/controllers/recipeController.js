import asyncHandler from '../utils/asyncHandler.js';
import Recipe from '../models/recipeModel.js';

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    prepTime,
    cookTime,
    servings,
    ingredients,
    instructions,
    category,
    difficulty,
  } = req.body;

  // Create recipe
  const recipe = await Recipe.create({
    user: req.user._id,
    title,
    description,
    prepTime,
    cookTime,
    servings,
    ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
    instructions: Array.isArray(instructions) ? instructions : [instructions],
    category,
    difficulty,
    image: req.file ? `/uploads/${req.file.filename}` : '',
  });

  if (recipe) {
    res.status(201).json(recipe);
  } else {
    res.status(400);
    throw new Error('Invalid recipe data');
  }
});

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
const getRecipes = asyncHandler(async (req, res) => {
  const pageSize = 9;
  const page = Number(req.query.pageNumber) || 1;
  
  // Build query based on filters
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
    
  const categoryFilter = req.query.category ? { category: req.query.category } : {};
  const difficultyFilter = req.query.difficulty ? { difficulty: req.query.difficulty } : {};
  
  // Combine all filters
  const filter = {
    ...keyword,
    ...categoryFilter,
    ...difficultyFilter,
  };

  const count = await Recipe.countDocuments(filter);
  
  const recipes = await Recipe.find(filter)
    .populate('user', 'name profileImage')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    recipes,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate(
    'user',
    'name profileImage'
  );

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404);
    throw new Error('Recipe not found');
  }
});

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (recipe) {
    // Check if recipe belongs to user
    if (recipe.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this recipe');
    }

    // Update recipe fields
    recipe.title = req.body.title || recipe.title;
    recipe.description = req.body.description || recipe.description;
    recipe.prepTime = req.body.prepTime || recipe.prepTime;
    recipe.cookTime = req.body.cookTime || recipe.cookTime;
    recipe.servings = req.body.servings || recipe.servings;
    recipe.ingredients = req.body.ingredients || recipe.ingredients;
    recipe.instructions = req.body.instructions || recipe.instructions;
    recipe.category = req.body.category || recipe.category;
    recipe.difficulty = req.body.difficulty || recipe.difficulty;
    
    if (req.file) {
      recipe.image = `/uploads/${req.file.filename}`;
    }

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } else {
    res.status(404);
    throw new Error('Recipe not found');
  }
});

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (recipe) {
    // Check if recipe belongs to user
    if (recipe.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this recipe');
    }

    await Recipe.deleteOne({ _id: recipe._id });
    res.json({ message: 'Recipe removed' });
  } else {
    res.status(404);
    throw new Error('Recipe not found');
  }
});

// @desc    Like/unlike a recipe
// @route   PUT /api/recipes/:id/like
// @access  Private
const likeRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (recipe) {
    // Check if recipe has already been liked by user
    const alreadyLiked = recipe.likes.includes(req.user._id);

    if (alreadyLiked) {
      // Unlike the recipe
      recipe.likes = recipe.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
    } else {
      // Like the recipe
      recipe.likes.push(req.user._id);
    }

    await recipe.save();
    res.json({ likes: recipe.likes, likesCount: recipe.likes.length });
  } else {
    res.status(404);
    throw new Error('Recipe not found');
  }
});

// @desc    Get user recipes
// @route   GET /api/recipes/user
// @access  Private
const getUserRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(recipes);
});

export {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  getUserRecipes,
};