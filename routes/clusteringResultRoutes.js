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
  .route('/clustering/:clusteringId')
  .get(clusteringResultController.getAllClusteringResultByClusteringId)
  .delete(clusteringResultController.deleteClusteringResultByClusteringId);

router
  .route('/clustering/:clusteringId/cluster/:oldCluster')
  .patch(clusteringResultController.updateClusteringResultClusterByClusteringId);

module.exports = router;
