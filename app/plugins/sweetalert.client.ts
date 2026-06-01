import Swal from 'sweetalert2';

const swalWithDefaults = Swal.mixin({
  customClass: {
    confirmButton: 'swal2-confirm-button',
    cancelButton: 'swal2-cancel-button'
  },
  buttonsStyling: false,
  confirmButtonColor: '#daa520',
  cancelButtonColor: '#dc3545',
  // showCancelButton: true,
  background: '#212121',
  color: '#efefef'
})

export default defineNuxtPlugin(() => {
  return {
    provide: {
      swal: swalWithDefaults
    }
  }
})