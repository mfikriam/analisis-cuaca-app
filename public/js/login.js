/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password, form) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('Logged in successfully!', 'success');
      window.setTimeout(() => {
        location.href = '/dashboard';
      }, 1500);
    }
  } catch (err) {
    form.classList.remove('was-validated');
    showAlert(err.response.data.message, 'danger');
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      window.location.href = '/login';
    }
  } catch (err) {
    console.log(err.response.data.message);
    showAlert(err.response.data.message, 'danger');
  }
};
