import app from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@buianhthang/nuxt',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/color-mode',
    '@nuxtjs/supabase',
    '@nuxtjs/i18n',
  ],

  colorMode: {
    preference: 'dark',
  },

  fonts: {
    families: [{ name: 'Cabin', provider: 'google' }],
  },

  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      fallbackLocale: 'en',
    },
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
      {
        code: 'vi',
        name: 'Tiếng Việt',
        file: 'vi.json',
      },
    ],
    // lazy: true,
    langDir: 'internationalization',
    defaultLocale: 'en',
  },

  supabase: {
    redirect: false,
  },

  runtimeConfig: {
    app: {
      name: app.displayName,
      description: app.description,
      homepage: app.homepage,
    },
  },
})
