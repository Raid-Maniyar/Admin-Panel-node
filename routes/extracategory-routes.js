const express = require('express');
const router = express.Router();
const multer = require('multer');

const extracategoryController = require('../controllers/extracategory-controller');
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
router.get('/view', checkAuth, extracategoryController.viewExtraCategory);

// Write — Admin & Manager only
router.get('/add', checkAuth, requireManager, extracategoryController.addExtraCategoryPage);
router.post('/add', checkAuth, requireManager, upload.single('image'), extracategoryController.addExtraCategory);
router.get('/delete/:id', checkAuth, requireManager, extracategoryController.deleteExtraCategory);
router.get('/edit/:id', checkAuth, requireManager, extracategoryController.editExtraCategoryPage);
router.post('/edit/:id', checkAuth, requireManager, upload.single('image'), extracategoryController.updateExtraCategory);
router.get('/trash', checkAuth, requireManager, extracategoryController.viewTrashExtraCategory);
router.get('/restore/:id', checkAuth, requireManager, extracategoryController.restoreExtraCategory);
router.get('/permanent-delete/:id', checkAuth, requireManager, extracategoryController.permanentDeleteExtraCategory);

// AJAX (open — used by product add/edit dropdowns)
router.get('/by-subcategory/:subCategoryId', extracategoryController.getExtraCategoriesBySubCategory);

module.exports = router;
