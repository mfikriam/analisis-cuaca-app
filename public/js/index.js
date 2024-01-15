/* eslint-disable */
import '@babel/polyfill';
import { DataTable } from 'simple-datatables';
import { login, logout } from './login';
// import { delUserById } from './manage-user';

//? DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.btn--logout');
const toggleSidebarBtn = document.querySelector('.toggle-sidebar-btn');
const userTable = document.querySelector('#user-table');
// const delUserBtn = document.querySelector('#btn--del-user');
// const trashUserBtns = document.querySelectorAll('.btn--trash-user');

//? EVENT LISTENERS
//***************** Login Page ******************* */
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginForm.classList.add('was-validated');

    if (loginForm.checkValidity()) {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
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
  const optios = {
    perPage: 5,
    columns: [
      { select: [3, 4], type: 'date', format: 'D MMM YYYY, HH.mm.ss' },
      { select: 5, sortable: false },
    ],
  };
  const dataTable = new DataTable(userTable, optios);
}

// if (delUserBtn) {
// const delUserModal = new bootstrap.Modal(document.querySelector('#staticBackdrop'), {});
// trashUserBtns.forEach((trashUserBtn) => {
//   trashUserBtn.addEventListener('click', () => {
//     // Access the data-user-id attribute using dataset
//     const userId = trashUserBtn.dataset.userId;
//     // Now 'userId' holds the value of the data-user-id attribute
//     console.log(userId);
//     // deleteUser(userId);
//   });
// });
// console.log(userId);
// delUserBtn.addEventListener('click', () => {
//   delUserById(delUserModal, userId);
// });
// }
