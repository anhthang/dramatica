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

const config = useRuntimeConfig()
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
}
</style>
