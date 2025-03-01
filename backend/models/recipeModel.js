import mongoose from 'mongoose';

const recipeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    prepTime: {
      type: Number,
      required: [true, 'Please add preparation time'],
    },
    cookTime: {
      type: Number,
      required: [true, 'Please add cooking time'],
    },
    servings: {
      type: Number,
      required: [true, 'Please add number of servings'],
    },
    ingredients: [
      {
        type: String,
        required: [true, 'Please add at least one ingredient'],
      },
    ],
    instructions: [
      {
        type: String,
        required: [true, 'Please add at least one instruction step'],
      },
    ],
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Other'],
      default: 'Other',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add virtual field for total time
recipeSchema.virtual('totalTime').get(function () {
  return this.prepTime + this.cookTime;
});

// Add virtual field for likes count
recipeSchema.virtual('likesCount').get(function () {
  return this.likes.length;
});

// Set virtuals to true when converting to JSON
recipeSchema.set('toJSON', { virtuals: true });
recipeSchema.set('toObject', { virtuals: true });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;