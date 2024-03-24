<template>
  <a-flex v-if="data.length" vertical>
    <a-alert message="Potential Duplicates" type="warning">
      <template #description>
        If the TV show or drama you are adding is listed below, it may already
        exist in our database as a duplicate entry. Please verify carefully
        before proceeding.
      </template>
    </a-alert>

    <a-row :gutter="[8, 8]" type="flex" style="margin-top: 24px">
      <a-col v-for="tv in data" :key="tv.id" :xs="24" :sm="12" :md="6">
        <nuxt-link :to="`/${tv.id}`" target="_blank">
          <a-card hoverable>
            <a-card-meta
              :title="`${tv.title} (${tv.release_year})`"
              :description="tv.title_vi"
            >
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
  </a-flex>
</template>

<script setup>
const { title } = defineProps({
  title: {
    type: String,
    default: '',
  },
})

const { data } = await useAsyncData(() =>
  $fetch('/api/drama', {
    params: {
      query: title,
    },
  }),
)
</script>
