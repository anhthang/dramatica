<template>
  <a-page-header
    v-if="drama"
    class="container"
    :title="translation.title_year"
    :sub-title="drama.original_title"
  >
    <template v-if="drama.rating_name" #tags>
      <a-tag color="blue">{{ drama.rating_name }}</a-tag>
    </template>

    <template #extra>
      <a-dropdown-button @click="toggle('edit')">
        Edit
        <template #overlay>
          <a-menu @click="toggle('translation')">
            <a-menu-item key="translation">
              <template #icon><translation-outlined /> </template> Translation
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown-button>
    </template>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col :lg="14">
        <a-descriptions :column="2" size="small">
          <a-descriptions-item :label="$t('Status')">
            {{ $t(drama.airing_status) }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Number of episodes')">
            {{ drama.number_of_episodes }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Airing Platform')">
            {{ drama.airing_platform }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Genres')">
            {{ drama.genres.map(({ name }) => name).join(', ') }}
          </a-descriptions-item>
          <a-descriptions-item v-if="drama.air_date" :label="$t('Aired')">
            {{ airDate(drama) }}
          </a-descriptions-item>
        </a-descriptions>

        <a-descriptions layout="vertical" size="small">
          <a-descriptions-item :label="$t('Synopsis')">
            <a-typography>
              <a-typography-paragraph
                v-for="(line, idx) in translation.synopsis.split('\n')"
                :key="idx"
              >
                {{ line }}
              </a-typography-paragraph>
            </a-typography>
          </a-descriptions-item>
        </a-descriptions>
      </a-col>
      <a-col :lg="10">
        <a-flex vertical gap="middle">
          <img :alt="translation.title" :src="translation.cover_url" />
          <a-flex justify="center" gap="small">
            <nuxt-link
              v-if="translation.watch_link"
              :to="translation.watch_link"
              target="_blank"
              style="width: 100%"
            >
              <a-button
                type="primary"
                size="large"
                block
                :class="
                  getStreamingService(translation.watch_link).toLowerCase()
                "
              >
                <play-circle-outlined /> {{ $t('Watch') }}
              </a-button>
            </nuxt-link>
            <a-button size="large" block @click="copyUrl">
              <share-alt-outlined /> {{ $t('Share') }}
            </a-button>
          </a-flex>
        </a-flex>
      </a-col>
    </a-row>

    <a-tabs v-model:activeKey="activeKey" size="large">
      <template #rightExtra>
        <nuxt-link :to="`/${drama.id}/${activeKey}`">
          <a-button type="link">Browse</a-button>
        </nuxt-link>
      </template>

      <a-tab-pane key="cast">
        <template #tab><team-outlined /> {{ $t('Cast') }}</template>
        <a-row :gutter="[16, 16]" type="flex">
          <a-col
            v-for="actor in drama.cast"
            :key="actor.id"
            :xs="24"
            :md="8"
            :lg="6"
          >
            <card-people :people="actor" />
          </a-col>
        </a-row>

        <a-result
          v-if="!drama.cast.length"
          status="404"
          title="We apologize, but cast & crew is currently unavailable."
          sub-title="We're actively gathering this information and will update it soon."
        />
      </a-tab-pane>

      <a-tab-pane key="episodes">
        <template #tab><youtube-outlined /> {{ $t('Episodes') }}</template>
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

        <a-flex justify="center" style="margin-top: 16px">
          <a-pagination
            v-model:current="page"
            :total="localeEpisodes.length"
            :page-size="size"
            :show-size-changer="false"
            :show-quick-jumper="localeEpisodes.length > size * 10"
            hide-on-single-page
          />
        </a-flex>

        <a-result
          v-if="!localeEpisodes.length"
          status="404"
          title="We apologize, but episode information is currently unavailable."
          sub-title="We're actively gathering this information and will update it soon."
        />
      </a-tab-pane>

      <a-tab-pane key="streaming">
        <template #tab>
          <desktop-outlined /> {{ $t('Where to Watch') }}
        </template>

        <a-row type="flex" class="where-to-watch">
          <a-col v-for="service in drama.availability" :key="service" :span="3">
            <nuxt-link :to="service.watch_link" target="_blank">
              <a-card hoverable>
                <template
                  v-if="
                    themeSpecificServices.includes(service.streaming_service)
                  "
                  #cover
                >
                  <img
                    :width="200"
                    :src="`/logo/${service.streaming_service.toLowerCase()}-${$colorMode.value}.png`"
                    :alt="service.streaming_service"
                  />
                </template>
                <template v-else #cover>
                  <img
                    :width="200"
                    :src="`/logo/${service.streaming_service.toLowerCase()}.png`"
                    :alt="service.streaming_service"
                  />
                </template>
              </a-card>
            </nuxt-link>
          </a-col>
        </a-row>
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
import keyBy from 'lodash.keyby'

const page = ref(1)
const size = 12

const route = useRoute()
const config = useRuntimeConfig()

const { locale } = useI18n()

const { data: drama, refresh } = await useAsyncData(
  `drama-${route.params.drama_id}`,
  () => $fetch(`/api/${route.params.drama_id}`),
)

const translation = computed(() => {
  const translationMap = keyBy(drama.value.translations, 'language')

  return translationMap[locale.value] || translationMap.en
})

const localeEpisodes = computed(() =>
  drama.value.episodes.filter((e) => e.language === locale.value),
)

const episodes = computed(() => {
  return localeEpisodes.value.slice((page.value - 1) * size, page.value * size)
})

const airDate = ({ air_date, end_date }) => {
  return end_date
    ? `${toLocaleDate(air_date, locale.value)} - ${toLocaleDate(end_date, locale.value)}`
    : toLocaleDate(air_date, locale.value)
}

const copyUrl = () => {
  copy(config.public.baseUrl + route.fullPath)
  message.success('Copied to clipboard!')
}

const seoTitle = computed(() => drama.value && translation.value.title_year)
const seoDescription = computed(() => drama.value && translation.value.synopsis)
const seoImage = computed(() => drama.value && translation.value.cover_url)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: seoImage,
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: seoImage,
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

  refresh()
  toggle('loading')
}

const translationForm = ref()
const onUpdateTranslation = async () => {
  toggle('loading')

  await translationForm.value.onSubmit().then(() => {
    toggle('translation')
  })

  refresh()
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

.where-to-watch {
  justify-content: space-evenly;
  align-items: center;

  .ant-card-cover img {
    padding: 16px;
  }
}
</style>
