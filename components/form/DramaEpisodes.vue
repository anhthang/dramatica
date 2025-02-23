<template>
  <a-card v-if="tv" :loading="pending">
    <template v-if="!pending" #cover>
      <img :src="tv.cover_url" />
    </template>

    <a-card-meta :title="tv.title" :description="tv.synopsis" />

    <a-list
      v-if="tv.episodes.length"
      item-layout="vertical"
      :data-source="tv.episodes"
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
              <calendar-outlined /> {{ toLocaleDate(item.air_date, language) }}
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
import keyBy from 'lodash.keyby'
import pick from 'lodash.pick'

const route = useRoute()

const props = defineProps({
  availability: {
    type: Array,
    default: () => [],
  },
  language: {
    type: String,
    required: true,
  },
})

const { data: tv, pending } = useAsyncData(
  () =>
    Promise.all(
      props.availability.map((s) =>
        $fetch(`/api/scrape/tv/${route.params.drama_id}/episodes`, {
          method: 'get',
          params: {
            url: s.watch_link,
            drama_id: route.params.drama_id,
            language: props.language,
          },
        }).catch(() => {
          // sometime netflix scraper is broken
          return undefined
        }),
      ),
    ),
  {
    watch: [() => props.language],
    transform: (data) => {
      const [original, netflix] = data
      if (netflix) {
        const epMap = keyBy(netflix.episodes, 'episode_number')

        original.episodes.forEach((ep) => {
          if (epMap[ep.episode_number]) {
            const picked = pick(epMap[ep.episode_number], [
              'title',
              'synopsis',
              'synopsis_source',
              'preview_img',
            ])

            Object.assign(ep, picked)
          }
        })
      }

      return original
    },
  },
)

const ignoreTitle = ref(true)

const onSubmit = async () => {
  const body = ignoreTitle.value
    ? tv.value.episodes.map((e) => {
        delete e.title
        return e
      })
    : tv.value.episodes

  await $fetch(`/api/tv/${route.params.drama_id}/episodes`, {
    method: 'post',
    body,
  })
    .then(() => {
      message.success('Episodes added/updated successfully!')
    })
    .catch((error) => {
      message.error(error.message)
    })
}

defineExpose({
  onSubmit,
})
</script>
