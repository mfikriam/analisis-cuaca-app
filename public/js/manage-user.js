/* eslint-disable */
import axios from 'axios';
import { delayAlert, showAlert } from './alert';

export const addNewUser = async (userObj, form, modal) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users',
      data: userObj,
    });

    if (res.data.status === 'success') {
      const userResult = res.data.data.user;
      modal.hide();

      delayAlert(`User ${userResult.fullname} has been added successfully`, 'success');
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

export const delUserById = async (Modals, userId, userDataTable) => {
  try {
    Modals.forEach((el) => el.hide());

    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/users/${userId}`,
    });

    //? Remove user data from datatable
    let targetTr;
    const trs = document.querySelectorAll('#user-table tbody tr');
    trs.forEach((tr) => {
      const td = tr.querySelector('td:first-child');
      if (td.textContent === userId) targetTr = tr;
    });
    userDataTable.rows.remove(targetTr.rowIndex - 1);

    showAlert('User successfully deleted!', 'success');
  } catch (err) {
    showAlert(err.response.data.message, 'danger');
  }
};
