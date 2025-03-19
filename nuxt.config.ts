import { execSync } from 'child_process'
import Aura from '@primevue/themes/aura'
import app from './package.json'

const revision = execSync('git rev-parse --short HEAD').toString().trim()

const isProduction = process.env.NODE_ENV === 'production'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  build: {
    // fixing @babel/runtime issue in production build
    transpile: [...(isProduction ? ['@babel/runtime'] : [])],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
  ],

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

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    },
  },

  supabase: {
    redirect: false,
  },

  buildId: `v${app.version} (${revision})`,

  runtimeConfig: {
    app: {
      name: app.displayName,
      description: app.description,
      homepage: app.homepage,
    },
  },

  compatibilityDate: '2025-03-10',
})
