<template>
  <a-page-header v-if="drama" class="container" title="Episodes">
    <template #breadcrumb>
      <a-breadcrumb>
        <a-breadcrumb-item>
          <nuxt-link to="/"> Home </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/${drama.id}`">
            {{ translation.title_year }}
          </nuxt-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </template>

    <template #extra>
      <a-button type="primary" @click="toggleSync">
        <sync-outlined /> Sync
      </a-button>
    </template>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col
        v-for="episode in episodes"
        :key="episode.episode_number"
        :xs="24"
        :md="8"
        :lg="6"
      >
        <card-episode :episode="episode" />
      </a-col>
    </a-row>

    <a-modal
      v-model:open="visible"
      title="Sync Episode Synopses"
      destroy-on-close
      :width="800"
      @ok="addEpisodes"
    >
      <form-drama-episodes
        ref="episodesForm"
        :url="availability && availability.watch_link"
      />
    </a-modal>
  </a-page-header>
</template>

<script setup>
import keyBy from 'lodash.keyby'

const route = useRoute()
const { locale } = useI18n()

const { data: drama, refresh } = await useAsyncData(
  `drama-${route.params.drama_id}`,
  () => $fetch(`/api/${route.params.drama_id}`),
)

const translation = computed(() => {
  const translationMap = keyBy(drama.value.translations, 'language')

  return translationMap[locale.value] || translationMap.en
})

const episodes = computed(() =>
  drama.value.episodes.filter((e) => e.language === locale.value),
)

const availability = computed(() => {
  return drama.value.availability.find((a) =>
    ['Netflix', 'Youku', 'iQIYI', 'WeTV'].includes(a.streaming_service),
  )
})

const visible = ref(false)
const toggleSync = () => {
  visible.value = !visible.value
}

const episodesForm = ref()
const addEpisodes = async () => {
  await episodesForm.value.onSubmit()

  toggleSync()
  refresh()
}

useSeoMeta({
  title: drama.value && `Episodes - ${translation.value.title_year}`,
  description: drama.value && translation.value.synopsis,
})
</script>
