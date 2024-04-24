<template>
  <a-card
    hoverable
    :class="highlight && 'card-highlighted'"
    style="height: 100%"
  >
    <a-card-meta
      :title="tv.release_year ? `${tv.title} (${tv.release_year})` : tv.title"
      :description="tv.title_pinyin"
    >
      <template #avatar>
        <a-avatar :src="tv.poster_url" :size="60">
          {{ tv.title.charAt(0) }}
        </a-avatar>
      </template>
    </a-card-meta>
  </a-card>
</template>

<script setup>
const { tv, highlight } = defineProps({
  tv: {
    type: Object,
    default: () => ({}),
  },
  highlight: Boolean,
})
</script>
