/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

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
