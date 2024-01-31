/* eslint-disable */
import axios from 'axios';
import { delayAlert, showAlert, validationErrorAlert } from './alert';

export const replaceClustering = async (data, form) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/clustering`,
      data,
    });

    if (res.data.status === 'success') {
      delayAlert('K-Means clustering successfully clustered data cuaca', 'success');
    }
  } catch (err) {
    form.classList.remove('was-validated');
    validationErrorAlert(err);
  }
};
