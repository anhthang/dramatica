<template>
  <a-page-header
    v-if="drama"
    class="container"
    :title="drama.title"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <a-button @click="copyUrl"><share-alt-outlined /> Share</a-button>
      <a v-if="drama.watch_link" :href="drama.watch_link" target="_blank">
        <a-button><video-camera-outlined /> Watch</a-button>
      </a>
      <a-button @click="toggleTranslation">
        <translation-outlined /> Translation
      </a-button>
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

      <img :alt="drama.title" :src="drama.poster_url" :width="250" />
    </a-flex>

    <a-tabs v-model:activeKey="activeKey" size="large">
      <template v-if="activeKey === 'cast'" #rightExtra>
        <nuxt-link :to="`/${drama.id}/cast`">
          <a-button type="link">All Cast & Crew</a-button>
        </nuxt-link>
      </template>

      <a-tab-pane key="cast">
        <template #tab><team-outlined /> Cast</template>
        <a-row :gutter="[8, 8]" type="flex">
          <a-col v-for="actor in drama.cast" :key="actor.id" :xs="12" :sm="4">
            <card-people :people="actor" />
          </a-col>
        </a-row>
      </a-tab-pane>

      <a-tab-pane
        key="episodes"
        :disabled="!Array.isArray(drama.episodes) || !drama.episodes.length"
      >
        <template #tab><youtube-outlined /> Episodes</template>
        <a-list
          item-layout="vertical"
          :pagination="{ pageSize: 10 }"
          :data-source="drama.episodes"
        >
          <template #renderItem="{ item }">
            <a-list-item :key="item.id">
              <a-row :gutter="[16, 16]">
                <a-col :xs="24" :sm="18" :md="4">
                  <img width="100%" :src="item.preview_img" />
                </a-col>
                <a-col :xs="24" :sm="16" :md="20">
                  <a-list-item-meta
                    :title="item.title || `Episode ${item.episode_number}`"
                    :description="item.air_date"
                  />

                  {{ item.plot_summary }}
                </a-col>
              </a-row>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      v-model:open="visible.edit"
      title="Edit Drama"
      destroy-on-close
      :confirm-loading="loading"
      width="1200px"
      @ok="onEdit"
    >
      <form-t-v ref="tvForm" :is-edit="true" :metadata="drama" />
    </a-modal>

    <a-modal
      v-model:open="visible.translation"
      title="Add Translation"
      destroy-on-close
      :confirm-loading="loading"
      @ok="onUpdateTranslation"
    >
      <form-drama-translation
        ref="translationForm"
        :translations="drama.translations"
      />
    </a-modal>
  </a-page-header>
</template>

<script setup>
import copy from 'ant-design-vue/lib/_util/copy-to-clipboard'

const route = useRoute()
const config = useRuntimeConfig()

const { data: drama } = await useAsyncData(() =>
  $fetch(`/api/${route.params.drama_id}`),
)

const copyUrl = () => {
  copy(config.public.baseUrl + route.fullPath)
  message.success('Copied to clipboard!')
}

useSeoMeta({
  title: drama.value && `${drama.value.title} (${drama.value.release_year})`,
  description: drama.value && drama.value.synopsis,
  ogTitle: drama.value && `${drama.value.title} (${drama.value.release_year})`,
  ogDescription: drama.value && drama.value.synopsis,
  ogImage: drama.value && drama.value.cover_url,
  twitterTitle:
    drama.value && `${drama.value.title} (${drama.value.release_year})`,
  twitterDescription: drama.value && drama.value.synopsis,
  twitterImage: drama.value && drama.value.cover_url,
})

const activeKey = ref('cast')

const visible = ref({
  edit: false,
  translation: false,
})

const toggleEdit = () => {
  visible.value.edit = !visible.value.edit
}

const toggleTranslation = () => {
  visible.value.translation = !visible.value.translation
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

const translationForm = ref()
const onUpdateTranslation = async () => {
  loading.value = true

  await translationForm.value.onSubmit().then(() => {
    toggleTranslation()
  })

  loading.value = false
}
</script>
