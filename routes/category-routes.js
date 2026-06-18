const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category-controller');
const checkAuth = require('../middleware/auth');
const { requireManager } = require('../middleware/role');

// View — all authenticated roles
router.get('/view', checkAuth, categoryController.viewCategory);

// Write — Admin & Manager only
router.get('/add', checkAuth, requireManager, categoryController.addCategoryPage);
router.post('/add', checkAuth, requireManager, categoryController.addCategory);
router.get('/delete/:id', checkAuth, requireManager, categoryController.deleteCategory);
router.get('/edit/:id', checkAuth, requireManager, categoryController.editCategoryPage);
router.post('/edit/:id', checkAuth, requireManager, categoryController.updateCategory);
router.get('/trash', checkAuth, requireManager, categoryController.viewTrashCategory);
router.get('/restore/:id', checkAuth, requireManager, categoryController.restoreCategory);
router.get('/permanent-delete/:id', checkAuth, requireManager, categoryController.permanentDeleteCategory);

module.exports = router;
