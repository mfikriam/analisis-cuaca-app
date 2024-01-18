/* eslint-disable */
import '@babel/polyfill';
import { DataTable } from 'simple-datatables';
import { login, logout } from './auth';
import { addNewUser, updateUserById, delUserById } from './manage-user';
import { addNewData, updateDataById, delDataById } from './manage-data';
import { showAlert } from './alert';

//? DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.btn--logout');
const toggleSidebarBtn = document.querySelector('.toggle-sidebar-btn');

let modelName;

let userDataTable;
const userTable = document.querySelector('#user-table');
const addUserForm = document.querySelector('#form-add-user');
const updateUserBtns = document.querySelectorAll('.btn-update-user');
const delUserBtns = document.querySelectorAll('.btn--del-user');

const kecelakaanTable = document.querySelector('#kecelakaan-table');
const addKecelakaanForm = document.querySelector('#form-add-kecelakaan');
const updateKecelakaanBtns = document.querySelectorAll('.btn-update-kecelakaan');
const delKecelakaanBtns = document.querySelectorAll('.btn-del-kecelakaan');

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
if (userTable) {
  const options = {
    perPage: 5,
    columns: [
      { select: [3, 4], type: 'date', format: 'D MMM YYYY, HH.mm.ss' },
      { select: 5, sortable: false },
    ],
  };
  userDataTable = new DataTable(userTable, options);
}

if (addUserForm) {
  const addUserModal = document.querySelector('#modal-add-obj');
  const bsAddUserModal = new bootstrap.Modal(addUserModal);

  addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addUserForm.classList.add('was-validated');

    if (addUserForm.checkValidity()) {
      const email = addUserForm.querySelector('#add-email').value;
      const password = addUserForm.querySelector('#add-password').value;
      const fullname = addUserForm.querySelector('#add-fullname').value;
      addNewUser({ email, password, fullname }, addUserForm, bsAddUserModal);
    }
  });
}

if (updateUserBtns.length > 0) {
  const updateUserModalList = document.querySelectorAll('[id^="modal-update-obj"]');
  const bsUpdateUserModalList = Array.from(updateUserModalList).map(
    (el) => new bootstrap.Modal(el),
  );

  const updateUserFormList = document.querySelectorAll('[id^="form-update-user"]');

  updateUserFormList.forEach((form) => {
    const formId = form.id;
    const userId = formId.match(/\d+/)[0];

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.add('was-validated');

      if (form.checkValidity()) {
        const email = form.querySelector(`#update-email-${userId}`).value;
        const fullname = form.querySelector(`#update-fullname-${userId}`).value;
        updateUserById({ email, fullname }, form, bsUpdateUserModalList, userId);
      }
    });
  });
}

if (delUserBtns.length > 0) {
  const delUserModalList = document.querySelectorAll('[id^="modal-delete-obj"]');
  const bsDelUserModalList = Array.from(delUserModalList).map((el) => new bootstrap.Modal(el));

  delUserBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const userId = btn.dataset.objId;
      delUserById(bsDelUserModalList, userId, userDataTable);
    });
  });
}

//***************** Manage Dataset Kecelakaan Page ******************* */
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

//************************** MUST BE IN THE LAST LINE ********************************** */
const delayAlertMsg = sessionStorage.getItem('delay-alert-message');
const delayAlertType = sessionStorage.getItem('delay-alert-type');
if (delayAlertMsg) {
  showAlert(delayAlertMsg, delayAlertType);
  sessionStorage.removeItem('delay-alert-message');
  sessionStorage.removeItem('delay-alert-type');
}
