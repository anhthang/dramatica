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

    <DataTable :value="drama.people" striped-rows sort-field="billing_order">
      <template #empty>
        No cast or crew members assigned. Add actors and staff to complete the
        drama details!
      </template>
      <Column field="name" header="Person">
        <template #body="{ data }">
          <CardPerson
            :image="data.person.profile_url"
            :title="toLocalePersonName(data.person, $i18n.locale)"
            simple
          />
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
            <NuxtLink :to="`/people/${data.person_id}`">
              <Button
                label="Profile"
                icon="pi pi-user"
                severity="info"
                size="small"
              />
            </NuxtLink>

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
</script>
