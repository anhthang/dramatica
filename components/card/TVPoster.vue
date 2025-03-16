<template>
  <NuxtLink :to="`/${tv.id}`">
    <Card
      :pt="{
        root: 'h-full overflow-hidden',
        // header: 'h-48',
        body: 'flex-1',
        caption: 'flex-grow',
        subtitle: 'flex justify-between gap-2',
      }"
    >
      <template #header>
        <img loading="lazy" :alt="tv.title" :src="tv.poster_url" />
      </template>

      <template #title>{{ tv.title }}</template>

      <template #subtitle>
        <span class="flex items-center gap-1">
          <i class="pi pi-calendar" />
          {{ toLocaleDate(tv.air_date, $i18n.locale) }}
        </span>
        <span v-if="tv.number_of_episodes" class="flex items-center gap-1">
          <i class="pi pi-hashtag" />
          {{ tv.number_of_episodes }}
        </span>
      </template>
    </Card>
  </NuxtLink>
</template>

<script setup>
const { tv } = defineProps({
  tv: {
    type: Object,
    default: () => ({}),
  },
})
</script>
