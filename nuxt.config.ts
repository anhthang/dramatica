// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@buianhthang/nuxt', '@nuxtjs/google-fonts', '@nuxtjs/supabase'],

  googleFonts: {
    families: {
      Cabin: true,
    },
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
