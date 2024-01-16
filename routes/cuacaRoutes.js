const express = require('express');
const cuacaController = require('../controllers/cuacaController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(cuacaController.getAllCuaca).post(cuacaController.createCuaca);
router
  .route('/:id')
  .get(cuacaController.getCuaca)
  .patch(cuacaController.updateCuaca)
  .delete(cuacaController.deleteCuaca);

module.exports = router;
