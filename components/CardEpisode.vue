<template>
  <a-card hoverable style="height: 100%">
    <template #cover>
      <img :src="episode.preview_img" />
    </template>
    <a-card-meta :description="episode.synopsis">
      <template #title>
        <a-flex justify="space-between">
          <span class="ant-card-meta-title">
            {{ episode.title || `Episode ${episode.episode_number}` }}
          </span>
          <span style="font-weight: 600; font-size: 16px">
            {{ runtime2Duration(episode.runtime) }}
          </span>
        </a-flex>
      </template>
    </a-card-meta>
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
