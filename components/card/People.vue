<template>
  <nuxt-link :to="`/people/${people.people_id}`">
    <a-card hoverable style="height: 100%">
      <a-card-meta :title="name" :description="character">
        <template #avatar>
          <a-avatar :src="people.people.profile_url" :size="60">
            {{ name.charAt(0) }}
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
    default: () => ({}),
  },
})

const { locale } = useI18n()

const name = computed(() => toLocalePeopleName(people.people, locale.value))
const character = computed(() => toLocaleCharacterName(people, locale.value))
</script>
