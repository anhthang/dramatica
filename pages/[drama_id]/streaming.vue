<template>
  <div>
    <Panel
      v-if="drama"
      header="Streaming Services"
      pt:root:class="!border-0 !bg-transparent"
      pt:title:class="flex items-center gap-4 font-medium text-3xl"
    >
      <template #icons>
        <Button label="Add" icon="pi pi-video" @click="toggle" />
      </template>

      <DataTable :value="drama.availability" striped-rows>
        <Column field="streaming_service" header="Streaming Service">
          <template #body="{ data }">
            <img
              v-if="themeSpecificServices.includes(data.streaming_service)"
              :src="`/logo/${data.streaming_service.toLowerCase()}-${$colorMode.value}.png`"
              :alt="data.streaming_service"
              class="h-5"
            />
            <img
              v-else
              :src="`/logo/${data.streaming_service.toLowerCase()}.png`"
              :alt="data.streaming_service"
              class="h-5"
            />
          </template>
        </Column>
        <Column field="watch_link" header="Watch Link">
          <template #body="{ data }">
            <NuxtLink :to="data.watch_link" target="_blank">
              {{ data.watch_link }}
            </NuxtLink>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button
                label="Edit"
                icon="pi pi-pen-to-square"
                severity="secondary"
                size="small"
                @click="
                  () => {
                    selection = data
                    toggle()
                  }
                "
              />
              <!-- <Button
                label="Delete"
                icon="pi pi-trash"
                severity="danger"
                size="small"
              /> -->
            </div>
          </template>
        </Column>
      </DataTable>

      <Dialog
        v-model:visible="visible"
        modal
        :header="selection ? 'Edit Streaming Service' : 'Add Streaming Service'"
        dismissable-mask
        class="w-[36rem]"
      >
        <FormDramaStreaming
          :metadata="selection"
          :existing="drama.availability.map((s) => s.streaming_service)"
          @on-success="toggle"
        />
      </Dialog>
    </Panel>
  </div>
</template>

<script setup>
import keyBy from 'lodash.keyby'

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

useSeoMeta({
  title: drama.value && `Streaming Services - ${translation.value.title_year}`,
  description: drama.value && translation.value.synopsis,
})

const visible = ref(false)
const selection = ref()

const toggle = (shouldRefresh) => {
  visible.value = !visible.value

  if (shouldRefresh) {
    refresh()
  }
}
</script>
