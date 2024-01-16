const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', viewController.getHomePage);
router.get('/login', authController.isNotLoggedIn, viewController.getLoginForm);

router.get('/dashboard', authController.isLoggedIn, viewController.getDashboardPage);
router.get('/manage-user', authController.isLoggedIn, viewController.getManageUserPage);
router.get('/kecelakaan', authController.isLoggedIn, viewController.getKecelakaanPage);
router.get('/blank', authController.isLoggedIn, viewController.getBlankPage);
// router.get('/', authController.isLoggedIn, viewController.getOverview);
// router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
// router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
// router.get('/me', authController.protect, viewController.getAccount);

// router.post('/submit-user-data', authController.protect, viewController.updateUserData);

module.exports = router;
