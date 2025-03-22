<template>
  <Panel>
    <template #icons>
      <Button
        label="Add"
        icon="pi pi-user-plus"
        size="small"
        @click="toggle('add')"
      />
    </template>

    <DataTable :value="drama.people" striped-rows>
      <Column field="name" header="Person">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <Avatar
              :image="data.person.profile_url"
              shape="circle"
              pt:image:class="object-cover"
            />
            <span>
              {{ toLocalePersonName(data.person, $i18n.locale) }}
            </span>
          </div>
        </template>
      </Column>
      <!-- <Column field="people.name" header="Name" /> -->
      <Column field="character_name" header="Character">
        <template #body="{ data }">
          {{ toLocaleCharacterName(data, $i18n.locale) }}
        </template>
      </Column>
      <Column field="role" header="Role" />
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
                  toggle('edit')
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
      v-model:visible="visible.add"
      modal
      header="Add Cast & Crew"
      dismissable-mask
      class="w-[36rem]"
    >
      <FormDramaPeople
        type="people"
        :existing="drama.people.map((a) => a.person_id)"
        @on-success="toggle"
      />
    </Dialog>

    <Dialog
      v-model:visible="visible.edit"
      modal
      header="Edit Cast & Crew"
      dismissable-mask
      class="w-[36rem]"
    >
      <FormDramaPeople
        type="people"
        :edit="true"
        :metadata="selection"
        @on-success="toggle"
      />
    </Dialog>

    <Toast />
  </Panel>
</template>

<script setup>
// import keyBy from 'lodash.keyby'

definePageMeta({ layout: 'tv' })

const route = useRoute()
// const { locale } = useI18n()

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

// const translation = computed(() => {
//   const translationMap = keyBy(drama.value.translations, 'language')

//   return translationMap[locale.value] || translationMap.en
// })

const visible = ref({
  add: false,
  edit: false,
})

const selection = ref()

const toggle = (key, shouldRefresh) => {
  visible.value[key] = !visible.value[key]

  if (shouldRefresh) {
    refresh()
  }
}

// useSeoMeta({
//   title: drama.value && `Cast & Crew - ${translation.value.title_year}`,
//   description: drama.value && translation.value.synopsis,
// })
</script>
