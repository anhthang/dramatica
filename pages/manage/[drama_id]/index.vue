<template>
  <Panel>
    <template #icons>
      <Button
        label="Translation"
        icon="pi pi-language"
        severity="secondary"
        size="small"
        @click="toggle('translation')"
      />
    </template>

    <FormTV :is-edit="true" :metadata="drama" @on-success="toggle" />

    <Dialog
      v-model:visible="visible.translation"
      modal
      header="Drama Translation"
      dismissable-mask
      class="w-[48rem]"
    >
      <FormDramaTranslation
        :translations="drama.translations"
        @on-success="toggle"
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

const visible = ref({
  edit: false,
  translation: false,
})

const toggle = (key, shouldRefresh) => {
  visible.value[key] = !visible.value[key]

  if (shouldRefresh) {
    refresh()
  }
}
</script>
