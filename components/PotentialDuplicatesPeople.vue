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

    <a-row :gutter="[8, 8]" type="flex">
      <a-col v-for="people in data" :key="people.id" :xs="24" :sm="12" :md="6">
        <nuxt-link :to="`/people/${people.id}`" target="_blank">
          <a-card
            hoverable
            :class="
              people.name.toLowerCase() === props.name.toLowerCase() &&
              'card-highlighted'
            "
          >
            <a-card-meta :title="people.name" :description="people.native_name">
              <template #avatar>
                <a-avatar :src="people.profile_url" :size="60">
                  {{ people.name.charAt(0) }}
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
    default() {
      return {}
    },
  },
})

const { data, pending } = await useAsyncData(
  () =>
    $fetch('/api/cast', {
      params: {
        query: props.name,
      },
    }),
  {
    watch: [() => props.name],
  },
)
</script>
