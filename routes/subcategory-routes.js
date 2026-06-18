const express = require('express');
const router = express.Router();
const multer = require('multer');

const subcategoryController = require('../controllers/subcategory-controller');
const checkAuth = require('../middleware/auth');
const { requireManager } = require('../middleware/role');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// View — all authenticated roles
router.get('/view', checkAuth, subcategoryController.viewSubCategory);

// Write — Admin & Manager only
router.get('/add', checkAuth, requireManager, subcategoryController.addSubCategoryPage);
router.post('/add', checkAuth, requireManager, upload.single('image'), subcategoryController.addSubCategory);
router.get('/delete/:id', checkAuth, requireManager, subcategoryController.deleteSubCategory);
router.get('/edit/:id', checkAuth, requireManager, subcategoryController.editSubCategoryPage);
router.post('/edit/:id', checkAuth, requireManager, upload.single('image'), subcategoryController.updateSubCategory);
router.get('/trash', checkAuth, requireManager, subcategoryController.viewTrashSubCategory);
router.get('/restore/:id', checkAuth, requireManager, subcategoryController.restoreSubCategory);
router.get('/permanent-delete/:id', checkAuth, requireManager, subcategoryController.permanentDeleteSubCategory);

// AJAX (open — used by product add/edit dropdowns)
router.get('/by-category/:categoryId', subcategoryController.getSubCategoriesByCategory);

module.exports = router;
