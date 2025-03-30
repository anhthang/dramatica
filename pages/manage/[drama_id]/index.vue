<template>
  <Panel>
    <FormTV :is-edit="true" :metadata="drama" @on-success="refresh" />

    <Toast />
  </Panel>
</template>

<script setup>
definePageMeta({ layout: 'tv' })

const route = useRoute()

const { data: drama, refresh } = await useAsyncData(
  `drama-${route.params.drama_id}`,
  () => $fetch(`/api/${route.params.drama_id}`),
)
</script>
