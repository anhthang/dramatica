<template>
  <div>
    <Panel
      v-if="drama"
      :header="translation.title_year"
      :pt="{
        root: '!border-0 !bg-transparent',
        title: 'flex items-center gap-4 font-medium text-3xl',
        headerActions: 'flex gap-2',
      }"
    >
      <template #icons>
        <Button label="Fetch" icon="pi pi-sync" @click="toggleFetch" />
      </template>

      <Tabs value="episodes">
        <TVTabList :id="drama.id" current-tab="episodes" />

        <TabPanels class="bg-transparent">
          <TabPanel value="episodes">
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <CardEpisode
                v-for="episode in episodes"
                :key="episode.episode_number"
                :episode="episode"
              />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Dialog
        v-model:visible="visible"
        modal
        header="Episode Information"
        dismissable-mask
        class="w-[48rem]"
      >
        <FormDramaEpisodes
          :availability="availability"
          @on-success="toggleFetch"
        />
      </Dialog>
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
const toggleFetch = () => {
  visible.value = !visible.value
}

const availability = computed(() => {
  const netflix = drama.value.availability.filter(
    (s) => s.streaming_service === 'Netflix',
  )

  return drama.value.translations.concat(netflix)
})

useSeoMeta({
  title: drama.value && `Episodes - ${translation.value.title_year}`,
  description: drama.value && translation.value.synopsis,
})
</script>
