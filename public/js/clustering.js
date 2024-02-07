/* eslint-disable */
import axios from 'axios';
import { delayAlert, showAlert, validationErrorAlert } from './alert';

//***************** Static Functions ******************* */
const _getRandomDatasets = (dataset, k) => {
  const randomDatasets = [];
  const dataCopy = [...dataset];

  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * dataCopy.length);
    randomDatasets.push(dataCopy.splice(randomIndex, 1)[0]);
  }

  return randomDatasets;
};

const _euclideanDistance = (obj1, obj2, objKeys) => {
  let sum = 0;
  objKeys.forEach((key) => (sum += Math.pow(obj1[key] - obj2[key], 2)));

  return Math.sqrt(sum);
};

const _centroidsConverged = (oldCentroids, newCentroids, objKeys) => {
  return oldCentroids.every((oldCentroid, i) => {
    const newCentroid = newCentroids[i];
    return objKeys.every((key) => oldCentroid[key] === newCentroid[key]);
  });
};

const _calculateAverageWithinCentroidDistance = (dataCuaca, centroidsObj, objKeys) => {
  const centroidsName = Object.keys(centroidsObj);
  const clusterDistances = {};
  const averageDistances = {};
  centroidsName.forEach((cn) => {
    clusterDistances[cn] = [];
    averageDistances[cn] = 0;
  });

  //? Calculate distances for each point in each cluster
  dataCuaca.forEach((cuacaObj) => {
    const centroid = centroidsObj[cuacaObj.cluster];
    clusterDistances[cuacaObj.cluster].push(_euclideanDistance(cuacaObj, centroid, objKeys));
  });

  //? Calculate average distance for each cluster
  centroidsName.forEach((cn) => {
    if (clusterDistances[cn].length > 0) {
      averageDistances[cn] =
        clusterDistances[cn].reduce((sum, distance) => sum + distance, 0) /
        clusterDistances[cn].length;
    }
  });

  //? Calculate overall average within-centroid distance
  const overallAverage =
    centroidsName.reduce((acc, current) => acc + averageDistances[current], 0) /
    centroidsName.length;

  return [overallAverage, averageDistances];
};

const _kmeans = (dataset, criteria, k, maxIterations) => {
  let numOfIterations = 0;

  //? 1. Initialize clusters with k random cuaca object from the dataset
  let clusters = _getRandomDatasets(dataset, k).map((obj, index) => ({
    name: `cluster_${index + 1}`,
    centroid: obj,
    members: [],
  }));

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    numOfIterations++;
    const oldCentroids = clusters.map((cluster) => cluster.centroid);

    //? 2. Assign each cuaca obj to the nearest cluster
    dataset.forEach((obj) => {
      const distances = clusters.map((cluster) => ({
        cluster,
        distance: _euclideanDistance(obj, cluster.centroid, criteria),
      }));
      const nearestCluster = distances.reduce((min, current) =>
        current.distance < min.distance ? current : min,
      ).cluster;
      nearestCluster.members.push(obj);
      obj.cluster = nearestCluster.name;
    });

    //? 3. Update the centroids of each cluster
    clusters.forEach((cluster) => {
      if (cluster.members.length > 0) {
        const newCentroid = cluster.members.reduce((accumulator, currentObj) => {
          criteria.forEach((key) => {
            accumulator[key] += currentObj[key]; // Adding the value to the corresponding key
          });
          return accumulator;
        }, Object.fromEntries(criteria.map((key) => [key, 0])));

        criteria.forEach((key) => {
          newCentroid[key] = newCentroid[key] / cluster.members.length;
        });

        cluster.centroid = newCentroid;
      }
      cluster.members = [];
    });
    const newCentroids = clusters.map((cluster) => cluster.centroid);

    //? 4. Stop iteration if centroids convergence
    if (_centroidsConverged(oldCentroids, newCentroids, criteria)) break;
  }

  const centroidsObj = {};
  clusters.forEach((cluster) => {
    centroidsObj[cluster.name] = cluster.centroid;
  });

  return [dataset, centroidsObj, numOfIterations];
};

const _dataClustering = (dataCuaca, criteria, numOfClusters, numberOfRuns, maxIterations = 100) => {
  const results = [];

  for (let i = 0; i < numberOfRuns; i++) {
    const [kMeansResult, centroidsObj, numOfIterations] = _kmeans(
      [...dataCuaca],
      criteria,
      numOfClusters,
      maxIterations,
    );
    const [avgWithinCentroidDistance, avgWithinCentroidDistanceForCluster] =
      _calculateAverageWithinCentroidDistance([...kMeansResult], centroidsObj, criteria);

    results.push({
      dataset: kMeansResult,
      centroids: centroidsObj,
      num_of_iterations: numOfIterations,
      awcd: avgWithinCentroidDistance,
      awcd_clusters: avgWithinCentroidDistanceForCluster,
    });
  }

  //? Identify the run with the lowest average within-centroid distance
  const bestAvgWithinCentroidResult = results.reduce((best, current) =>
    current.awcd < best.awcd ? current : best,
  );

  return bestAvgWithinCentroidResult;
};

const _addClustering = async (data, form) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/clustering',
      data,
    });

    if (res.data.status === 'success') {
      return res.data.data.clustering;
    }
  } catch (err) {
    form.classList.remove('was-validated');
    validationErrorAlert(err);
  }
};

const _addClusteringResult = async (data) => {
  try {
    await axios({
      method: 'POST',
      url: '/api/v1/clustering-result/many',
      data,
    });
  } catch (err) {
    validationErrorAlert(err);
  }
};

const _getCuaca = async (userId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/cuaca/user/${userId}`,
    });

    if (res.data.status === 'success') {
      return res.data.data.cuacas;
    }
  } catch (err) {
    showAlert(err.response.data.message, 'danger');
  }
};

const _deleteClustering = async (userId) => {
  try {
    await axios({
      method: 'DELETE',
      url: `/api/v1/clustering/purge/${userId}`,
    });
  } catch (err) {
    showAlert(err.response.data.message, 'danger');
  }
};

//***************** Exported Functions ******************* */
export const replaceClustering = async (data, form) => {
  //? Delete Previous Clustering Data
  await _deleteClustering(data.user_id);

  //? Get All Data Cuaca
  const cuacaArr = await _getCuaca(data.user_id);
  if (cuacaArr.length === 0) {
    showAlert('You do not have data cuaca. Insert data cuaca first!', 'danger');
    return;
  }

  //? Filter Data Cuaca
  const criteria = JSON.parse(data.kriteria_clustering);
  const filteredCuacaArr = cuacaArr.map((cuaca) => {
    const obj = {};
    criteria.forEach((el) => {
      obj[el] = cuaca[el];
    });
    return obj;
  });

  //? K-Means Clustering
  const dataClusteringResult = _dataClustering(
    [...filteredCuacaArr],
    criteria,
    data.jum_cluster * 1,
    data.jum_percobaan * 1,
  );

  data.centroids = JSON.stringify(dataClusteringResult.centroids);
  data.awcd = dataClusteringResult.awcd;
  data.awcd_clusters = JSON.stringify(dataClusteringResult.awcd_clusters);

  //? Add Clustering Data
  const clustering = await _addClustering(data, form);

  // //? Create New K-Means Result Data
  const newClusteringResult = dataClusteringResult.dataset.map((clusteringResult, index) => ({
    clustering_id: clustering.id,
    cuaca_id: cuacaArr[index].id,
    cluster: clusteringResult.cluster,
  }));

  // //? Add Clustering Result Data
  await _addClusteringResult(newClusteringResult);

  delayAlert('K-Means clustering successfully clustered data cuaca', 'success');
};

export const deleteAllClusteringResult = async (userId, modal) => {
  try {
    modal.hide();

    await axios({
      method: 'DELETE',
      url: `/api/v1/clustering/purge/${userId}`,
    });

    delayAlert(`All clustering result data deleted successfully`, 'success');
  } catch (err) {
    showAlert(err.response.data.message, 'danger');
  }
};
