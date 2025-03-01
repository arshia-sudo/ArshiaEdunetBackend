import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  getUserRecipes,
} from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure storage for recipe images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/recipes'));
  },
  filename(req, file, cb) {
    cb(
      null,
      `recipe-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Recipe routes
router.route('/')
  .get(getRecipes)
  .post(protect, upload.single('image'), createRecipe);

router.route('/user')
  .get(protect, getUserRecipes);

router.route('/:id')
  .get(getRecipeById)
  .put(protect, upload.single('image'), updateRecipe)
  .delete(protect, deleteRecipe);

router.route('/:id/like')
  .put(protect, likeRecipe);

export default router;