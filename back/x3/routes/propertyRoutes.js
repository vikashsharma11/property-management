const express = require('express');
const multer = require('multer');
const { getProperties, createProperty, deleteProperty, getPropertyById, updateProperty} = require('../controllers/propertyController');  // Import getPropertyById
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

const router = express.Router();

// Routes
router.get('/', getProperties);  // Get all properties
router.get('/:id', getPropertyById);  // Get property by ID
router.post('/', verifyToken, isAdmin, upload.single('img'), createProperty);  // Create new property
router.delete('/:id', verifyToken, isAdmin, deleteProperty);  // Delete property by ID
router.put('/:id', verifyToken, isAdmin, upload.single('img'), updateProperty);

module.exports = router;
