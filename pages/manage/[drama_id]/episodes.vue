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

    <DataView
      :value="episodes"
      paginator
      :always-show-paginator="false"
      :rows="5"
    >
      <template #list="slotProps">
        <div
          v-for="(item, index) in slotProps.items"
          :key="index"
          class="py-3"
          :class="{
            'border-t border-zinc-100 dark:border-zinc-700': index !== 0,
          }"
        >
          <CardTVHorizontal
            :image="item.preview_img"
            :title="item.title"
            :content="item.synopsis"
            size="large"
          />
        </div>
      </template>
    </DataView>

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
