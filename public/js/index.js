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
import { replaceClustering, deleteAllClusteringResult } from './clustering';
import { showAlert } from './alert';

//? DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.btn--logout');
const toggleSidebarBtn = document.querySelector('.toggle-sidebar-btn');

let inputData;

const userTable = document.querySelector('#user-table');
const addUserForm = document.querySelector('#form-add-user');
const updateUserBtns = document.querySelectorAll('.btn-update-user');
const delUserBtns = document.querySelectorAll('.btn-del-user');

const kecelakaanTable = document.querySelector('#kecelakaan-table');
const addKecelakaanForm = document.querySelector('#form-add-kecelakaan');
const updateKecelakaanBtns = document.querySelectorAll('.btn-update-kecelakaan');
const delKecelakaanBtns = document.querySelectorAll('.btn-del-kecelakaan');
const delAllKecelakaanBtn = document.querySelector('.btn-del-all-kecelakaan');
const importDataKecelakaanForm = document.querySelector('#form-import-data-kecelakaan');

const wisatawanTable = document.querySelector('#wisatawan-table');
const addWisatawanForm = document.querySelector('#form-add-wisatawan');
const updateWisatawanBtns = document.querySelectorAll('.btn-update-wisatawan');
const delWisatawanBtns = document.querySelectorAll('.btn-del-wisatawan');
const delAllWisatawanBtn = document.querySelector('.btn-del-all-wisatawan');
const importDataWisatawanForm = document.querySelector('#form-import-data-wisatawan');

const cuacaTable = document.querySelector('#cuaca-table');
const addCuacaForm = document.querySelector('#form-add-cuaca');
const updateCuacaBtns = document.querySelectorAll('.btn-update-cuaca');
const delCuacaBtns = document.querySelectorAll('.btn-del-cuaca');
const delAllCuacaBtn = document.querySelector('.btn-del-all-cuaca');
const importDataCuacaForm = document.querySelector('#form-import-data-cuaca');

const clusteringResultTable = document.querySelector('#clustering-result-table');
const addClusteringForm = document.querySelector('#form-add-clustering');
const delAllClusteringResultBtn = document.querySelector('.btn-del-all-clustering-result');
const chartClusterModel = document.querySelector('#chart-cluster-model');
const chartCentroids = document.querySelector('#chart-centroids');

const chartAnalisis = document.querySelector('#chart-analisis');
const plotDataBtns = document.querySelectorAll('.btn-switch-plot-data');

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

      if (form.checkValidity()) {
        const dataObj = {};
        inputData.forEach((data) => {
          dataObj[data] = form.querySelector(`#update-${data}-${objId}`).value;
        });
        updateDataById(modelName, objId, dataObj, form, bsUpdateDataModalList);
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
      delDataById(modelName, objId, bsDelDataModalList);
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

const _plotChart = (chartEl, type, labels, datasets) => {
  //? Generate Chart
  return new Chart(chartEl, {
    type,
    data: {
      labels,
      datasets,
    },
  });
};

const _updateChart = (chart, labels, datasets) => {
  chart.data.labels = labels;
  chart.data.datasets = datasets;
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

//? Add and Replace Data
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

//? Cluster Model Chart
if (chartClusterModel) {
  //? Get Clusters Array
  const clusterArrString = chartClusterModel.dataset.clustersArr;
  const clusterArr = JSON.parse(clusterArrString);

  //? Count each cluster
  const countCluster = new Map();
  clusterArr.forEach((value) => {
    if (countCluster.has(value)) {
      countCluster.set(value, countCluster.get(value) + 1);
    } else {
      countCluster.set(value, 1);
    }
  });
  const clusters = Array.from(countCluster.entries()).map(([value, count]) => ({ value, count }));

  //? Sort the cluster
  clusters.sort((a, b) => a.value.localeCompare(b.value));

  //? Plot Cluster Model
  const clusterModelLabels = clusters.map((el) => el.value);
  const clusterModelDatasets = [
    {
      label: 'Count',
      data: clusters.map((el) => el.count),
      hoverOffset: 4,
    },
  ];
  _plotChart(chartClusterModel, 'pie', clusterModelLabels, clusterModelDatasets);
}

if (chartCentroids) {
  //? Get Centroids & Criteria
  const centroidsString = chartCentroids.dataset.centroids;
  const centroids = JSON.parse(centroidsString);
  const criteriaString = chartCentroids.dataset.criteria;
  const criteria = JSON.parse(criteriaString);

  //? Get Clusters Name
  const clustersName = Object.keys(centroids);
  console.log(centroids);

  //? Plot Centroids
  const centroidsDatasets = [];
  clustersName.forEach((cn) => {
    const dataArr = criteria.map((crit) => centroids[cn][crit]);
    centroidsDatasets.push({
      label: cn,
      data: dataArr,
      fill: false,
      tension: 0.1,
    });
  });

  _plotChart(chartCentroids, 'line', criteria, centroidsDatasets);
}

//***************** Analisis Page ******************* */
//? Cluster Model Chart
if (chartAnalisis) {
  const defaultLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  const defaultDatasets = [
    {
      label: '',
      // data: [65, 59, 80, 81, 56, 55, 40, 19, 23, 42, 38, 98],
      fill: false,
      borderColor: '#fff',
      backgroundColor: '#fff',
      tension: 0.1,
    },
  ];

  const analisisChart = _plotChart(chartAnalisis, 'line', defaultLabels, defaultDatasets);

  //? Add Plot Data
  if (plotDataBtns) {
    let analisisLabels = [];
    let analisisDatasets = [];
    const colorPalette = [
      '#8cdaec',
      '#836394',
      '#d48c84',
      '#3cb464',
      '#d6cfa2',
      '#a89a49',
      '#9bddb1',
      '#b45248',
      '#643c6a',
      '#167288',
    ];

    plotDataBtns.forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        const attrName = this.id;
        const formattedAttrName = attrName
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
        const attrData = JSON.parse(this.dataset.attrData);
        const attrLabel = attrData.map((el) => el.tanggal);

        //? Check if switch is on
        if (this.checked) {
          if (attrLabel.length > analisisLabels.length) {
            analisisLabels = attrLabel;
          }

          const color = colorPalette.pop();

          if (attrName === 'cluster') {
            analisisDatasets.push({
              label: formattedAttrName,
              data: attrData.map((el) => el[attrName].match(/\d+/)[0]),
              fill: false,
              borderColor: color,
              backgroundColor: color,
              tension: 0.1,
            });
          } else {
            analisisDatasets.push({
              label: formattedAttrName,
              data: attrData.map((el) => el[attrName]),
              fill: false,
              borderColor: color,
              backgroundColor: color,
              tension: 0.1,
            });
          }

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
}

//************************** MUST BE IN THE LAST LINE ********************************** */
const delayAlertMsg = sessionStorage.getItem('delay-alert-message');
const delayAlertType = sessionStorage.getItem('delay-alert-type');
if (delayAlertMsg) {
  showAlert(delayAlertMsg, delayAlertType);
  sessionStorage.removeItem('delay-alert-message');
  sessionStorage.removeItem('delay-alert-type');
}
