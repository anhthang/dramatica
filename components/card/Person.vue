<template>
  <div
    class="flex items-center p-3 border rounded-md"
    :class="{
      'card-highlighted': highlight,
    }"
  >
    <Avatar
      :image="person.profile_url"
      size="xlarge"
      pt:image:class="object-cover"
      shape="circle"
    />
    <Card class="!shadow-none bg-transparent">
      <template #title>{{ personName }}</template>
      <template #subtitle>{{ person.native_name }}</template>
    </Card>
  </div>
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
