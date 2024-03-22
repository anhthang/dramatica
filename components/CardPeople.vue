<template>
  <nuxt-link :to="`/people/${people.people_id}`">
    <a-card hoverable>
      <a-card-meta
        :title="people.people.name"
        :description="people.character_name"
      >
        <template #avatar>
          <a-avatar :src="people.people.profile_url" :size="60">
            {{ people.people.name.charAt(0) }}
          </a-avatar>
        </template>
      </a-card-meta>
    </a-card>
  </nuxt-link>
</template>

<script setup>
const { people } = defineProps({
  people: {
    type: Object,
    default() {
      return {}
    },
  },
})
</script>
