<template>
  <Panel>
    <template #icons>
      <Button
        label="Fetch"
        icon="pi pi-sync"
        size="small"
        @click="toggleFetch"
      />
    </template>

    <DataTable
      :value="episodes"
      striped-rows
      paginator
      :always-show-paginator="false"
      rows="8"
    >
      <template #empty>
        No episodes added yet. Start by adding the first episode to keep track
        of the series!
      </template>
      <Column field="episode_number" header="Episode" />
      <Column field="preview_image">
        <template #body="{ data }">
          <CardTVHorizontal
            :image="data.preview_img"
            :title="data.title"
            :content="data.synopsis"
            size="large"
          />
        </template>
      </Column>
    </DataTable>

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
    <Toast />
  </Panel>
</template>

<script setup>
import keyBy from 'lodash.keyby'

definePageMeta({ layout: 'tv' })

const route = useRoute()
const { locale } = useI18n()

const { data: drama, refresh } = await useAsyncData(
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
const toggleFetch = (shouldRefresh) => {
  visible.value = !visible.value

  if (shouldRefresh) {
    refresh()
  }
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
