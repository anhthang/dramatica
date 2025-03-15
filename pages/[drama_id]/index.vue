<template>
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
      <Button
        label="Edit"
        icon="pi pi-pen-to-square"
        severity="secondary"
        @click="toggle('edit')"
      />
      <Button
        label="Translation"
        icon="pi pi-language"
        severity="secondary"
        @click="toggle('translation')"
      />
    </template>

    <Tabs value="information">
      <TabList>
        <Tab v-for="tab in items" :key="tab.label" :value="tab.value">
          <router-link
            v-if="tab.route"
            v-slot="{ href, navigate }"
            :to="tab.route"
            custom
          >
            <a
              v-ripple
              :href="href"
              class="flex items-center gap-2 text-inherit"
              @click="navigate"
            >
              <i :class="tab.icon" />
              <span>{{ $t(tab.label) }}</span>
            </a>
          </router-link>
          <div v-else class="flex items-center gap-2 text-inherit">
            <i :class="tab.icon" />
            <span>{{ $t(tab.label) }}</span>
          </div>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="information">
          <div class="grid grid-cols-1 lg:grid-cols-10 gap-12 mt-2">
            <div class="col-span-1 lg:col-span-6">
              <DescriptionList :descriptions="descriptions" />
            </div>

            <div class="col-span-1 lg:col-span-4 flex flex-col gap-4">
              <img :alt="translation.title" :src="translation.cover_url" />

              <div class="flex gap-4">
                <NuxtLink
                  v-if="translation.watch_link"
                  :to="translation.watch_link"
                  target="_blank"
                  style="width: 100%"
                >
                  <Button
                    :label="$t('Watch')"
                    icon="pi pi-play-circle"
                    size="large"
                    fluid
                    :class="{
                      '!bg-[#ff4a22] border-[#ff4a22]': streaming === 'wetv',
                      '!bg-[#1cc749] border-[#1cc749]': streaming === 'iqiyi',
                      '!bg-[#e50914] border-[#e50914]': streaming === 'netflix',
                      '!bg-[#2c78ff] border-[#2c78ff]': streaming === 'youku',
                    }"
                  />
                </NuxtLink>
                <Button
                  :label="$t('Share')"
                  icon="pi pi-share-alt"
                  size="large"
                  fluid
                  @click="copyUrl"
                />
              </div>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <Dialog
      v-model:visible="visible.edit"
      modal
      header="Edit Drama"
      dismissable-mask
      class="w-[72rem]"
    >
      <FormTV :is-edit="true" :metadata="drama" @on-success="toggle" />
    </Dialog>

    <Dialog
      v-model:visible="visible.translation"
      modal
      header="Drama Translation"
      dismissable-mask
      class="w-[72rem]"
    >
      <FormDramaTranslation
        :translations="drama.translations"
        @on-success="toggle"
      />
    </Dialog>
  </Panel>
</template>

<script setup>
import keyBy from 'lodash.keyby'

const route = useRoute()
const config = useRuntimeConfig()

const { locale } = useI18n()

const { data: drama, refresh } = await useAsyncData(
  `drama-${route.params.drama_id}`,
  () => $fetch(`/api/${route.params.drama_id}`),
)

const items = ref([
  { value: 'information', label: 'Information', icon: 'pi pi-video' },
  {
    route: `/${drama.value.id}/cast`,
    value: 'cast',
    label: 'Cast',
    icon: 'pi pi-users',
  },
  {
    route: `/${drama.value.id}/episodes`,
    value: 'episodes',
    label: 'Episodes',
    icon: 'pi pi-desktop',
  },
  {
    route: `/${drama.value.id}/streaming`,
    value: 'where_to_watch',
    label: 'Where to Watch',
    icon: 'pi pi-youtube',
  },
])

const translation = computed(() => {
  const translationMap = keyBy(drama.value.translations, 'language')

  return translationMap[locale.value] || translationMap.en
})

const streaming = getStreamingService(
  translation.value.watch_link,
).toLowerCase()

const airDate = ({ air_date, end_date }) => {
  return end_date
    ? `${toLocaleDate(air_date, locale.value)} - ${toLocaleDate(end_date, locale.value)}`
    : toLocaleDate(air_date, locale.value)
}

const descriptions = computed(() => {
  return [
    { title: 'Status', value: drama.value.airing_status },
    { title: 'Number of episodes', value: drama.value.number_of_episodes },
    { title: 'Airing Platform', value: drama.value.airing_platform },
    {
      title: 'Genres',
      value: drama.value.genres.map(({ name }) => name).join(', '),
    },
    { title: 'Aired', value: airDate(drama.value) },
    { title: 'Synopsis', value: translation.value.synopsis },
  ]
})

const copyUrl = () => {
  navigator.clipboard.writeText(config.app.homepage + route.fullPath)
  message.success('Copied to clipboard!')
}

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
  loading: false,
})

const toggle = (key, shouldRefresh) => {
  visible.value[key] = !visible.value[key]

  if (shouldRefresh) {
    refresh()
  }
}
</script>
