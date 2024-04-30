<template>
  <a-card hoverable style="height: 100%">
    <template #cover>
      <img :src="episode.preview_img" />
    </template>

    <a-flex vertical gap="middle">
      <a-card-meta
        :title="episode.title || `Episode ${episode.episode_number}`"
      >
        <template #avatar>
          <a-avatar>{{ episode.episode_number }}</a-avatar>
        </template>
      </a-card-meta>

      <a-card-meta :description="episode.synopsis" />

      <a-card-meta>
        <template #description>
          <a-flex justify="space-between">
            <span v-if="episode.air_date">
              <calendar-outlined />
              {{ toLocaleDate(episode.air_date, $i18n.locale) }}
            </span>
            <span v-if="episode.runtime">
              <clock-circle-outlined />
              {{ runtime2Duration(episode.runtime) }}
            </span>
          </a-flex>
        </template>
      </a-card-meta>
    </a-flex>
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
