const express = require('express');
const cuacaController = require('../controllers/cuacaController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(cuacaController.getAllCuaca).post(cuacaController.createCuaca);
router.route('/many').post(cuacaController.createManyCuaca);

router
  .route('/:id')
  .get(cuacaController.getCuaca)
  .patch(cuacaController.updateCuaca)
  .delete(cuacaController.deleteCuaca);
router.route('/:id/user').get(cuacaController.getCuacaUser);

router.route('/purge/:userId').delete(cuacaController.deleteAllCuaca);
router.route('/user/:userId').get(cuacaController.getAllCuacaByUserId);

module.exports = router;
