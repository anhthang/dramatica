<template>
  <Panel
    v-if="person"
    :header="personName"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="col-span-4 md:col-span-1 flex flex-col gap-4">
        <div class="flex flex-col gap-4 items-center">
          <Avatar
            :image="person.profile_url"
            :alt="personName"
            shape="circle"
            class="w-48 h-48"
            pt:image:class="object-cover"
          />

          <!-- <div class="text-3xl">{{ peopleName }}</div> -->

          <div class="flex gap-2">
            <NuxtLink :to="person.weibo" target="_blank">
              <Button
                text
                icon="pi pi-comment"
                size="large"
                :disabled="!person.weibo"
              />
            </NuxtLink>
            <NuxtLink :to="person.douyin" target="_blank">
              <Button
                text
                icon="pi pi-tiktok"
                size="large"
                :disabled="!person.douyin"
              />
            </NuxtLink>
            <NuxtLink :to="person.instagram" target="_blank">
              <Button
                text
                icon="pi pi-instagram"
                size="large"
                :disabled="!person.instagram"
              />
            </NuxtLink>
          </div>
        </div>

        <Divider />

        <DescriptionList
          title="Personal Information"
          :subtitle="person.biography"
          :descriptions="descriptions"
        />

        <Button
          label="Edit"
          icon="pi pi-pen-to-square"
          severity="secondary"
          fluid
          @click="toggle('edit')"
        />
      </div>
      <div class="col-span-4 md:col-span-3 flex flex-col gap-4">
        <Panel>
          <template #icons>
            <Button
              label="Add"
              icon="pi pi-video"
              size="small"
              @click="toggle('add_drama')"
            />
          </template>
          <div v-for="year of Object.keys(dramaByYear).reverse()" :key="year">
            <Timeline
              :value="[year]"
              class="my-4"
              pt:event-opposite:class="hidden"
            >
              <template #marker="{ item }">
                <span class="text-xl font-medium">{{ item }}</span>
              </template>
            </Timeline>

            <Timeline
              :value="dramaByYear[year]"
              pt:root:class="gap-4"
              pt:event-opposite:class="hidden"
              pt:event-content:class="flex items-center"
            >
              <template #marker="{ item }">
                <i
                  v-if="item.drama.airing_status === 'Ended'"
                  class="pi pi-check-circle text-green-500"
                />
                <i
                  v-if="item.drama.airing_status === 'Airing'"
                  class="pi pi-play-circle text-blue-500"
                />
              </template>
              <template #content="{ item }">
                <NuxtLink :to="`/${item.drama.id}`" class="flex-1">
                  <CardTVHorizontal
                    :image="item.drama.cover_url"
                    :title="item.drama.title"
                    :subtitle="toLocaleCharacterName(item, locale)"
                    :content="$t(item.role)"
                  />
                </NuxtLink>
                <Button
                  label="Edit"
                  icon="pi pi-pen-to-square"
                  severity="secondary"
                  size="small"
                  @click="
                    () => {
                      metadata = item
                      toggle('edit_drama')
                    }
                  "
                />
              </template>
            </Timeline>
          </div>
        </Panel>
      </div>
    </div>

    <Dialog
      v-model:visible="visible.edit"
      modal
      header="Edit Person"
      dismissable-mask
      class="w-[72rem]"
    >
      <FormPerson :is-edit="true" :metadata="person" @on-success="toggle" />
    </Dialog>

    <Dialog
      v-model:visible="visible.add_drama"
      modal
      header="Add Drama People"
      dismissable-mask
      class="w-[36rem]"
    >
      <FormDramaPeople
        type="drama"
        :existing="person.dramas.map((d) => d.drama_id)"
        @on-success="toggle"
      />
    </Dialog>

    <Dialog
      v-model:visible="visible.edit_drama"
      modal
      header="Edit Drama People"
      dismissable-mask
      class="w-[36rem]"
    >
      <FormDramaPeople
        type="drama"
        :edit="true"
        :metadata="metadata"
        @on-success="toggle"
      />
    </Dialog>

    <Toast />
  </Panel>
</template>

<script setup>
import { CardTVHorizontal } from '#components'
import groupBy from 'lodash.groupby'

const { locale } = useI18n()
const route = useRoute()

const metadata = ref()

const { data: person, refresh } = await useAsyncData(
  `people-${route.params.person_id}-${locale.value}`,
  () =>
    $fetch(`/api/people/${route.params.person_id}`, {
      params: { language: locale.value },
    }),
  {
    watch: [locale],
  },
)

const descriptions = computed(() => {
  return [
    { title: 'Native Name', value: person.value.native_name },
    { title: 'Gender', value: person.value.gender },
    { title: 'Birthday', value: toLocaleDate(person.value.dob, locale) },
  ]
})

const dramaByYear = computed(() =>
  groupBy(person.value.dramas, (i) => i.drama.release_year || 'TBA'),
)

const personName = computed(() =>
  toLocalePersonName(person.value, locale.value),
)

useSeoMeta({
  title: personName,
  description: person.value && person.value.biography,
  ogTitle: personName,
  ogDescription: person.value && person.value.biography,
  ogImage: person.value && person.value.profile_url,
  twitterTitle: personName,
  twitterDescription: person.value && person.value.biography,
  twitterImage: person.value && person.value.profile_url,
})

const visible = ref({
  edit: false,
  add_drama: false,
  edit_drama: false,
})

const toggle = (key, shouldRefresh) => {
  visible.value[key] = !visible.value[key]

  if (shouldRefresh) {
    refresh()
  }
}
</script>
