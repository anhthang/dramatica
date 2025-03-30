<template>
  <Panel>
    <template #icons>
      <Button
        label="Fetch"
        icon="pi pi-sync"
        size="small"
        @click="toggle('fetch')"
      />
    </template>

    <DataTable
      :value="episodes"
      striped-rows
      paginator
      :always-show-paginator="false"
      :rows="8"
    >
      <template #empty>
        No episodes added yet. Start by adding the first episode to keep track
        of the series!
      </template>
      <Column field="episode_number">
        <template #body="{ data }">
          <Avatar :label="data.episode_number.toString()" shape="circle" />
        </template>
      </Column>
      <Column field="preview_image" header="Episode">
        <template #body="{ data }">
          <CardTVHorizontal
            :image="data.preview_img"
            :title="data.title"
            :subtitle="runtime2Duration(data.runtime)"
            extra-subtitle
            :content="data.synopsis"
            size="large"
          />
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <Button
            label="Edit"
            icon="pi pi-pen-to-square"
            severity="secondary"
            size="small"
            @click="
              () => {
                selection = data
                toggle('edit')
              }
            "
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="visible.edit"
      modal
      :header="`Edit Episode ${selection?.episode_number}`"
      dismissable-mask
      class="w-[48rem]"
    >
      <FormEpisode :metadata="selection" @on-success="toggle" />
    </Dialog>

    <Dialog
      v-model:visible="visible.fetch"
      modal
      header="Episode Information"
      dismissable-mask
      class="w-[48rem]"
    >
      <FormDramaEpisodes :availability="availability" @on-success="toggle" />
    </Dialog>
    <Toast />
  </Panel>
</template>

<script setup>
definePageMeta({ layout: 'tv' })

const route = useRoute()
const { locale } = useI18n()

const { data: drama, refresh } = await useAsyncData(
  `drama-${route.params.drama_id}`,
  () => $fetch(`/api/${route.params.drama_id}`),
)

const episodes = computed(() =>
  drama.value.episodes.filter((e) => e.language === locale.value),
)

const selection = ref()

const visible = ref({
  edit: false,
  fetch: false,
})

const toggle = (key, shouldRefresh) => {
  visible.value[key] = !visible.value[key]

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
</script>
