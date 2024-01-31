/* eslint-disable */
import '@babel/polyfill';
import { DataTable } from 'simple-datatables';
import Papa from 'papaparse';
import { login, logout } from './auth';
import {
  addNewData,
  updateDataById,
  delDataById,
  delAllDataByUserId,
  importData,
} from './manage-data';
import { replaceClustering } from './clustering';
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

      const checkboxes = addClusteringForm.querySelectorAll('[id^="criteria"]');
      const selectedCheckboxes = [];
      checkboxes.forEach((el) => {
        if (el.checked) selectedCheckboxes.push(el.value);
      });

      if (selectedCheckboxes.length > 0) {
        const kriteria_clustering = JSON.stringify(selectedCheckboxes);
        const dataObj = { jum_cluster, kriteria_clustering, user_id };

        replaceClustering(dataObj, addClusteringForm);
      } else {
        showAlert('Please select at least one criteria.', 'danger');
      }
    }
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
