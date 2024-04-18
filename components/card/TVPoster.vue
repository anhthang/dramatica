<template>
  <nuxt-link :to="`/${tv.id}`">
    <a-card hoverable :loading="loading">
      <template v-if="!loading" #cover>
        <a-image :preview="false" :alt="tv.title" :src="tv.poster_url" />
      </template>

      <a-card-meta :title="tv.title">
        <template #description>
          <a-flex justify="space-between">
            <span>
              <calendar-outlined />
              {{ toLocaleDate(tv.air_date, $i18n.locale) }}
            </span>
            <span><number-outlined /> {{ tv.number_of_episodes }}</span>
          </a-flex>
        </template>
      </a-card-meta>
    </a-card>
  </nuxt-link>
</template>

<script setup>
const { tv, loading } = defineProps({
  tv: {
    type: Object,
    default: () => ({}),
  },
  loading: Boolean,
})
</script>
