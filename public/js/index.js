/* eslint-disable */
import '@babel/polyfill';
import { DataTable } from 'simple-datatables';
import { login, logout } from './auth';
import { addNewData, updateDataById, delDataById, delAllDataByUserId } from './manage-data';
import { showAlert } from './alert';

//? DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.btn--logout');
const toggleSidebarBtn = document.querySelector('.toggle-sidebar-btn');

let modelName;

const userTable = document.querySelector('#user-table');
const addUserForm = document.querySelector('#form-add-user');
const updateUserBtns = document.querySelectorAll('.btn-update-user');
const delUserBtns = document.querySelectorAll('.btn-del-user');

const kecelakaanTable = document.querySelector('#kecelakaan-table');
const addKecelakaanForm = document.querySelector('#form-add-kecelakaan');
const updateKecelakaanBtns = document.querySelectorAll('.btn-update-kecelakaan');
const delKecelakaanBtns = document.querySelectorAll('.btn-del-kecelakaan');
const delAllKecelakaanBtn = document.querySelector('.btn-del-all');

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
  modelName = 'user';
  const addDataModal = document.querySelector('#modal-add-obj');
  const bsAddDataModal = new bootstrap.Modal(addDataModal);

  addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addUserForm.classList.add('was-validated');

    if (addUserForm.checkValidity()) {
      const email = addUserForm.querySelector('#add-email').value;
      const password = addUserForm.querySelector('#add-password').value;
      const fullname = addUserForm.querySelector('#add-fullname').value;
      addNewData(modelName, { email, password, fullname }, addUserForm, bsAddDataModal);
    }
  });
}

//? Update Data
if (updateUserBtns.length > 0) {
  modelName = 'user';
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
        const email = form.querySelector(`#update-email-${objId}`).value;
        const fullname = form.querySelector(`#update-fullname-${objId}`).value;
        updateDataById(modelName, objId, { email, fullname }, form, bsUpdateDataModalList);
      }
    });
  });
}

//? Delete Data
if (delUserBtns.length > 0) {
  modelName = 'user';
  const delDataModalList = document.querySelectorAll('[id^="modal-delete-obj"]');
  const bsDelDataModalList = Array.from(delDataModalList).map((el) => new bootstrap.Modal(el));

  delUserBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const objId = btn.dataset.objId;
      delDataById(modelName, objId, bsDelDataModalList);
    });
  });
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
  modelName = 'kecelakaan';
  const addDataModal = document.querySelector('#modal-add-obj');
  const bsAddDataModal = new bootstrap.Modal(addDataModal);

  addKecelakaanForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addKecelakaanForm.classList.add('was-validated');

    if (addKecelakaanForm.checkValidity()) {
      const user_id = addKecelakaanForm.querySelector('#add-user_id').value;
      const tanggal = addKecelakaanForm.querySelector('#add-tanggal').value;
      const jum_kecelakaan = addKecelakaanForm.querySelector('#add-jum_kecelakaan').value;
      addNewData(
        modelName,
        { tanggal, jum_kecelakaan, user_id },
        addKecelakaanForm,
        bsAddDataModal,
      );
    }
  });
}

//? Update Data
if (updateKecelakaanBtns.length > 0) {
  modelName = 'kecelakaan';
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
        const tanggal = form.querySelector(`#update-tanggal-${objId}`).value;
        const jum_kecelakaan = form.querySelector(`#update-jum_kecelakaan-${objId}`).value;
        updateDataById(modelName, objId, { tanggal, jum_kecelakaan }, form, bsUpdateDataModalList);
      }
    });
  });
}

//? Delete Data
if (delKecelakaanBtns.length > 0) {
  modelName = 'kecelakaan';
  const delDataModalList = document.querySelectorAll('[id^="modal-delete-obj"]');
  const bsDelDataModalList = Array.from(delDataModalList).map((el) => new bootstrap.Modal(el));

  delKecelakaanBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const objId = btn.dataset.objId;
      delDataById(modelName, objId, bsDelDataModalList);
    });
  });
}

//? Delete All Data
if (delAllKecelakaanBtn) {
  modelName = 'kecelakaan';
  const delAllDataModal = document.querySelector('#modal-del-all');
  const bsDelAllDataModal = new bootstrap.Modal(delAllDataModal);

  delAllKecelakaanBtn.addEventListener('click', () => {
    const userId = delAllKecelakaanBtn.dataset.userId;
    delAllDataByUserId(modelName, userId, bsDelAllDataModal);
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
