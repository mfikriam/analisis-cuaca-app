const express = require('express');
const clusteringController = require('../controllers/clusteringController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(clusteringController.getAllClustering)
  .post(clusteringController.createClustering);
router.route('/many').post(clusteringController.createManyClustering);

router
  .route('/:id')
  .get(clusteringController.getClustering)
  .patch(clusteringController.updateClustering)
  .delete(clusteringController.deleteClustering);
router.route('/:id/user').get(clusteringController.getClusteringUser);

router.route('/purge/:userId').delete(clusteringController.deleteAllClustering);

module.exports = router;
