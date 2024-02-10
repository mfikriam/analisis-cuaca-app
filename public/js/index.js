/* eslint-disable */
import '@babel/polyfill';
import { DataTable } from 'simple-datatables';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';

import { login, logout } from './auth';
import {
  addNewData,
  updateDataById,
  delDataById,
  delAllDataByUserId,
  importData,
} from './manage-data';
import {
  replaceClustering,
  deleteAllClusteringResult,
  elbowMethod,
  updateClustersName,
} from './clustering';
import { showAlert } from './alert';

//? DOM ELEMENTS
const loginForm = document.querySelector('.form-login');
const logOutBtn = document.querySelector('.btn-logout');
const toggleSidebarBtn = document.querySelector('.toggle-sidebar-btn');

let inputData;

// Manage Data User
const userTable = document.querySelector('#user-table');
const addUserForm = document.querySelector('#form-add-user');
const updateUserBtns = document.querySelectorAll('.btn-update-user');
const delUserBtns = document.querySelectorAll('.btn-del-user');

// Manage Data Kecelakaan
const kecelakaanTable = document.querySelector('#kecelakaan-table');
const addKecelakaanForm = document.querySelector('#form-add-kecelakaan');
const updateKecelakaanBtns = document.querySelectorAll('.btn-update-kecelakaan');
const delKecelakaanBtns = document.querySelectorAll('.btn-del-kecelakaan');
const delAllKecelakaanBtn = document.querySelector('.btn-del-all-kecelakaan');
const importDataKecelakaanForm = document.querySelector('#form-import-data-kecelakaan');

// Manage Data Wisatawan
const wisatawanTable = document.querySelector('#wisatawan-table');
const addWisatawanForm = document.querySelector('#form-add-wisatawan');
const updateWisatawanBtns = document.querySelectorAll('.btn-update-wisatawan');
const delWisatawanBtns = document.querySelectorAll('.btn-del-wisatawan');
const delAllWisatawanBtn = document.querySelector('.btn-del-all-wisatawan');
const importDataWisatawanForm = document.querySelector('#form-import-data-wisatawan');

// Manage Data Cuaca
const cuacaTable = document.querySelector('#cuaca-table');
const addCuacaForm = document.querySelector('#form-add-cuaca');
const updateCuacaBtns = document.querySelectorAll('.btn-update-cuaca');
const delCuacaBtns = document.querySelectorAll('.btn-del-cuaca');
const delAllCuacaBtn = document.querySelector('.btn-del-all-cuaca');
const importDataCuacaForm = document.querySelector('#form-import-data-cuaca');

// Clustering
const clusteringResultTable = document.querySelector('#clustering-result-table');
const addClusteringForm = document.querySelector('#form-add-clustering');
const updateClustersNameForm = document.querySelector('#form-update-clusters-name');
const elbowMethodForm = document.querySelector('#form-elbow-method');
const delAllClusteringResultBtn = document.querySelector('.btn-del-all-clustering-result');
const chartClusteringResult = document.querySelector('#chart-clustering-result');
const chartClustersCount = document.querySelector('#chart-clusters-count');
const chartCentroids = document.querySelector('#chart-centroids');
const chartElbowMethod = document.querySelector('#chart-elbow-method');

// Analisis
const tanggalRange = document.querySelector('#tanggal-range');
const plotDataBtns = document.querySelectorAll('.btn-switch-plot-data');
const predictionDataBtns = document.querySelectorAll('.btn-switch-prediction-data');
const chartAnalisis = document.querySelector('#chart-analisis');
const chartPrediction = document.querySelector('#chart-prediction');

//***************** Static Functions ******************* */
const _addData = (modelName, form, inputData) => {
  const addDataModal = document.querySelector('#modal-add-obj');
  const bsAddDataModal = new bootstrap.Modal(addDataModal);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('was-validated');

    if (form.checkValidity()) {
      const dataObj = {};
      inputData.forEach((data) => {
        dataObj[data] = form.querySelector(`#add-${data}`).value;
      });
      addNewData(modelName, dataObj, form, bsAddDataModal);
    }
  });
};

const _updateData = (modelName, inputData) => {
  const updateDataModalList = document.querySelectorAll('[id^="modal-update-obj"]');
  const bsUpdateDataModalList = Array.from(updateDataModalList).map(
    (el) => new bootstrap.Modal(el),
  );
  const updateDataFormList = document.querySelectorAll(`[id^="form-update-${modelName}"]`);

  updateDataFormList.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.add('was-validated');
      const objId = form.dataset.objId;
      const userId = form.dataset.userId;

      if (form.checkValidity()) {
        const dataObj = {};
        inputData.forEach((data) => {
          dataObj[data] = form.querySelector(`#update-${data}-${objId}`).value;
        });
        updateDataById(modelName, objId, dataObj, form, bsUpdateDataModalList, userId);
      }
    });
  });
};

const _deleteData = (modelName, btnList) => {
  const delDataModalList = document.querySelectorAll('[id^="modal-delete-obj"]');
  const bsDelDataModalList = Array.from(delDataModalList).map((el) => new bootstrap.Modal(el));

  btnList.forEach((btn) => {
    btn.addEventListener('click', () => {
      const objId = btn.dataset.objId;
      const userId = btn.dataset.userId;
      delDataById(modelName, objId, bsDelDataModalList, userId);
    });
  });
};

const _deleteAllData = (modelName, btn) => {
  const delAllDataModal = document.querySelector('#modal-del-all');
  const bsDelAllDataModal = new bootstrap.Modal(delAllDataModal);

  btn.addEventListener('click', () => {
    const userId = btn.dataset.userId;
    delAllDataByUserId(modelName, userId, bsDelAllDataModal);
  });
};

const _importDataCSV = (modelName, form, inputData) => {
  const importDataModal = document.querySelector('#modal-import-data');
  const bsImportDataModal = new bootstrap.Modal(importDataModal);

  const userId = form.dataset.userId;
  let csvData;

  const csvFileInput = form.querySelector('#csvFileInput');
  csvFileInput.addEventListener('change', (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.csv')) {
        Papa.parse(selectedFile, {
          complete: function (results) {
            // Access the parsed CSV data
            csvData = results.data;
          },
          header: true, // Treat the first row as headers
        });
      } else {
        showAlert('Please choose .csv file', 'danger');
        csvFileInput.value = '';
      }
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('was-validated');

    if (form.checkValidity()) {
      const objList = [];
      csvData.forEach((obj) => {
        const keys = Object.keys(obj);

        const dataObj = {};
        inputData.forEach((data, index) => {
          dataObj[data] = obj[keys[index]];
        });
        dataObj.user_id = userId;

        objList.push(dataObj);
      });

      importData(modelName, objList, form, bsImportDataModal);
    }
  });
};

const _plotChart = (chartEl, type, labels, datasets, options = {}) => {
  //? Generate Chart
  return new Chart(chartEl, {
    type,
    data: {
      labels,
      datasets,
    },
    options,
  });
};

const _updateChart = (chart, labels, datasets, options = undefined) => {
  chart.data.labels = labels;
  chart.data.datasets = datasets;
  if (options) chart.options = options;
  chart.update();
};

//? EVENT LISTENERS
//***************** Login Page ******************* */
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginForm.classList.add('was-validated');

    if (loginForm.checkValidity()) {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password, loginForm);
    }
  });
}

//***************** Navbar ******************* */
if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (toggleSidebarBtn) {
  toggleSidebarBtn.addEventListener('click', () => {
    document.querySelector('body').classList.toggle('toggle-sidebar');
  });
}

//***************** Manage User Page ******************* */
//? Datatables
if (userTable) {
  const options = {
    perPage: 5,
    columns: [
      { select: [3, 4], type: 'date', format: 'D MMM YYYY, HH.mm.ss' },
      { select: 5, sortable: false },
    ],
  };
  new DataTable(userTable, options);
}

//? Add Data
if (addUserForm) {
  inputData = ['email', 'password', 'fullname'];
  _addData('user', addUserForm, inputData);
}

//? Update Data
if (updateUserBtns.length > 0) {
  inputData = ['email', 'fullname'];
  _updateData('user', inputData);
}

//? Delete Data
if (delUserBtns.length > 0) {
  _deleteData('user', delUserBtns);
}

//***************** Manage Dataset Kecelakaan Page ******************* */
//? Datatables
if (kecelakaanTable) {
  const kecelakaanTableOptions = {
    perPage: 10,
    columns: [
      { select: 0, type: 'date', format: 'MMM YYYY' },
      { select: 2, sortable: false },
    ],
  };
  new DataTable(kecelakaanTable, kecelakaanTableOptions);
}

//? Add Data
if (addKecelakaanForm) {
  inputData = ['user_id', 'tanggal', 'jum_kecelakaan'];
  _addData('kecelakaan', addKecelakaanForm, inputData);
}

//? Update Data
if (updateKecelakaanBtns.length > 0) {
  inputData = ['tanggal', 'jum_kecelakaan'];
  _updateData('kecelakaan', inputData);
}

//? Delete Data
if (delKecelakaanBtns.length > 0) {
  _deleteData('kecelakaan', delKecelakaanBtns);
}

//? Delete All Data
if (delAllKecelakaanBtn) {
  _deleteAllData('kecelakaan', delAllKecelakaanBtn);
}

//? Import Data
if (importDataKecelakaanForm) {
  inputData = ['tanggal', 'jum_kecelakaan'];
  _importDataCSV('kecelakaan', importDataKecelakaanForm, inputData);
}

//***************** Manage Dataset Wisatawan Page ******************* */
//? Datatables
if (wisatawanTable) {
  const wisatawanTableOptions = {
    perPage: 10,
    columns: [
      { select: 0, type: 'date', format: 'MMM YYYY' },
      { select: 3, sortable: false },
    ],
  };
  new DataTable(wisatawanTable, wisatawanTableOptions);
}

//? Add Data
if (addWisatawanForm) {
  inputData = ['user_id', 'tanggal', 'jum_wisnus', 'jum_wisman'];
  _addData('wisatawan', addWisatawanForm, inputData);
}

//? Update Data
if (updateWisatawanBtns.length > 0) {
  inputData = ['tanggal', 'jum_wisnus', 'jum_wisman'];
  _updateData('wisatawan', inputData);
}

//? Delete Data
if (delWisatawanBtns.length > 0) {
  _deleteData('wisatawan', delWisatawanBtns);
}

//? Delete All Data
if (delAllWisatawanBtn) {
  _deleteAllData('wisatawan', delAllWisatawanBtn);
}

//? Import Data
if (importDataWisatawanForm) {
  inputData = ['tanggal', 'jum_wisnus', 'jum_wisman'];
  _importDataCSV('wisatawan', importDataWisatawanForm, inputData);
}

//***************** Manage Dataset Cuaca Page ******************* */
//? Datatables
if (cuacaTable) {
  const cuacaTableOptions = {
    perPage: 10,
    columns: [
      { select: 0, type: 'date', format: 'MMM YYYY' },
      { select: 7, sortable: false },
    ],
  };
  new DataTable(cuacaTable, cuacaTableOptions);
}

//? Add Data
if (addCuacaForm) {
  inputData = [
    'user_id',
    'tanggal',
    'temperatur_avg',
    'kelembaban_avg',
    'kecepatan_angin_avg',
    'jum_curah_hujan',
    'jum_hari_hujan',
    'penyinaran_matahari_avg',
  ];
  _addData('cuaca', addCuacaForm, inputData);
}

//? Update Data
if (updateCuacaBtns.length > 0) {
  inputData = [
    'tanggal',
    'temperatur_avg',
    'kelembaban_avg',
    'kecepatan_angin_avg',
    'jum_curah_hujan',
    'jum_hari_hujan',
    'penyinaran_matahari_avg',
  ];
  _updateData('cuaca', inputData);
}

//? Delete Data
if (delCuacaBtns.length > 0) {
  _deleteData('cuaca', delCuacaBtns);
}

//? Delete All Data
if (delAllCuacaBtn) {
  _deleteAllData('cuaca', delAllCuacaBtn);
}

//? Import Data
if (importDataCuacaForm) {
  inputData = [
    'tanggal',
    'temperatur_avg',
    'kelembaban_avg',
    'kecepatan_angin_avg',
    'jum_curah_hujan',
    'jum_hari_hujan',
    'penyinaran_matahari_avg',
  ];
  _importDataCSV('cuaca', importDataCuacaForm, inputData);
}

//***************** Clustering / Clustering Result Page ******************* */
//? Datatables
if (clusteringResultTable) {
  const clusteringResultTableOptions = {
    perPage: 10,
    columns: [{ select: 0, type: 'date', format: 'MMM YYYY' }],
  };
  new DataTable(clusteringResultTable, clusteringResultTableOptions);
}

//? Add Clustering Form
if (addClusteringForm) {
  addClusteringForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addClusteringForm.classList.add('was-validated');

    if (addClusteringForm.checkValidity()) {
      const user_id = addClusteringForm.querySelector('#add-user_id').value;
      const jum_cluster = addClusteringForm.querySelector('#add-jum_cluster').value;
      const jum_percobaan = addClusteringForm.querySelector('#add-jum_percobaan').value;

      const checkboxes = addClusteringForm.querySelectorAll('[id^="criteria"]');
      const selectedCheckboxes = [];
      checkboxes.forEach((el) => {
        if (el.checked) selectedCheckboxes.push(el.value);
      });

      if (selectedCheckboxes.length > 0) {
        const kriteria_clustering = JSON.stringify(selectedCheckboxes);
        const dataObj = { jum_cluster, jum_percobaan, kriteria_clustering, user_id };

        replaceClustering(dataObj, addClusteringForm);
      } else {
        showAlert('Please select at least one criteria.', 'danger');
      }
    }
  });
}

//? Delete All Data
if (delAllClusteringResultBtn) {
  const delAllClusteringResultModal = document.querySelector('#modal-del-all-clustering-result');
  const bsDelAllClusteringResultModal = new bootstrap.Modal(delAllClusteringResultModal);

  delAllClusteringResultBtn.addEventListener('click', () => {
    const userId = delAllClusteringResultBtn.dataset.userId;
    deleteAllClusteringResult(userId, bsDelAllClusteringResultModal);
  });
}

//? Clusters Count Chart
if (chartClustersCount) {
  //? Get Clusters Array & Clusters Name
  const clustersArr = JSON.parse(chartClustersCount.dataset.clustersArr);
  const clustersName = JSON.parse(chartClustersCount.dataset.clustersName);

  //? Create Map Count Clusters
  const countClusters = new Map();
  clustersName.forEach((cn) => countClusters.set(cn, 0));

  //? Count each cluster
  clustersArr.forEach((cluster) => countClusters.set(cluster, countClusters.get(cluster) + 1));
  const clusters = Array.from(countClusters.entries()).map(([value, count]) => ({ value, count }));

  //? Plot Clusters Count
  const clustersCountLabels = clusters.map((el) => el.value);
  const clustersCountDatasets = [
    {
      label: 'Count',
      data: clusters.map((el) => el.count),
      hoverOffset: 4,
    },
  ];
  _plotChart(chartClustersCount, 'pie', clustersCountLabels, clustersCountDatasets);
}

//? Update Clusters Name Form
if (updateClustersNameForm) {
  //? Local Functions
  function _hasSpacesOrUppercase(inputString) {
    return inputString.includes(' ') || /[A-Z]/.test(inputString);
  }

  function _areValuesUnique(obj) {
    const valueSet = new Set();

    for (const key in obj) {
      const value = obj[key];

      // If the value is already in the set, it's not unique
      if (valueSet.has(value)) {
        return false;
      }

      // Add the value to the set
      valueSet.add(value);
    }

    // All values are unique
    return true;
  }

  //? Get Datasets
  const clustering = JSON.parse(updateClustersNameForm.dataset.clustering);
  const clusteringId = clustering.id;

  const centroids = JSON.parse(clustering.centroids);
  const clustersName = Object.keys(centroids);

  //? Get Elements
  const criteriaEl = document.querySelector('#update-clusters-name-criteria');
  const criteriaHeaderEl = document.querySelector('#update-clusters-name-criteria-header');
  const clustersNameElList = document.querySelectorAll('.clusters-name');
  const clustersNameSortByEL = document.querySelector('#update-clusters-sort-by');
  const updateClustersNameModal = document.querySelector('#modal-update-clusters-name');
  const bsUpdateClustersNameModal = new bootstrap.Modal(updateClustersNameModal);

  let criteria = criteriaEl[0].value;

  //? Add Event Listener To Criteria El
  criteriaEl.addEventListener('change', function (el) {
    //? Get its value
    criteria = el.target.value;

    //? Update Criteria Header
    criteriaHeaderEl.textContent = criteria
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    //? Update Criteria Values
    clustersName.forEach((cn) => {
      const criteriaValueEl = document.querySelector(`#update-clusters-name-criteria-value-${cn}`);
      criteriaValueEl.textContent = centroids[cn][criteria].toFixed(2);
    });
  });

  //? Form Submitted
  updateClustersNameForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (updateClustersNameForm.checkValidity()) {
      //? Create new clusters name object
      const newClustersNameObj = {};

      //? Create new clusters name
      let hasInvalidInput = false;
      clustersNameElList.forEach((el) => {
        if (_hasSpacesOrUppercase(el.value)) {
          showAlert('Invalid data: no spaces and no uppercase for clusters name', 'danger');
          hasInvalidInput = true;
          return;
        } else {
          newClustersNameObj[el.id] = 'cluster_' + el.value;
        }
      });

      //? Check if clusters name input data is valid
      if (hasInvalidInput) {
        return;
      }

      //? Check if clusters name is unique
      if (!_areValuesUnique(newClustersNameObj)) {
        showAlert('Duplicate data: clusters name must be unique', 'danger');
        return;
      }

      //? Create new centroids with new cluster name
      let newCentroidsObj = {};
      clustersName.forEach((cn) => {
        newCentroidsObj[newClustersNameObj[cn]] = centroids[cn];
      });

      //? Sorting new centroids obj based on selected criteria
      const clustersNameSortBy = clustersNameSortByEL.value;
      if (clustersNameSortBy === 'asc') {
        newCentroidsObj = Object.fromEntries(
          Object.entries(newCentroidsObj).sort(([, a], [, b]) => a[criteria] - b[criteria]),
        );
      } else {
        newCentroidsObj = Object.fromEntries(
          Object.entries(newCentroidsObj).sort(([, a], [, b]) => b[criteria] - a[criteria]),
        );
      }

      //? Update clusters name in database
      updateClustersName(
        clusteringId,
        clustersName,
        newClustersNameObj,
        newCentroidsObj,
        bsUpdateClustersNameModal,
      );
    }
  });
}

//? Centroids Chart
if (chartCentroids) {
  //? Get Centroids, Criteria, & Clusters Name
  const centroids = JSON.parse(chartCentroids.dataset.centroids);
  const criteria = JSON.parse(chartCentroids.dataset.criteria);
  const clustersName = JSON.parse(chartCentroids.dataset.clustersName);

  //? Plot Centroids
  const centroidsDatasets = [];
  clustersName.forEach((cn) => {
    const dataArr = criteria.map((crit) => centroids[cn][crit]);
    centroidsDatasets.push({
      label: cn,
      data: dataArr,
      fill: false,
      // tension: 0.1,
    });
  });

  _plotChart(chartCentroids, 'line', criteria, centroidsDatasets);
}

//? Clustering Result Chart
if (chartClusteringResult) {
  //? Local Functions
  const _updateClusteringResultChartData = (
    clustersName,
    clusteringResultDatasets,
    clusteringResult,
    centroids,
    criteria1,
    criteria2,
  ) => {
    //? Add Data Cuaca To Datasets
    clustersName.forEach((cn) => {
      clusteringResultDatasets.push({
        label: cn,
        data: clusteringResult
          .filter((cr) => cr.cluster === cn)
          .map((cr) => ({ x: cr[criteria1], y: cr[criteria2] })),
        pointRadius: 5,
        hoverRadius: 6,
      });
    });

    //? Add Centroids To Datasets
    clustersName.forEach((cn) => {
      clusteringResultDatasets.push({
        label: `centroids ${cn}`,
        data: [{ x: centroids[cn][criteria1], y: centroids[cn][criteria2] }],
        pointRadius: 9,
        hoverRadius: 10,
      });
    });
  };

  //? Get Criteria1 and Criteria2
  const criteria1El = document.querySelector('#cr-criteria-1');
  const criteria2El = document.querySelector('#cr-criteria-2');
  let criteria1 = criteria1El.value;
  let criteria2 = criteria2El.value;

  //? Get Clustering Result Data & Centroids
  const clusteringResult = JSON.parse(chartClusteringResult.dataset.clusteringResult);
  const centroids = JSON.parse(chartCentroids.dataset.centroids);
  const clustersName = JSON.parse(chartCentroids.dataset.clustersName);

  //? Initial Chart Config
  let clusteringResultLabels = [];
  let clusteringResultDatasets = [];
  let clusteringResultOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: criteria1.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
          font: {
            weight: 'bold',
          },
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: criteria2.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
        },
      },
    },
  };

  //? Updates Clustering Result Labels And Datasets
  _updateClusteringResultChartData(
    clustersName,
    clusteringResultDatasets,
    clusteringResult,
    centroids,
    criteria1,
    criteria2,
  );

  //? Initial Plot Clustering Result Chart
  const clusteringResultChart = _plotChart(
    chartClusteringResult,
    'scatter',
    clusteringResultLabels,
    clusteringResultDatasets,
    clusteringResultOptions,
  );

  //? Add Event Listener To Criteria El
  criteria1El.addEventListener('change', function (event) {
    //? Update criteria value
    criteria1 = event.target.value;

    //? Reset Clustering Result Labels And Datasets
    clusteringResultLabels = [];
    clusteringResultDatasets = [];

    //? Updates Clustering Result Labels And Datasets
    _updateClusteringResultChartData(
      clustersName,
      clusteringResultDatasets,
      clusteringResult,
      centroids,
      criteria1,
      criteria2,
    );

    //? Update Clustering Result Options
    clusteringResultOptions.scales.x.title.text = criteria1
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    //? Update Chart
    _updateChart(
      clusteringResultChart,
      clusteringResultLabels,
      clusteringResultDatasets,
      clusteringResultOptions,
    );
  });

  criteria2El.addEventListener('change', function (event) {
    //? Update criteria value
    criteria2 = event.target.value;

    //? Reset Clustering Result Labels And Datasets
    clusteringResultLabels = [];
    clusteringResultDatasets = [];

    //? Updates Clustering Result Labels And Datasets
    _updateClusteringResultChartData(
      clustersName,
      clusteringResultDatasets,
      clusteringResult,
      centroids,
      criteria1,
      criteria2,
    );

    //? Update Clustering Result Options
    clusteringResultOptions.scales.y.title.text = criteria2
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    //? Update Chart
    _updateChart(
      clusteringResultChart,
      clusteringResultLabels,
      clusteringResultDatasets,
      clusteringResultOptions,
    );
  });
}

//? Elbow Method Chart
if (chartElbowMethod) {
  let elbowMethodLabels = Array.from(Array(10).keys()).map((num) => num + 1);
  let elbowMethodDatasets = [
    {
      label: '',
      fill: false,
      borderColor: '#fff',
      backgroundColor: '#fff',
    },
  ];
  let elbowMethodOptions = {
    responsive: true,
    scales: {
      x: {
        position: 'bottom',
        title: {
          display: true,
          text: 'k',
          font: {
            weight: 'bold',
          },
        },
      },
    },
  };

  const elbowMethodChart = _plotChart(
    chartElbowMethod,
    'line',
    elbowMethodLabels,
    elbowMethodDatasets,
    elbowMethodOptions,
  );

  elbowMethodForm.addEventListener('submit', (e) => {
    e.preventDefault();
    elbowMethodForm.classList.add('was-validated');

    if (elbowMethodForm.checkValidity()) {
      //? Get Data
      const max_k = elbowMethodForm.querySelector('#max_k').value;
      const clusteringResult = JSON.parse(chartElbowMethod.dataset.clusteringResult);
      const clustering = JSON.parse(chartElbowMethod.dataset.clustering);

      const maxClusters = max_k * 1;
      const criteria = JSON.parse(clustering.kriteria_clustering);
      const numberOfRuns = clustering.jum_percobaan;

      //? Update Chart's Labels
      elbowMethodLabels = Array.from(Array(maxClusters).keys()).map((num) => num + 1);

      //? Update Chart's Datasets
      const elbowMethodResult = elbowMethod(clusteringResult, criteria, numberOfRuns, maxClusters);
      elbowMethodDatasets = [
        {
          label: 'Inertia',
          data: elbowMethodResult,
          fill: false,
        },
      ];

      //? Update Chart
      _updateChart(elbowMethodChart, elbowMethodLabels, elbowMethodDatasets, elbowMethodOptions);

      //? Show Alert
      showAlert('The elbow method successfully calculates all k values', 'success');
    }
  });
}

//***************** Analisis Page ******************* */
let analisisLabels = [
  'Jan 2024',
  'Feb 2024',
  'Mar 2024',
  'Apr 2024',
  'Mei 2024',
  'Jun 2024',
  'Jul 2024',
  'Agu 2024',
  'Sep 2024',
  'Okt 2024',
  'Nov 2024',
  'Des 2024',
];
let analisisDatasets = [
  {
    label: '',
    fill: false,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
];
let tanggalArr, tanggalSlider, analisisChart;

//? Add Tanggal Slider
if (tanggalRange) {
  //? Get array of tanggal
  tanggalArr = JSON.parse(tanggalRange.dataset.tanggalArr);

  //? Load default chart
  analisisChart = _plotChart(chartAnalisis, 'line', analisisLabels, analisisDatasets);
  if (tanggalArr.length > 0) {
    analisisLabels = tanggalArr;
    analisisDatasets = [];
  }

  //? Load Tanggal Range Slider
  tanggalSlider = new rSlider({
    target: tanggalRange,
    values: analisisLabels,
    range: true,
    scale: true,
    labels: false,
    tooltip: true,
    onChange: function (vals) {
      if (tanggalArr.length > 0) {
        //? Filter Labels
        const [minDate, maxDate] = vals.split(',');
        let inRanges = false;

        const filteredDates = [];
        tanggalArr.forEach((tanggal) => {
          if (tanggal === minDate) inRanges = true;
          if (inRanges) filteredDates.push(tanggal);
          if (tanggal === maxDate) inRanges = false;
        });

        //? Update Chart's Labels
        analisisLabels = filteredDates;

        //? Update Chart's Datasets
        analisisDatasets.forEach((el) => {
          el.data = el.original.filter((obj) => analisisLabels.includes(obj.x));
        });

        _updateChart(analisisChart, analisisLabels, analisisDatasets);
      }
    },
  });

  if (tanggalArr.length === 0) tanggalSlider.disabled(true);
}

//? Plot Dataset To Analisis Chart
if (plotDataBtns) {
  const colorPalette = [
    '#cddc39',
    '#8cdaec',
    '#795548',
    '#d48c84',
    '#3cb464',
    '#009688',
    '#8a4af3',
    '#ff9800',
    '#e91e63',
    '#2196f3',
  ];

  plotDataBtns.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      const attrName = this.id;
      const formattedAttrName = attrName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
      const attrData = JSON.parse(this.dataset.attrData);

      //? Check if switch is on
      if (this.checked) {
        const color = colorPalette.pop();

        analisisDatasets.push({
          label: formattedAttrName,
          data: attrData
            .filter((el) => analisisLabels.includes(el.tanggal))
            .map((el) => {
              return { x: el.tanggal, y: el[attrName] };
            }),
          original: attrData.map((el) => {
            return { x: el.tanggal, y: el[attrName] };
          }),
          fill: false,
          borderColor: color,
          backgroundColor: color,
        });

        //? Update Chart
        _updateChart(analisisChart, analisisLabels, analisisDatasets);
      } else {
        //? Remove attribute from datasets
        const newAnalisisDatasets = [];
        analisisDatasets.forEach((obj) => {
          if (obj.label !== formattedAttrName) {
            newAnalisisDatasets.push(obj);
          } else {
            //? Add the color back to the palette
            colorPalette.push(obj.backgroundColor);
          }
        });
        analisisDatasets = newAnalisisDatasets;

        //? Update Chart
        _updateChart(analisisChart, analisisLabels, analisisDatasets);
      }
    });
  });
}

//? Plot Dataset To Prediction Chart
if (predictionDataBtns.length > 0) {
  let predictionLabels = [
    'Jan 2024',
    'Feb 2024',
    'Mar 2024',
    'Apr 2024',
    'Mei 2024',
    'Jun 2024',
    'Jul 2024',
    'Agu 2024',
    'Sep 2024',
    'Okt 2024',
    'Nov 2024',
    'Des 2024',
  ];
  let predictionDatasets = [];
  let predictionOptions = {
    plugins: {
      title: {
        display: true,
        text: '',
      },
    },
    scales: {
      x: {
        type: 'category',
        position: 'bottom',
      },
      y: {
        type: 'linear',
        position: 'left',
      },
    },
  };

  const predictionChart = _plotChart(
    chartPrediction,
    'scatter',
    predictionLabels,
    predictionDatasets,
    predictionOptions,
  );

  predictionDataBtns.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      const attrName = this.id;
      const formattedAttrName = attrName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

      const predictionObj = JSON.parse(this.dataset.predictionObj);
      const predictionTanggalArr = JSON.parse(this.dataset.predictionTanggalArr);
      const clustersName = Object.keys(predictionObj);

      //? Check if switch is on
      if (this.checked) {
        //? Uncheck other switches
        predictionDataBtns.forEach(function (otherCheckbox) {
          if (otherCheckbox !== checkbox) {
            otherCheckbox.checked = false;
          }
        });

        predictionLabels = [...predictionTanggalArr];
        predictionDatasets = clustersName.map((cn) => {
          return {
            label: cn,
            data: predictionObj[cn].map((el) => {
              return { x: el.tanggal, y: el[attrName] };
            }),
            pointRadius: 5,
            hoverRadius: 6,
          };
        });
        predictionOptions.plugins.title.text = formattedAttrName;

        //? Update Chart
        _updateChart(predictionChart, predictionLabels, predictionDatasets, predictionOptions);
      } else {
        predictionDatasets = [];
        predictionOptions.plugins.title.text = '';

        //? Update Chart
        _updateChart(predictionChart, predictionLabels, predictionDatasets, predictionOptions);
      }
    });
  });
}

//************************** MUST BE IN THE LAST LINE ********************************** */
const delayAlertMsg = sessionStorage.getItem('delay-alert-message');
const delayAlertType = sessionStorage.getItem('delay-alert-type');
if (delayAlertMsg) {
  showAlert(delayAlertMsg, delayAlertType);
  sessionStorage.removeItem('delay-alert-message');
  sessionStorage.removeItem('delay-alert-type');
}
