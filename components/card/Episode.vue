<template>
  <Card
    class="h-full overflow-hidden"
    :pt="{
      body: 'flex-1',
      // caption: 'flex-grow',
      subtitle: 'flex justify-between gap-2',
    }"
  >
    <template #header>
      <img loading="lazy" :src="episode.preview_img" />
    </template>

    <template #title>
      <Avatar class="mr-1" shape="circle">
        {{ episode.episode_number }}
      </Avatar>
      {{ episode.title }}
    </template>

    <template #subtitle>
      <span class="flex items-center gap-1">
        <i class="pi pi-calendar" />
        {{ toLocaleDate(episode.air_date, $i18n.locale) }}
      </span>
      <span v-if="episode.runtime" class="flex items-center gap-1">
        <i class="pi pi-clock" />
        {{ runtime2Duration(episode.runtime) }}
      </span>
    </template>

    <template #content>
      {{ episode.synopsis }}
    </template>
  </Card>
</template>

<script setup>
const { episode } = defineProps({
  episode: {
    type: Object,
    default: () => ({}),
  },
})
</script>
