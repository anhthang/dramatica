<template>
  <div class="flex items-center w-full">
    <img
      class="w-40 shrink-0 rounded"
      :src="tv.drama.cover_url"
      :alt="tv.drama.title"
    />

    <Card class="!shadow-none bg-transparent flex-1" pt:body:class="py-0">
      <template #title>{{ tv.drama.title }}</template>
      <template #subtitle>{{ toLocaleCharacterName(tv, locale) }}</template>
      <template #content>{{ $t(tv.role) }}</template>
    </Card>
  </div>
</template>

<script setup>
defineProps({
  tv: {
    type: Object,
    default: () => ({}),
  },
  locale: {
    type: String,
    default: 'en',
  },
})
</script>
