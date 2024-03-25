<template>
  <a-page-header
    v-if="drama"
    class="container"
    :title="drama.title"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <a v-if="drama.watch_link" :href="drama.watch_link" target="_blank">
        <a-button><video-camera-outlined /> Watch </a-button>
      </a>
      <a-button @click="toggleEdit"><edit-outlined /> Edit</a-button>
    </template>

    <template #tags>
      <a-tag>{{ drama.release_year }}</a-tag>
    </template>

    <a-flex justify="space-between" gap="middle">
      <a-flex vertical>
        <a-typography>
          <a-typography-paragraph>
            {{ drama.synopsis }}
          </a-typography-paragraph>
        </a-typography>

        <a-descriptions title="Information" :column="1" size="small">
          <a-descriptions-item label="Status">
            {{ drama.airing_status }}
          </a-descriptions-item>
          <a-descriptions-item label="Episodes">
            {{ drama.number_of_episodes }}
          </a-descriptions-item>
          <a-descriptions-item label="Airing Platform">
            {{ drama.airing_platform }}
          </a-descriptions-item>
          <a-descriptions-item label="Genres">
            {{ drama.genres.map(({ genre }) => genre.name).join(', ') }}
          </a-descriptions-item>
        </a-descriptions>
      </a-flex>

      <img alt="avatar" :src="drama.poster_url" :width="250" />
    </a-flex>

    <a-typography-title :level="4">
      <nuxt-link :to="`/${drama.id}/cast`"> Cast </nuxt-link>
    </a-typography-title>

    <a-row :gutter="[8, 8]" type="flex">
      <a-col v-for="actor in drama.cast" :key="actor.id" :xs="12" :sm="4">
        <card-people :people="actor" />
      </a-col>
    </a-row>

    <a-modal
      v-model:open="visible"
      title="Edit Drama"
      destroy-on-close
      :confirm-loading="loading"
      width="1200px"
      @ok="onEdit"
    >
      <form-t-v ref="tvForm" :is-edit="true" :metadata="drama" />
    </a-modal>
  </a-page-header>
</template>

<script setup>
const route = useRoute()

const { data: drama } = await useAsyncData(() =>
  $fetch(`/api/${route.params.drama_id}`),
)

useSeoMeta({
  title: drama.value && `${drama.value.title} (${drama.value.release_year})`,
  description: drama.value && drama.value.synopsis,
})

const visible = ref(false)
const toggleEdit = () => {
  visible.value = !visible.value
}

const loading = ref(false)
const tvForm = ref()

const onEdit = async () => {
  loading.value = true

  await tvForm.value.onSubmit().then(() => {
    toggleEdit()
  })

  loading.value = false
}
</script>
