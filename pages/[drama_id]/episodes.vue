<template>
  <!-- <a-page-header v-if="drama" class="container" title="Episodes">
    <a-modal
      v-model:open="visible"
      title="Sync Episodes"
      destroy-on-close
      :width="800"
      @ok="addEpisodes"
    >
      <a-form layout="vertical">
        <a-form-item name="language" label="Language">
          <a-radio-group
            v-model:value="language"
            :options="
              locales.map(({ code, name }) => ({ value: code, label: name }))
            "
          />
        </a-form-item>
      </a-form>

      <form-drama-episodes
        ref="episodesForm"
        :language="language"
        :availability="availability"
      />
    </a-modal>
  </a-page-header> -->

  <div>
    <Panel
      v-if="drama"
      header="Episodes"
      pt:root:class="!border-0 !bg-transparent"
      pt:title:class="flex items-center gap-4 font-medium text-3xl"
    >
      <template #icons>
        <Button label="Sync" icon="pi pi-sync" @click="toggleSync" />
      </template>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <CardEpisode
          v-for="episode in episodes"
          :key="episode.episode_number"
          :episode="episode"
        />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import keyBy from 'lodash.keyby'

const route = useRoute()
const { locale } = useI18n()

const { data: drama } = await useAsyncData(
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

const visible = ref(false)
const toggleSync = () => {
  visible.value = !visible.value
}

// const episodesForm = ref()
// const addEpisodes = async () => {
//   await episodesForm.value.onSubmit()

//   toggleSync()
//   refresh()
// }

// const language = ref(locale.value)

// const availability = computed(() => {
//   const original = drama.value.translations.filter(
//     (t) => t.language === language.value,
//   )

//   const netflix = drama.value.availability.filter(
//     (s) => s.streaming_service === 'Netflix',
//   )

//   return original.concat(netflix)
// })

useSeoMeta({
  title: drama.value && `Episodes - ${translation.value.title_year}`,
  description: drama.value && translation.value.synopsis,
})
</script>
