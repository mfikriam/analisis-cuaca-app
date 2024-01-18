const express = require('express');
const clusteringResultController = require('../controllers/clusteringResultController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(clusteringResultController.getAllClusteringResult)
  .post(clusteringResultController.createClusteringResult);
router.route('/many').post(clusteringResultController.createManyClusteringResult);

router
  .route('/:id')
  .get(clusteringResultController.getClusteringResult)
  .patch(clusteringResultController.updateClusteringResult)
  .delete(clusteringResultController.deleteClusteringResult);

router
  .route('/clustering/:clusteringId/cuaca')
  .get(clusteringResultController.getAllClusteringResultCuaca);

module.exports = router;
