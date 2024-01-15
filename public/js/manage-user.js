/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const delUserById = async (modal, userId) => {
  try {
    modal.hide();
    console.log('userId', userId);
  } catch (err) {
    showAlert(err.response.data.message, 'danger');
  }
};
