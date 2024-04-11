<template>
  <a-page-header v-if="drama" class="container" title="Episodes">
    <template #breadcrumb>
      <a-breadcrumb>
        <a-breadcrumb-item>
          <nuxt-link to="/"> Home </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/${drama.id}`">
            {{ drama.title }} ({{ drama.release_year }})
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
        v-for="episode in drama.episodes"
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
  title:
    drama.value &&
    `Episodes - ${drama.value.title} (${drama.value.release_year})`,
  description: drama.value && drama.value.synopsis,
})
</script>
