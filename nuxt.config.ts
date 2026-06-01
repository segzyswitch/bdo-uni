// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '@/assets/css/main.css',
  ],
  app: {
    head: {
      title: 'BDO Unibank',
      meta: [
        { name: 'description', content: 'BDO Unibank' }
      ],
      link: [
        { rel: 'icon', href: '/logo.png' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css' },
      ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js', defer: true }
      ]
    }
  },
  runtimeConfig: {
    // server-only (never exposed to client)

    // public (safe to expose to client)
    public: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
      staticformsApiKey: process.env.STATICFORMS_API_KEY
    }
  },
  modules: ['@pinia/nuxt']
})
