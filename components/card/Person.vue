<template>
  <a-card
    hoverable
    :class="highlight && 'card-highlighted'"
    style="height: 100%"
  >
    <a-card-meta :title="personName" :description="person.native_name">
      <template #avatar>
        <a-avatar :src="person.profile_url" :size="60">
          {{ personName.charAt(0) }}
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

const { locale } = useI18n()
const personName = computed(() => toLocalePeopleName(person, locale.value))
</script>
