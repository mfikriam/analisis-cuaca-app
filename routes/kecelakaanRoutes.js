const express = require('express');
const kecelakaanController = require('../controllers/kecelakaanController');

const router = express.Router();

router
  .route('/')
  .get(kecelakaanController.getAllKecelakaans)
  .post(kecelakaanController.createKecelakaan);
router
  .route('/:id')
  .get(kecelakaanController.getKecelakaan)
  .patch(kecelakaanController.updateKecelakaan)
  .delete(kecelakaanController.deleteKecelakaan);

module.exports = router;
