<template>
  <Card
    :pt="{
      root: 'h-full overflow-hidden',
      content: 'text-justify',
    }"
  >
    <template #header>
      <img loading="lazy" :alt="tv.title" :src="tv.cover_url" />
    </template>

    <template #title>{{ tv.title }}</template>
    <template #content>{{ tv.synopsis }}</template>
  </Card>
</template>

<script setup>
defineProps({
  tv: {
    type: Object,
    default: () => ({}),
  },
})
</script>
