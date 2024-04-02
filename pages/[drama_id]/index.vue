<template>
  <a-page-header
    v-if="drama"
    class="container"
    :title="drama.title"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <a-button @click="toggle('translation')">
        <translation-outlined /> Translation
      </a-button>
      <a-button @click="toggle('edit')"><edit-outlined /> Edit</a-button>
    </template>

    <template #tags>
      <a-tag>{{ drama.release_year }}</a-tag>
    </template>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col :lg="14">
        <a-descriptions :column="2" size="small">
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
          <a-descriptions-item v-if="drama.air_date" label="Aired">
            {{ airDate(drama) }}
          </a-descriptions-item>
        </a-descriptions>

        <a-descriptions layout="vertical" size="small">
          <a-descriptions-item label="Synopsis">
            <a-typography>
              <a-typography-paragraph>
                {{ drama.synopsis }}
              </a-typography-paragraph>
            </a-typography>
          </a-descriptions-item>
        </a-descriptions>
      </a-col>
      <a-col :lg="10">
        <a-flex vertical gap="middle">
          <img :alt="drama.title" :src="drama.cover_url" />
          <a-flex justify="center" gap="small">
            <nuxt-link
              v-if="drama.watch_link"
              :to="drama.watch_link"
              target="_blank"
              style="width: 100%"
            >
              <a-button
                type="primary"
                size="large"
                block
                :class="drama.airing_platform?.toLowerCase()"
              >
                <play-circle-outlined /> Watch
              </a-button>
            </nuxt-link>
            <a-button size="large" block @click="copyUrl">
              <share-alt-outlined /> Share
            </a-button>
          </a-flex>
        </a-flex>
      </a-col>
    </a-row>

    <a-tabs v-model:activeKey="activeKey" size="large">
      <template v-if="activeKey === 'cast'" #rightExtra>
        <nuxt-link :to="`/${drama.id}/cast`">
          <a-button type="link">All Cast & Crew</a-button>
        </nuxt-link>
      </template>

      <template v-else-if="activeKey === 'episodes'" #rightExtra>
        <nuxt-link :to="`/${drama.id}/episodes`">
          <a-button type="link">All Episodes</a-button>
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

      <a-tab-pane key="episodes">
        <template #tab><youtube-outlined /> Episodes</template>
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

        <a-flex justify="center" style="margin-top: 16px">
          <a-pagination
            v-model:current="page"
            :total="drama.episodes.length"
            :page-size="size"
            :show-size-changer="false"
            :show-quick-jumper="drama.episodes.length > size * 10"
            hide-on-single-page
          />
        </a-flex>

        <a-result
          v-if="!drama.episodes.length"
          status="404"
          title="We apologize, but episode information is currently unavailable."
          sub-title="We're actively gathering this information and will update it soon."
        />
      </a-tab-pane>

      <a-tab-pane v-if="drama.availability.length" key="where_to_watch">
        <template #tab><desktop-outlined /> Where to Watch</template>
        <a-flex class="where_to_watch" justify="space-evenly" align="center">
          <nuxt-link
            v-for="service in drama.availability"
            :key="service"
            :to="service.watch_link"
          >
            <a-image
              v-if="themeSpecificServices.includes(service.streaming_service)"
              :preview="false"
              :width="200"
              :src="`/logo/${service.streaming_service.toLowerCase()}-${$colorMode.value}.png`"
              :alt="service.streaming_service"
            />
            <a-image
              v-else
              :preview="false"
              :width="200"
              :src="`/logo/${service.streaming_service.toLowerCase()}.png`"
              :alt="service.streaming_service"
            />
          </nuxt-link>
        </a-flex>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      v-model:open="visible.edit"
      title="Edit Drama"
      destroy-on-close
      :confirm-loading="visible.loading"
      :width="1200"
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

const themeSpecificServices = ['WeTV', 'Youku']

const page = ref(1)
const size = 12

const route = useRoute()
const config = useRuntimeConfig()

const { data: drama } = await useAsyncData(
  () => $fetch(`/api/${route.params.drama_id}`),
  {
    /**
     * FIXME: remove this once we have translation feature
     */
    transform: (data) => {
      data.episodes = data.episodes.filter((e) => e.language === 'en')

      if (data.availability.length) {
        data.availability.unshift({
          streaming_service: data.airing_platform,
          watch_link: data.watch_link,
        })
      }
      return data
    },
  },
)

const episodes = computed(() => {
  return drama.value.episodes.slice((page.value - 1) * size, page.value * size)
})

const airDate = ({ air_date, end_date }) => {
  return end_date
    ? `${toLocaleDate(air_date)} - ${toLocaleDate(end_date)}`
    : toLocaleDate(air_date)
}

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

<style>
.wetv {
  background-color: #ff4a22;
}

.iqiyi {
  background-color: #1cc749;
}

.netflix {
  background-color: #e50914;
}

.youku {
  background-color: #2c78ff;
  /* background-color: #ff6400; */
}
</style>
