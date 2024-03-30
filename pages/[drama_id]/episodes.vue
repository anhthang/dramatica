<template>
  <a-page-header
    v-if="drama"
    class="container"
    :title="drama.title"
    sub-title="Episodes"
    @back="() => $router.go(-1)"
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
        v-for="episode in episodes"
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

    <a-flex
      v-if="drama.episodes.length > size"
      justify="center"
      style="margin-top: 16px"
    >
      <a-pagination
        v-model:current="page"
        :total="drama.episodes.length"
        :page-size="size"
        :show-size-changer="false"
        :show-quick-jumper="drama.episodes.length > size * 10"
      />
    </a-flex>

    <a-modal
      v-model:open="visible"
      title="Import Episode Synopses"
      destroy-on-close
      :width="800"
      @ok="addEpisodes"
    >
      <form-drama-episodes ref="episodesForm" />
    </a-modal>
  </a-page-header>
</template>

<script setup>
const route = useRoute()

const page = ref(1)
const size = 12

const { data: drama, refresh } = await useAsyncData(
  () => $fetch(`/api/${route.params.drama_id}`),
  {
    /**
     * FIXME: remove this once we have translation feature
     */
    transform: (data) => {
      data.episodes = data.episodes.filter((e) => e.language === 'en')
      return data
    },
  },
)

const episodes = computed(() => {
  return drama.value.episodes.slice((page.value - 1) * size, page.value * size)
})

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
