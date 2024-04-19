<template>
  <a-flex gap="small" align="center">
    <a-avatar :src="item.poster_url" size="small">
      {{ item.title.charAt(0) }}
    </a-avatar>
    {{ item.title }} ({{ item.release_year }})
  </a-flex>
</template>

<script setup>
const { item } = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})
</script>
