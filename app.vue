<template>
  <a-config-provider :theme="themeCfg">
    <NuxtLayout name="desktop">
      <NuxtPage />
    </NuxtLayout>
  </a-config-provider>
</template>

<script setup>
import { theme } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const themeCfg = ref({
  algorithm: theme.defaultAlgorithm,
  token: {
    fontFamily: 'Cabin, sans-serif;',
  },
})

const colorMode = useColorMode()

const getAlgorithm = (preference) => {
  switch (preference) {
    case 'dark':
      return theme.darkAlgorithm
    case 'light':
      return theme.defaultAlgorithm
    default:
      return colorMode.value === 'dark'
        ? theme.darkAlgorithm
        : theme.defaultAlgorithm
  }
}

watch(
  () => colorMode.value,
  () => {
    themeCfg.value.algorithm = getAlgorithm(colorMode.preference)
  },
)

onMounted(() => {
  const preference = localStorage.getItem('nuxt-color-mode')
  themeCfg.value.algorithm = getAlgorithm(preference)
})

const user = useState('authenticated', () => undefined)
const getAuthUser = (authUser) => {
  const {
    app_metadata: { providers },
    id: uid,
    user_metadata: { email, email_verified, picture, name },
  } = authUser

  return {
    uid,
    email,
    email_verified,
    name,
    picture,
    providers,
  }
}

const config = useRuntimeConfig()

const client = useSupabaseClient()

client.auth.getSession().then(({ data }) => {
  if (data.session && data.session.user) {
    user.value = getAuthUser(data.session.user)
  }
})

client.auth.onAuthStateChange((event, session) => {
  switch (event) {
    case 'SIGNED_IN':
      user.value = getAuthUser(session.user)
      break
    case 'SIGNED_OUT':
      user.value = undefined
      break
    case 'TOKEN_REFRESHED':
    case 'USER_UPDATED':
    case 'USER_DELETED':
    case 'PASSWORD_RECOVERY':
    default:
      break
  }
})

const { appName, appDesc, baseUrl } = config.public

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
})

useSeoMeta({
  titleTemplate: (chunk) => {
    return chunk ? `${chunk} - ${appName}` : appName
  },
  description: appDesc,
  ogType: 'website',
  ogUrl: baseUrl,
  ogTitle: appName,
  ogDescription: appDesc,
  ogImage: `${baseUrl}/website-card.png`,
  twitterCard: 'summary_large_image',
  twitterTitle: appName,
  twitterDescription: appDesc,
  twitterImage: `${baseUrl}/website-card.png`,
})
</script>

<style>
:root {
  --card-highlighted-bg-light: #d2e5ff;
  --card-highlighted-bg-dark: #002159;
  --card-highlighted-border: #1677ff;

  --color-text-gradient-stop-1: #4285f4;
  --color-text-gradient-stop-2: #9b72cb;
  --color-text-gradient-stop-3: #d96570;
  --color-surface: #fff;

  --poster-height: 320px;
  --cover-height: 210px;
  font-family: Cabin, sans-serif;
}
</style>
