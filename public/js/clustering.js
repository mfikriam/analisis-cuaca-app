/* eslint-disable */
import axios from 'axios';
import { delayAlert, showAlert, validationErrorAlert } from './alert';

//***************** Static Functions ******************* */
const _getRandomDatasets = (dataset, k) => {
  const randomDatasets = [];
  const dataCopy = JSON.parse(JSON.stringify(dataset));

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

const _centroidsConverged = (oldCentroids, newCentroids, clustersName, objKeys) => {
  return clustersName.every((cluster) => {
    return objKeys.every((key) => {
      return oldCentroids[cluster][key] === newCentroids[cluster][key];
    });
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

const _calculateInertia = (dataCuaca, centroidsObj, objKeys) => {
  let inertia = 0;

  //? Calculate distances between each data cuaca and the centroid of its assigned cluster
  dataCuaca.forEach((cuacaObj) => {
    const centroid = centroidsObj[cuacaObj.cluster];
    inertia += _euclideanDistance(cuacaObj, centroid, objKeys);
  });

  return inertia;
};

const _kmeans = (dataset, criteria, k, maxIterations) => {
  let numOfIterations = 0;

  //* 1. Initialize clusters with k random cuaca object from the dataset
  let clusters = _getRandomDatasets(dataset, k).map((obj, index) => ({
    name: `cluster_${index + 1}`,
    centroid: obj,
    members: [],
  }));
  const clustersName = clusters.map((cluster) => cluster.name);

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    numOfIterations++;
    const oldCentroids = clusters.reduce(
      (acc, cluster) => ((acc[cluster.name] = cluster.centroid), acc),
      {},
    );

    //* 2. Assign each cuaca obj to the nearest cluster
    dataset.forEach((cuacaObj) => {
      const distances = clusters.map((cluster) => ({
        clusterName: cluster.name,
        distance: _euclideanDistance(cuacaObj, cluster.centroid, criteria),
      }));

      const nearestCluster = distances.reduce((min, current) =>
        current.distance < min.distance ? current : min,
      ).clusterName;

      clusters.forEach((cluster) => {
        if (cluster.name === nearestCluster) {
          cluster.members.push(cuacaObj);
        }
      });
    });

    //* 3. Update the centroids of each cluster
    clusters.forEach((cluster) => {
      if (cluster.members.length > 0) {
        //? Initialize centroid object with attribute value = 0
        const centroid = criteria.reduce((acc, crit) => ((acc[crit] = 0), acc), {});

        //? Sum each attribute value
        cluster.members.forEach((memberObj) => {
          criteria.forEach((crit) => {
            centroid[crit] += memberObj[crit];
          });
        });

        //? Divide each attribute value with cluster length
        criteria.forEach((crit) => {
          centroid[crit] /= cluster.members.length;
        });

        //? Update centroid value
        cluster.centroid = centroid;
      }

      //? Reset cluster members for next iteration
      cluster.members = [];
    });

    //? Create New Centroids Object
    const newCentroids = clusters.reduce(
      (acc, cluster) => ((acc[cluster.name] = cluster.centroid), acc),
      {},
    );

    //* 4. Stop iteration if centroids convergence
    if (_centroidsConverged(oldCentroids, newCentroids, clustersName, criteria)) break;
  }

  //? Create Centroids Object
  const centroidsObj = clusters.reduce(
    (acc, cluster) => ((acc[cluster.name] = cluster.centroid), acc),
    {},
  );

  //? Add cluster name to each cuaca obj
  dataset.forEach((cuacaObj) => {
    const distances = clusters.map((cluster) => ({
      clusterName: cluster.name,
      distance: _euclideanDistance(cuacaObj, cluster.centroid, criteria),
    }));
    const nearestCluster = distances.reduce((min, current) =>
      current.distance < min.distance ? current : min,
    ).clusterName;

    cuacaObj.cluster = nearestCluster;
  });

  return {
    dataset,
    centroidsObj,
    numOfIterations,
  };
};

const _dataClustering = (dataCuaca, criteria, numOfClusters, numberOfRuns, maxIterations = 100) => {
  const results = [];

  for (let i = 0; i < numberOfRuns; i++) {
    //? K-Means Clustering
    const dataCuacaCopy = JSON.parse(JSON.stringify(dataCuaca));
    const kMeansResult = _kmeans(dataCuacaCopy, criteria, numOfClusters, maxIterations);

    //? Calculate Inertia
    const inertia = _calculateInertia(kMeansResult.dataset, kMeansResult.centroidsObj, criteria);

    results.push({
      dataset: kMeansResult.dataset,
      centroids: kMeansResult.centroidsObj,
      num_of_iterations: kMeansResult.numOfIterations,
      inertia,
    });
  }

  //? Identify the run with the lowest inertia
  const bestRun = results.reduce((best, current) =>
    current.inertia < best.inertia ? current : best,
  );

  return bestRun;
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

const _updateClusteringById = async (clusteringId, data) => {
  try {
    await axios({
      method: 'PATCH',
      url: `/api/v1/clustering/${clusteringId}`,
      data,
    });
  } catch (err) {
    validationErrorAlert(err);
  }
};

const _updateClusteringResultClusterByClusteringId = async (clusteringId, oldCluster, data) => {
  try {
    await axios({
      method: 'PATCH',
      url: `/api/v1/clustering-result/clustering/${clusteringId}/cluster/${oldCluster}`,
      data,
    });
  } catch (err) {
    validationErrorAlert(err);
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
    obj.id = cuaca.id;
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
  data.num_of_iterations = dataClusteringResult.num_of_iterations;
  data.inertia = dataClusteringResult.inertia;

  //? Add Clustering
  const clustering = await _addClustering(data, form);

  //? Create New Clustering Result Data
  const newClusteringResult = dataClusteringResult.dataset.map((cuacaObj) => ({
    clustering_id: clustering.id,
    cuaca_id: cuacaObj.id,
    cluster: cuacaObj.cluster,
  }));

  //? Add Clustering Result
  await _addClusteringResult(newClusteringResult);

  // showAlert('K-Means clustering successfully clustered data cuaca', 'success');
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

export const elbowMethod = (dataCuaca, criteria, numberOfRuns, maxClusters) => {
  const results = [];
  // for (let k = 1; k <= maxClusters; k++) {
  for (let k = 2; k <= maxClusters; k++) {
    results.push(_dataClustering(dataCuaca, criteria, k, numberOfRuns));
  }

  console.log(results);

  return results.map((el) => el.inertia);
};

export const updateClustersName = async (
  clusteringId,
  clustersName,
  newClustersNameObj,
  newCentroidsObj,
  modal,
) => {
  //? Update clustering's centroid
  await _updateClusteringById(clusteringId, { centroids: JSON.stringify(newCentroidsObj) });

  //? Update clustering result's cluster
  await Promise.all(
    clustersName.map(async (cn) => {
      const data = { cluster: newClustersNameObj[cn] };
      await _updateClusteringResultClusterByClusteringId(clusteringId, cn, data);
    }),
  );

  //? Hide modal
  modal.hide();

  //? Show Alert
  delayAlert('Cluster name changed successfully', 'success');
};
