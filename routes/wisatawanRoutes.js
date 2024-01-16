const express = require('express');
const wisatawanController = require('../controllers/wisatawanController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(wisatawanController.getAllWisatawan)
  .post(wisatawanController.createWisatawan);
router
  .route('/:id')
  .get(wisatawanController.getWisatawan)
  .patch(wisatawanController.updateWisatawan)
  .delete(wisatawanController.deleteWisatawan);

module.exports = router;
