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
      <a-button @click="toggle('translation')">
        <translation-outlined /> Translation
      </a-button>
      <a-button @click="toggle('edit')"><edit-outlined /> Edit</a-button>
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
        <a-row :gutter="[16, 16]" type="flex">
          <a-col
            v-for="actor in sortBy(drama.cast, [
              'billing_order',
              'people.name',
            ])"
            :key="actor.id"
            :xs="12"
            :sm="4"
          >
            <card-people :people="actor" />
          </a-col>
        </a-row>
      </a-tab-pane>

      <a-tab-pane
        key="episodes"
        :disabled="!Array.isArray(drama.episodes) || !drama.episodes.length"
      >
        <template #tab><youtube-outlined /> Episodes</template>
        <a-row :gutter="[16, 16]" type="flex">
          <a-col
            v-for="episode in episodes"
            :key="episode.episode_number"
            :xs="24"
            :md="8"
            :lg="6"
          >
            <a-card style="height: 100%">
              <template #cover>
                <img :src="episode.preview_img" />
              </template>
              <a-card-meta
                :title="episode.title || `Episode ${episode.episode_number}`"
                :description="episode.plot_summary"
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
      </a-tab-pane>
    </a-tabs>

    <a-modal
      v-model:open="visible.edit"
      title="Edit Drama"
      destroy-on-close
      :confirm-loading="visible.loading"
      width="1200px"
      @ok="onEdit"
    >
      <form-t-v ref="tvForm" :is-edit="true" :metadata="drama" />
    </a-modal>

    <a-modal
      v-model:open="visible.translation"
      title="Add Translation"
      destroy-on-close
      :confirm-loading="visible.loading"
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
import sortBy from 'lodash.sortby'

const page = ref(1)
const size = 12

const route = useRoute()
const config = useRuntimeConfig()

const { data: drama } = await useAsyncData(() =>
  $fetch(`/api/${route.params.drama_id}`),
)

const episodes = computed(() => {
  return drama.value.episodes.slice((page.value - 1) * size, page.value * size)
})

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
  loading: false,
})

const toggle = (key) => {
  visible.value[key] = !visible.value[key]
}

const tvForm = ref()
const onEdit = async () => {
  toggle('loading')

  await tvForm.value.onSubmit().then(() => {
    toggle('edit')
  })

  toggle('loading')
}

const translationForm = ref()
const onUpdateTranslation = async () => {
  toggle('loading')

  await translationForm.value.onSubmit().then(() => {
    toggle('translation')
  })

  toggle('loading')
}
</script>
