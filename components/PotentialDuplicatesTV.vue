<template>
  <a-spin v-if="data.length" :spinning="pending">
    <a-alert
      class="duplicate-alert"
      message="Potential Duplicates"
      type="warning"
    >
      <template #description>
        If the TV show or drama you are adding is listed below, it may already
        exist in our database as a duplicate entry. Please verify carefully
        before proceeding.
      </template>
    </a-alert>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col v-for="tv in data" :key="tv.id" :xs="24" :sm="12" :md="6">
        <nuxt-link :to="`/${tv.id}`" target="_blank">
          <a-card
            hoverable
            :class="
              tv.title.toLowerCase() === props.title.toLowerCase() &&
              'card-highlighted'
            "
            style="height: 100%"
          >
            <a-card-meta :title="`${tv.title} (${tv.release_year})`">
              <template #avatar>
                <a-avatar :src="tv.poster_url" :size="60">
                  {{ tv.title.charAt(0) }}
                </a-avatar>
              </template>
            </a-card-meta>
          </a-card>
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
