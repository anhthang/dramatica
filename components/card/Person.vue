<template>
  <a-card
    hoverable
    :class="highlight && 'card-highlighted'"
    style="height: 100%"
  >
    <a-card-meta :title="person.name" :description="person.native_name">
      <template #avatar>
        <a-avatar :src="person.profile_url" :size="60">
          {{ person.name.charAt(0) }}
        </a-avatar>
      </template>
    </a-card-meta>
  </a-card>
</template>

<script setup>
const { person, highlight } = defineProps({
  person: {
    type: Object,
    default: () => ({}),
  },
  highlight: Boolean,
})
</script>
