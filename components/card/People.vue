<template>
  <NuxtLink :to="`/people/${people.people_id}`">
    <div class="flex items-center">
      <Avatar
        :image="people.people.profile_url"
        size="large"
        pt:image:class="object-contain"
        shape="circle"
      />
      <Card class="!shadow-none">
        <template #title>{{ name }}</template>
        <template #subtitle>{{ character }}</template>
      </Card>
    </div>
  </NuxtLink>
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
