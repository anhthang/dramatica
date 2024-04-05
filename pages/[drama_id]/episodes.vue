<template>
  <a-page-header
    v-if="drama"
    class="container"
    :title="`${drama.title} - Episodes`"
  >
    <template #extra>
      <a-button type="primary" @click="toggleImport">
        <import-outlined /> Import
      </a-button>
    </template>

    <template #tags>
      <a-tag>{{ drama.release_year }}</a-tag>
    </template>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col
        v-for="episode in drama.episodes"
        :key="episode.episode_number"
        :xs="24"
        :md="8"
        :lg="6"
      >
        <a-card hoverable style="height: 100%">
          <template #cover>
            <img :src="episode.preview_img" />
          </template>
          <a-card-meta
            :title="episode.title || `Episode ${episode.episode_number}`"
            :description="episode.synopsis"
          />
        </a-card>
      </a-col>
    </a-row>

    <a-modal
      v-model:open="visible"
      title="Import Episode Synopses"
      destroy-on-close
      :width="800"
      @ok="addEpisodes"
    >
      <form-drama-episodes
        ref="episodesForm"
        :url="netflix && netflix.watch_link"
      />
    </a-modal>
  </a-page-header>
</template>

<script setup>
const route = useRoute()

const { data: drama, refresh } = await useAsyncData(() =>
  $fetch(`/api/${route.params.drama_id}`),
)

const netflix = computed(() =>
  drama.value.availability.find((a) => a.streaming_service === 'Netflix'),
)

const visible = ref(false)
const toggleImport = () => {
  visible.value = !visible.value
}

const episodesForm = ref()
const addEpisodes = async () => {
  await episodesForm.value.onSubmit()

  toggleImport()
  refresh()
}

useSeoMeta({
  title:
    drama.value &&
    `Episodes - ${drama.value.title} (${drama.value.release_year})`,
  description: drama.value && drama.value.synopsis,
})
</script>
