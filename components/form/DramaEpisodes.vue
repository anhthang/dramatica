<template>
  <a-form layout="vertical" :model="params">
    <a-form-item
      ref="url"
      name="url"
      label="Streaming Service"
      :rules="[{ required: true, type: 'url' }]"
    >
      <a-select
        v-model:value="params.url"
        :options="availability"
        :field-names="{
          label: 'streaming_service',
          value: 'watch_link',
        }"
      />
      <template #extra>
        Select a streaming service to import drama episode information. Please
        verify the data's accuracy before importing.
      </template>
    </a-form-item>

    <a-form-item name="language" label="Language" :rules="[{ required: true }]">
      <a-radio-group
        v-model:value="params.language"
        :options="
          locales.map(({ code, name }) => ({ value: code, label: name }))
        "
      />
    </a-form-item>
  </a-form>

  <a-card v-if="tv" :loading="loading">
    <template #cover>
      <img :src="tv.cover_url" />
    </template>

    <a-card-meta :title="tv.title" :description="tv.synopsis" />

    <a-list
      v-if="episodes.length"
      item-layout="vertical"
      :data-source="episodes"
      :pagination="{ pageSize: 5, simple: true }"
    >
      <template #header>
        <a-typography-text strong> Synopses </a-typography-text>
      </template>

      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta :title="item.title" :description="item.synopsis" />

          <template #extra>
            <img :width="240" :alt="item.title" :src="item.preview_img" />
          </template>

          <template #actions>
            <span v-if="item.air_date">
              <calendar-outlined /> {{ toLocaleDate(item.air_date, locale) }}
            </span>
            <span v-if="item.runtime">
              <clock-circle-outlined /> {{ runtime2Duration(item.runtime) }}
            </span>
          </template>
        </a-list-item>
      </template>

      <template #footer>
        <a-typography-paragraph type="warning">
          <a-typography-text type="warning">
            Please verify the data carefully before inserting it to avoid
            incorrect entries.
          </a-typography-text>
        </a-typography-paragraph>
        <a-typography-paragraph>
          <a-checkbox v-model:checked="ignoreTitle">
            Leave the checkbox checked for episode titles that appear to be the
            drama name followed by a number.
          </a-checkbox>
        </a-typography-paragraph>
      </template>
    </a-list>
  </a-card>
</template>

<script setup>
const route = useRoute()
const { locale, locales } = useI18n()

const { availability } = defineProps({
  availability: {
    type: Array,
    default: () => [],
  },
})

const params = ref({
  url: '',
  language: locale.value,
  drama_id: route.params.drama_id,
})

watch(
  params,
  () => {
    if (params.value.url) {
      scrapeEpisodes()
    }
  },
  { deep: true },
)

const ignoreTitle = ref(true)

const tv = ref()
const episodes = ref([])
const loading = ref(false)

const scrapeEpisodes = () => {
  loading.value = true

  $fetch(`/api/scrape/tv/${route.params.drama_id}/episodes`, {
    method: 'get',
    params: params.value,
  })
    .then((data) => {
      const { episodes: tvEpisodes, ...rest } = data

      tv.value = rest
      episodes.value = tvEpisodes
    })
    .catch((error) => {
      episodes.value = []
      message.error(error.message)
    })
    .finally(() => {
      loading.value = false
    })
}

const onSubmit = async () => {
  const body = ignoreTitle.value
    ? episodes.value.map((e) => {
        delete e.title
        return e
      })
    : episodes.value

  await $fetch(`/api/scrape/tv/${route.params.drama_id}/episodes`, {
    method: 'post',
    body,
  })
    .then(() => {
      message.success('Episode synopses added successfully!')
    })
    .catch((error) => {
      message.error(error.message)
    })
}

defineExpose({
  onSubmit,
})
</script>
