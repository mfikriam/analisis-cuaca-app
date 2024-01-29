const express = require('express');
const kecelakaanController = require('../controllers/kecelakaanController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(kecelakaanController.getAllKecelakaan)
  .post(kecelakaanController.createKecelakaan);
router.route('/many').post(kecelakaanController.createManyKecelakaan);

router
  .route('/:id')
  .get(kecelakaanController.getKecelakaan)
  .patch(kecelakaanController.updateKecelakaan)
  .delete(kecelakaanController.deleteKecelakaan);
router.route('/:id/user').get(kecelakaanController.getKecelakaanUser);

router.route('/purge/:userId').delete(kecelakaanController.deleteAllKecelakaan);

module.exports = router;
