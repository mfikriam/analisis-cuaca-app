/* eslint-disable */

export const delayAlert = (message, type) => {
  window.location.reload();

  showAlert(message, type);
};

export const hideAlert = (el) => {
  if (el) el.remove();
};

export const showAlert = (message, type) => {
  const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

  const wrapper = document.createElement('div');
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>',
  ].join('');

  alertPlaceholder.append(wrapper);

  // Close the alert after 5 seconds
  setTimeout(() => {
    hideAlert(wrapper);
  }, 5000);
};
