/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const delUserById = async (Modals, userId) => {
  try {
    Modals.forEach((el) => el.hide());
    console.log('this function is called');
  } catch (err) {
    showAlert(err.response.data.message, 'danger');
  }
};
