const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', viewController.getHomePage);
router.get('/login', authController.isNotLoggedIn, viewController.getLoginForm);

router.get('/dashboard', authController.isLoggedIn, viewController.getDashboardPage);
router.get('/manage-user', authController.isLoggedIn, viewController.getManageUserPage);
router.get('/kecelakaan', authController.isLoggedIn, viewController.getKecelakaanPage);
router.get('/wisatawan', authController.isLoggedIn, viewController.getWisatawanPage);
router.get('/cuaca', authController.isLoggedIn, viewController.getCuacaPage);

router.get('/blank', authController.isLoggedIn, viewController.getBlankPage);

module.exports = router;
