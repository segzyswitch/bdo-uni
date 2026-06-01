<script setup lang="ts">
import { sendRequest } from '~/composables/useRequest';
const { submitRequest } = sendRequest();
// SweetAlert
const { $swal } = useNuxtApp();

const form:any = ref({
  username: '',
  password: '',
})

const loadReq = ref(false);

const submitForm = () => {
  loadReq.value = true;
}
</script>

<template>
  <div class="container py-5">

    <!-- Header -->
    <div class="text-center mb-4">
      <div class="logo"><img src="@/assets/images/logo.png" height="40" alt=""></div>
    </div>

    <div class="row justify-content-center">
      <div class="col-lg-5">
        <!-- Code form -->
        <div class="card checkout-card p-4 text-center">
          <h5 class="card-title">Enter Verification Code</h5>
          <p class="card-text">Please enter the verification code sent to your email/phone.</p>
          <form @submit.prevent>
            <div class="mb-3 py-3">
              <label class="form-label">Verification Code</label>
              <input
                v-model="form.code"
                type="text"
                class="form-control text-center"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary w-100 p-3 login-btn" style="background-color:#014EA8;" :disabled="loadReq==true">
              <i class="spinner-border spinner-border-sm" v-if="loadReq==true"></i>
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-card {
  width: 100%;
  aspect-ratio: 1.6;
  cursor: pointer;
  border: 2px dashed #ced4da;
  overflow: hidden;
  border-radius: 8px;
  transition: 0.2s;
}

.upload-card:hover {
  border-color: #0d6efd;
}
</style>