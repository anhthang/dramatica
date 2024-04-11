// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@buianhthang/nuxt',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/color-mode',
    '@nuxtjs/supabase',
  ],

  colorMode: {
    preference: 'dark',
  },

  fonts: {
    families: [{ name: 'Cabin', provider: 'google' }],
  },

  supabase: {
    redirect: false,
  },

  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME,
      appDesc: process.env.APP_DESC,
      baseUrl: process.env.BASE_URL,
    },
  },
})
