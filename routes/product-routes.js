const express = require('express');
const router = express.Router();
const multer = require('multer');

const productController = require('../controllers/product-controller');
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

// View — all authenticated roles (User, Manager, Admin)
router.get('/view', checkAuth, productController.viewProduct);

// Write — Admin & Manager only
router.get('/add', checkAuth, requireManager, productController.addProductPage);
router.post('/add', checkAuth, requireManager, upload.single('image'), productController.addProduct);
router.get('/delete/:id', checkAuth, requireManager, productController.deleteProduct);
router.get('/edit/:id', checkAuth, requireManager, productController.editProductPage);
router.post('/edit/:id', checkAuth, requireManager, upload.single('image'), productController.updateProduct);
router.get('/trash', checkAuth, requireManager, productController.viewTrashProduct);
router.get('/restore/:id', checkAuth, requireManager, productController.restoreProduct);
router.get('/permanent-delete/:id', checkAuth, requireManager, productController.permanentDeleteProduct);

module.exports = router;
