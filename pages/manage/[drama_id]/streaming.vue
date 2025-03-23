<template>
  <Panel>
    <template #icons>
      <Button label="Add" icon="pi pi-desktop" size="small" @click="toggle" />
    </template>

    <DataTable :value="drama.availability" striped-rows>
      <template #empty>
        No streaming services linked. Add a platform to make this drama
        accessible!
      </template>
      <Column field="streaming_service" header="Service">
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
</template>

<script setup>
definePageMeta({ layout: 'tv' })

const route = useRoute()

const { data: drama, refresh } = await useAsyncData(
  `drama-${route.params.drama_id}`,
  () => $fetch(`/api/${route.params.drama_id}`),
  {
    transform: (data) => {
      const people = data.cast.concat(data.crew)
      data.people = people
      return data
    },
  },
)

const visible = ref(false)
const selection = ref()

const toggle = (shouldRefresh) => {
  visible.value = !visible.value

  if (shouldRefresh) {
    refresh()
  }
}
</script>
