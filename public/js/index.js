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
const delAllKecelakaanBtn = document.querySelector('.btn-del-all');
const importDataKecelakaanForm = document.querySelector('#form-import-data-kecelakaan');

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

//************************** MUST BE IN THE LAST LINE ********************************** */
const delayAlertMsg = sessionStorage.getItem('delay-alert-message');
const delayAlertType = sessionStorage.getItem('delay-alert-type');
if (delayAlertMsg) {
  showAlert(delayAlertMsg, delayAlertType);
  sessionStorage.removeItem('delay-alert-message');
  sessionStorage.removeItem('delay-alert-type');
}
