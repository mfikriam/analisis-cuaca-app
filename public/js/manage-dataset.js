/* eslint-disable */
import axios from 'axios';
import { delayAlert, showAlert } from './alert';

export const addNewDataset = async (modelName, data, form, modal) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/${modelName}`,
      data,
    });

    if (res.data.status === 'success') {
      const resObj = res.data.data[modelName];
      modal.hide();

      delayAlert(`Data ${modelName} has been added successfully`, 'success');
    }
  } catch (err) {
    form.classList.remove('was-validated');

    const arrValidationError = err.response.data.validationError;
    arrValidationError.forEach((el) => {
      showAlert(
        `${err.response.data.message}: <span class='fw-bold'>${el.message}</span>`,
        'danger',
      );
    });
  }
};