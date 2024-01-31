/* eslint-disable */
import axios from 'axios';
import { delayAlert, showAlert, validationErrorAlert } from './alert';

const _kMeansClustering = (dataset, k) => {
  k *= 1; //? Convert k to number type
  const ids = ['clustering_id', 'cuaca_id'];

  dataset.forEach((data) => {
    const randomNumber = Math.floor(Math.random() * k) + 1;
    data.cluster = `cluster_${randomNumber}`;
  });

  return dataset;
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

  //? Add Clustering Data
  const clustering = await _addClustering(data, form);

  //? Filter Data Cuaca
  const criteria = JSON.parse(data.kriteria_clustering);
  const filteredCuacaArr = cuacaArr.map((cuaca) => {
    const obj = {};
    obj.cuaca_id = cuaca.id;
    obj.clustering_id = clustering.id;
    criteria.forEach((el) => {
      obj[el] = cuaca[el];
    });
    return obj;
  });

  //? K-Means Clustering
  const kMeansResult = _kMeansClustering(filteredCuacaArr, data.jum_cluster);

  //? Filter K-Means Result
  const clusteringResultFilter = ['clustering_id', 'cuaca_id', 'cluster'];
  const filteredClusteringResult = kMeansResult.map((clusteringResult) => {
    const obj = {};
    clusteringResultFilter.forEach((el) => {
      obj[el] = clusteringResult[el];
    });
    return obj;
  });

  //? Add Clustering Result Data
  await _addClusteringResult(filteredClusteringResult);

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
