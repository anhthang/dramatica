<template>
  <div v-if="data.length">
    <Message icon="pi pi-exclamation-circle" severity="warn" class="mb-6">
      <strong>Potential Duplicates:</strong>
      The people you're adding might already be in our system. To ensure
      accuracy, please double-check their names before saving.
    </Message>

    <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
      <nuxt-link
        v-for="person in data"
        :key="person.id"
        :to="`/people/${person.id}`"
        target="_blank"
      >
        <CardPerson
          :image="person.profile_url"
          size="large"
          :title="toLocalePersonName(person, $i18n.locale)"
          :subtitle="person.native_name"
          :selected="person.name.toLowerCase() === props.name.toLowerCase()"
          bordered
        />
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
const { props } = defineProps({
  props: {
    type: Object,
    default: () => ({}),
  },
})

const { data } = await useAsyncData(
  () =>
    $fetch('/api/people', {
      params: {
        query: props.name,
      },
    }),
  {
    watch: [() => props.name],
  },
)
</script>
