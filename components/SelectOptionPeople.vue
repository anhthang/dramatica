<template>
  <a-flex gap="small" align="center">
    <a-avatar :src="item.profile_url" size="small">
      {{ item.name.charAt(0) }}
    </a-avatar>
    {{ item.name }} ({{ item.native_name }})
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
