<template>
  <a-card hoverable style="height: 100%">
    <template #cover>
      <img :src="episode.preview_img" />
    </template>

    <a-card-meta
      :title="episode.title || `Episode ${episode.episode_number}`"
      :description="episode.synopsis"
    />

    <template #actions>
      <span v-if="episode.air_date">
        <calendar-outlined />
        {{ toLocaleDate(episode.air_date, $i18n.locale) }}
      </span>
      <span v-if="episode.runtime">
        <clock-circle-outlined /> {{ runtime2Duration(episode.runtime) }}
      </span>
    </template>
  </a-card>
</template>

<script setup>
const { episode } = defineProps({
  episode: {
    type: Object,
    default: () => ({}),
  },
})
</script>
