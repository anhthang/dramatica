<template>
  <Panel
    v-if="people"
    :header="peopleName"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <template #icons>
      <Button label="Add" icon="pi pi-video" @click="toggle('add_drama')" />
    </template>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="col-span-4 md:col-span-1 flex flex-col gap-4">
        <div class="flex flex-col gap-4 items-center">
          <Avatar
            :image="people.profile_url"
            :alt="peopleName"
            shape="circle"
            class="w-48 h-48"
            pt:image:class="object-cover"
          />

          <!-- <div class="text-3xl">{{ peopleName }}</div> -->

          <div class="flex gap-2">
            <NuxtLink :to="people.weibo" target="_blank">
              <Button
                text
                icon="pi pi-comment"
                size="large"
                :disabled="!people.weibo"
              />
            </NuxtLink>
            <NuxtLink :to="people.douyin" target="_blank">
              <Button
                text
                icon="pi pi-tiktok"
                size="large"
                :disabled="!people.douyin"
              />
            </NuxtLink>
            <NuxtLink :to="people.instagram" target="_blank">
              <Button
                text
                icon="pi pi-instagram"
                size="large"
                :disabled="!people.instagram"
              />
            </NuxtLink>
          </div>
        </div>

        <Divider />

        <DescriptionList
          heading="Personal Information"
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
        <Tabs value="drama">
          <TabList>
            <Tab value="drama" as="div" class="flex items-center gap-2">
              <i class="pi pi-video" />
              <span>Drama</span>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="drama">
              <div
                v-for="year of Object.keys(dramaByYear).reverse()"
                :key="year"
              >
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
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>

    <Dialog
      v-model:visible="visible.edit"
      modal
      header="Edit People"
      dismissable-mask
      class="w-[72rem]"
    >
      <FormPeople :is-edit="true" :metadata="people" @on-success="toggle" />
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
        :existing="people.dramas.map((d) => d.drama_id)"
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

const { data: people, refresh } = await useAsyncData(
  `people-${route.params.people_id}-${locale.value}`,
  () =>
    $fetch(`/api/people/${route.params.people_id}`, {
      params: { language: locale.value },
    }),
  {
    watch: [locale],
  },
)

const descriptions = computed(() => {
  return [
    { title: 'Native Name', value: people.value.native_name },
    { title: 'Gender', value: people.value.gender },
    { title: 'Birthday', value: toLocaleDate(people.value.dob, locale) },
  ]
})

const dramaByYear = computed(() =>
  groupBy(people.value.dramas, (i) => i.drama.release_year || 'TBA'),
)

const peopleName = computed(() =>
  toLocalePeopleName(people.value, locale.value),
)

useSeoMeta({
  title: peopleName,
  description: people.value && people.value.biography,
  ogTitle: peopleName,
  ogDescription: people.value && people.value.biography,
  ogImage: people.value && people.value.profile_url,
  twitterTitle: peopleName,
  twitterDescription: people.value && people.value.biography,
  twitterImage: people.value && people.value.profile_url,
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
