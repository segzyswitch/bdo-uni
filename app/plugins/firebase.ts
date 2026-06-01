// plugins/firebase.ts
import { defineNuxtPlugin } from '#app'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();
	// console.log("Firebase Config:", config);
  const firebaseConfig = {
		apiKey: config.public.apiKey,
		authDomain: config.public.authDomain,
		projectId: config.public.projectId,
		storageBucket: config.public.storageBucket,
		messagingSenderId: config.public.messagingSenderId,
		appId: config.public.appId,
		measurementId: config.public.measurementId
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const auth = getAuth(app)

  return {
    provide: {
      db,
      auth
    }
  }
})
