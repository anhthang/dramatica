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
        <Button label="Add" icon="pi pi-user-plus" @click="toggle('add')" />
        <Button
          label="Edit"
          icon="pi pi-user-edit"
          severity="secondary"
          @click="toggle('edit')"
        />
      </template>

      <Tabs value="cast">
        <TVTabList :id="drama.id" current-tab="cast" />

        <TabPanels class="bg-transparent">
          <TabPanel value="cast">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="col-span-4 md:col-span-3 flex flex-col gap-4">
                <Fieldset
                  v-for="role in roles.cast"
                  v-show="peopleByRole[role]"
                  :key="role"
                  pt:legend:class="w-auto"
                >
                  <template #legend>
                    <div class="flex items-center gap-2">
                      <span class="pi pi-users" />
                      <span class="font-semibold"> {{ role }} </span>
                    </div>
                  </template>

                  <DataView
                    :value="peopleByRole[role]"
                    layout="grid"
                    :pt="{
                      header: '!bg-transparent !border-0 text-lg font-medium',
                      content: '!bg-transparent',
                    }"
                  >
                    <template #grid="{ items }">
                      <div
                        class="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
                      >
                        <CardPeople
                          v-for="people in items"
                          :key="people.id"
                          :people="people"
                        />
                      </div>
                    </template>
                  </DataView>
                </Fieldset>
              </div>
              <div class="col-span-4 md:col-span-1 flex flex-col gap-4">
                <Fieldset
                  v-for="role in roles.crew"
                  v-show="peopleByRole[role]"
                  :key="role"
                  pt:legend:class="w-auto"
                >
                  <template #legend>
                    <div class="flex items-center gap-2">
                      <span class="pi pi-book" />
                      <span class="font-semibold"> {{ role }} </span>
                    </div>
                  </template>

                  <DataView
                    :value="peopleByRole[role]"
                    layout="grid"
                    :pt="{
                      header: '!bg-transparent !border-0 text-lg font-medium',
                      content: '!bg-transparent',
                    }"
                  >
                    <template #grid="{ items }">
                      <CardPeople
                        v-for="people in items"
                        :key="people.id"
                        :people="people"
                      />
                    </template>
                  </DataView>
                </Fieldset>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Dialog
        v-model:visible="visible.add"
        modal
        header="Add Cast & Crew"
        dismissable-mask
        class="w-[36rem]"
      >
        <FormDramaPeople
          type="people"
          :existing="drama.people.map((a) => a.people_id)"
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
          :metadata="drama.people"
          @on-success="toggle"
        />
      </Dialog>
    </Panel>
  </div>
</template>

<script setup>
import groupBy from 'lodash.groupby'
import keyBy from 'lodash.keyby'

const route = useRoute()
const { locale } = useI18n()

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

const translation = computed(() => {
  const translationMap = keyBy(drama.value.translations, 'language')

  return translationMap[locale.value] || translationMap.en
})

const peopleByRole = computed(
  () => drama && groupBy(drama.value.people, 'role'),
)

const visible = ref({
  add: false,
  edit: false,
})

const toggle = (key, shouldRefresh) => {
  visible.value[key] = !visible.value[key]

  if (shouldRefresh) {
    refresh()
  }
}

useSeoMeta({
  title: drama.value && `Cast & Crew - ${translation.value.title_year}`,
  description: drama.value && translation.value.synopsis,
})
</script>
