<template>
  <NuxtLayout name="desktop">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import 'primeicons/primeicons.css'

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

client.auth.getUser().then(({ data }) => {
  if (data.user) {
    user.value = getAuthUser(data.user)
  }
})

const { name, description, homepage } = config.app

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
})

useSeoMeta({
  titleTemplate: (chunk) => {
    return chunk ? `${chunk} - ${name}` : name
  },
  description,
  ogType: 'website',
  ogUrl: homepage,
  ogTitle: name,
  ogDescription: description,
  ogImage: `${homepage}/website-card.png`,
  twitterCard: 'summary_large_image',
  twitterTitle: name,
  twitterDescription: description,
  twitterImage: `${homepage}/website-card.png`,
})
</script>

<style>
:root {
  --color-text-gradient-stop-1: #4285f4;
  --color-text-gradient-stop-2: #9b72cb;
  --color-text-gradient-stop-3: #d96570;
  --color-surface: #fff;

  --poster-height: 320px;
  --cover-height: 210px;
  font-family: Dosis, sans-serif;

  --p-card-body-padding: 1.125rem;
  --p-card-title-font-size: 1.125rem;
}
</style>
