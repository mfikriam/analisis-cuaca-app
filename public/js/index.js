/* eslint-disable */
import '@babel/polyfill';
import { login } from './login';

//? DOM ELEMENTS
const loginForm = document.querySelector('.form--login');

//? EVENT LISTENERS
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginForm.classList.add('was-validated');

    if (loginForm.checkValidity()) {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      console.log(`email: ${email}, password: ${password}`);
      login(email, password);
    }
  });
}
