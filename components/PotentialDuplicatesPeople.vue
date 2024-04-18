<template>
  <a-spin v-if="data.length" :spinning="pending">
    <a-alert
      class="duplicate-alert"
      message="Potential Duplicates"
      type="warning"
    >
      <template #description>
        The people you're adding might already be in our system. To ensure
        accuracy, please double-check their names before saving.
      </template>
    </a-alert>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col v-for="people in data" :key="people.id" :xs="24" :sm="12" :md="6">
        <nuxt-link :to="`/people/${people.id}`" target="_blank">
          <card-person
            :person="people"
            :highlight="people.name.toLowerCase() === props.name.toLowerCase()"
          />
        </nuxt-link>
      </a-col>
    </a-row>

    <a-divider />
  </a-spin>
</template>

<script setup>
const { props } = defineProps({
  props: {
    type: Object,
    default: () => ({}),
  },
})

const { data, pending } = await useAsyncData(
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
