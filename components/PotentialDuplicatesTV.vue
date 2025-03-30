<template>
  <div v-if="data.length">
    <Message icon="pi pi-exclamation-circle" severity="warn" class="mb-6">
      <strong>Potential Duplicates:</strong>
      If the TV show or drama you are adding is listed below, it may already
      exist in our database as a duplicate entry. Please verify carefully before
      proceeding.
    </Message>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <NuxtLink
        v-for="tv in data"
        :key="tv.id"
        :to="`/${tv.id}`"
        target="_blank"
      >
        <CardTVHorizontal
          :image="tv.cover_url"
          :title="tv.title"
          :selected="tv.title.toLowerCase() === props.title.toLowerCase()"
          bordered
        />
      </NuxtLink>
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
    $fetch('/api/drama', {
      params: {
        query: props.title,
      },
    }),
  {
    watch: [() => props.title],
  },
)
</script>
