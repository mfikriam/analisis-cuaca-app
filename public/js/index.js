/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';

//? DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.btn--logout');

//? EVENT LISTENERS
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

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}
