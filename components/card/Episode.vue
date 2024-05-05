<template>
  <a-card hoverable style="height: 100%">
    <template #cover>
      <img :src="episode.preview_img" />
    </template>

    <a-flex vertical gap="small">
      <a-card-meta
        :title="episode.title || `${$t('Episode')} ${episode.episode_number}`"
      >
        <template v-if="episode.title" #avatar>
          <a-avatar>{{ episode.episode_number }}</a-avatar>
        </template>

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

      {{ episode.synopsis }}
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
