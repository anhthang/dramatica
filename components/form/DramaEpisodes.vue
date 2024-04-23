<template>
  <a-form layout="vertical" :model="params">
    <a-form-item
      ref="url"
      name="url"
      label="Website"
      :rules="[{ required: true, type: 'url' }]"
    >
      <a-input-search
        v-model:value.trim="params.url"
        enter-button
        :loading="loading"
        @search="scrapeEpisodes"
      >
        <template #prefix><link-outlined /></template>
      </a-input-search>
      <template #extra>
        Provide a link to the source website to import episode synopses. Please
        note that this feature currently only supports Netflix.
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

  <a-card v-if="tv">
    <template #cover>
      <img :src="tv.cover_url" />
    </template>

    <a-card-meta :title="tv.title" :description="tv.synopsis" />

    <a-list
      v-if="episodes.length"
      item-layout="horizontal"
      :data-source="episodes"
      :pagination="{ pageSize: 5, simple: true }"
    >
      <template #header>
        <a-typography-text strong> Synopses </a-typography-text>
      </template>

      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta :description="item.synopsis">
            <template #title>
              <a-flex justify="space-between">
                <span>{{ item.title }}</span>
                <span>{{ runtime2Duration(item.runtime) }}</span>
              </a-flex>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>

      <template #footer>
        <a-typography-text type="warning">
          Please verify the data carefully before inserting it to avoid
          incorrect entries.
        </a-typography-text>
      </template>
    </a-list>
  </a-card>
</template>

<script setup>
const route = useRoute()
const { locale, locales } = useI18n()

const { url } = defineProps({
  url: {
    type: String,
    default: '',
  },
})

const params = ref({
  url: '',
  language: locale.value,
  drama_id: route.params.drama_id,
})

onMounted(() => {
  if (url) {
    params.value.url = url
  }
})

watch(params, () => scrapeEpisodes(), { deep: true })

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
  await $fetch(`/api/scrape/tv/${route.params.drama_id}/episodes`, {
    method: 'post',
    body: episodes.value,
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
