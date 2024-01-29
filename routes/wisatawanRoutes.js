const express = require('express');
const wisatawanController = require('../controllers/wisatawanController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(wisatawanController.getAllWisatawan)
  .post(wisatawanController.createWisatawan);
router.route('/many').post(wisatawanController.createManyWisatawan);

router
  .route('/:id')
  .get(wisatawanController.getWisatawan)
  .patch(wisatawanController.updateWisatawan)
  .delete(wisatawanController.deleteWisatawan);
router.route('/:id/user').get(wisatawanController.getWisatawanUser);

router.route('/purge/:userId').delete(wisatawanController.deleteAllWisatawan);

module.exports = router;
