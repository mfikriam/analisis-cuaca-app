/* eslint-disable */
import axios from 'axios';
import { delayAlert, showAlert, validationErrorAlert } from './alert';

export const addNewData = async (modelName, data, form, modal) => {
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
    validationErrorAlert(err);
  }
};

export const updateDataById = async (modelName, objId, data, form, Modals) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/${modelName}/${objId}`,
      data,
    });

    if (res.data.status === 'success') {
      const resObj = res.data.data[modelName];
      Modals.forEach((el) => el.hide());

      delayAlert(`Data ${modelName} updated successfully`, 'success');
    }
  } catch (err) {
    form.classList.remove('was-validated');
    validationErrorAlert(err);
  }
};

export const delDataById = async (modelName, objId, Modals) => {
  try {
    Modals.forEach((el) => el.hide());

    await axios({
      method: 'DELETE',
      url: `/api/v1/${modelName}/${objId}`,
    });

    delayAlert(`Data ${modelName} deleted successfully`, 'success');
  } catch (err) {
    showAlert(err.response.data.message, 'danger');
  }
};

export const delAllDataByUserId = async (modelName, userId, modal) => {
  try {
    modal.hide();

    await axios({
      method: 'DELETE',
      url: `/api/v1/${modelName}/purge/${userId}`,
    });

    delayAlert(`All ${modelName}'s data deleted successfully`, 'success');
  } catch (err) {
    showAlert(err.response.data.message, 'danger');
  }
};

export const importData = async (modelName, data, form, modal) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/${modelName}/many`,
      data,
    });

    if (res.data.status === 'success') {
      modal.hide();
      delayAlert(`Data ${modelName} has been imported successfully`, 'success');
    }
  } catch (err) {
    form.classList.remove('was-validated');
    validationErrorAlert(err);
  }
};