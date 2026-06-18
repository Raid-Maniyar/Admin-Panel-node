const express = require('express');
const router = express.Router();
const multer = require('multer');

const adminController = require('../controllers/admin-controller');
const checkAuth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/login', adminController.loginPage);
router.post('/login', adminController.loginUser);
router.get('/register', adminController.registerPage);
router.post('/register', adminController.registerUser);
router.get('/logout', adminController.logoutUser);

// Forget Password & OTP (public)
router.get('/forget-password', adminController.forgetPasswordPage);
router.post('/forget-password', adminController.sendForgetPasswordToken);
router.get('/verify-otp', adminController.verifyOtpPage);
router.post('/verify-otp', adminController.verifyOtp);
router.get('/reset-password/:token', adminController.resetPasswordPage);
router.post('/reset-password/:token', adminController.updatePassword);

// Authenticated routes (all roles)
router.get('/', checkAuth, adminController.adminHome);
router.get('/profile', checkAuth, adminController.profilePage);
router.post('/profile', checkAuth, upload.single('avatar'), adminController.updateProfile);
router.get('/change-password', checkAuth, adminController.changePasswordPage);
router.post('/change-password', checkAuth, adminController.updateChangePassword);

// Admin-only — User Management
router.get('/add-user', checkAuth, requireAdmin, adminController.adminAddUser);
router.post('/add-user', checkAuth, requireAdmin, upload.single('avatar'), adminController.adminAddUser);
router.get('/view-user', checkAuth, requireAdmin, adminController.adminViewUser);
router.get('/delete-user/:id', checkAuth, requireAdmin, adminController.deleteUser);
router.get('/edit-user/:id', checkAuth, requireAdmin, adminController.editUser);
router.post('/update-user/:id', checkAuth, requireAdmin, upload.single('avatar'), adminController.updateUser);
router.get('/trash-user', checkAuth, requireAdmin, adminController.viewTrashUser);
router.get('/restore-user/:id', checkAuth, requireAdmin, adminController.restoreUser);
router.get('/permanent-delete-user/:id', checkAuth, requireAdmin, adminController.permanentDeleteUser);

module.exports = router;