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
      <NuxtLink :to="`/manage/${drama.id}`">
        <Button label="Manage" icon="pi pi-th-large" severity="secondary" />
      </NuxtLink>
    </template>

    <Tabs value="information">
      <TabList pt:tablist:class="bg-transparent">
        <Tab v-for="tab in tabs" :key="tab.label" :value="tab.value">
          <div class="flex items-center gap-2 text-inherit">
            <i :class="tab.icon" />
            <span>{{ $t(tab.label) }}</span>
          </div>
        </Tab>
      </TabList>

      <TabPanels class="bg-transparent">
        <TabPanel value="information">
          <div class="grid grid-cols-1 lg:grid-cols-10 gap-12 mt-2">
            <div class="col-span-1 lg:col-span-6">
              <DescriptionList :descriptions="descriptions" />

              <Tabs v-if="availability.length" value="where_to_watch">
                <TabList pt:tablist:class="bg-transparent">
                  <Tab value="where_to_watch">
                    <div class="flex items-center gap-2 text-inherit">
                      <i class="pi pi-desktop" />
                      <span>{{ $t('Where to Watch') }}</span>
                    </div>
                  </Tab>
                </TabList>
                <TabPanels class="bg-transparent">
                  <TabPanel value="where_to_watch">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                      <NuxtLink
                        v-for="service in availability"
                        :key="service.id"
                        :to="service.watch_link"
                        target="_blank"
                      >
                        <img
                          :src="
                            themeSpecificServices.includes(
                              service.streaming_service,
                            )
                              ? `/logo/${service.streaming_service.toLowerCase()}-${$colorMode.value}.png`
                              : `/logo/${service.streaming_service.toLowerCase()}.png`
                          "
                          :alt="service.streaming_service"
                          :data-name="`/logo/${service.streaming_service.toLowerCase()}-${$colorMode.value}.png`"
                          class="w-1/2"
                        />
                      </NuxtLink>
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>

            <div class="col-span-1 lg:col-span-4 flex flex-col gap-4">
              <img :alt="translation.title" :src="translation.cover_url" />

              <div class="flex gap-4">
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

        <TabPanel value="cast">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              class="col-span-4 md:col-span-3 flex flex-col gap-4"
              :class="{
                'md:col-span-4': !hasCrew,
              }"
            >
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
                      class="grid grid-cols-2 lg:grid-cols-3 gap-4"
                      :class="{
                        'lg:grid-cols-4': !hasCrew,
                      }"
                    >
                      <NuxtLink
                        v-for="people in items"
                        :key="people.id"
                        :to="`/people/${people.person_id}`"
                      >
                        <CardPerson
                          :image="people.person.profile_url"
                          size="xlarge"
                          :title="toLocalePersonName(people.person, locale)"
                          :subtitle="toLocaleCharacterName(people, locale)"
                        />
                      </NuxtLink>
                    </div>
                  </template>
                </DataView>
              </Fieldset>
            </div>
            <div
              v-if="hasCrew"
              class="col-span-4 md:col-span-1 flex flex-col gap-4"
            >
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
                    <NuxtLink
                      v-for="people in items"
                      :key="people.id"
                      :to="`/people/${people.person_id}`"
                    >
                      <CardPerson
                        :image="people.person.profile_url"
                        size="xlarge"
                        :title="toLocalePersonName(people.person, locale)"
                      />
                    </NuxtLink>
                  </template>
                </DataView>
              </Fieldset>
            </div>
          </div>
        </TabPanel>

        <TabPanel value="episodes">
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <CardEpisode
              v-for="episode in episodes"
              :key="episode.episode_number"
              :episode="episode"
            />
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <Toast />
  </Panel>
</template>

<script setup>
import groupBy from 'lodash.groupby'
import keyBy from 'lodash.keyby'

const { locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()
const toast = useToast()

const tabs = ref([
  {
    route: `/${route.params.drama_id}`,
    value: 'information',
    label: 'Information',
    icon: 'pi pi-info-circle',
  },
  {
    route: `/${route.params.drama_id}/cast`,
    value: 'cast',
    label: 'Cast',
    icon: 'pi pi-users',
  },
  {
    route: `/${route.params.drama_id}/episodes`,
    value: 'episodes',
    label: 'Episodes',
    icon: 'pi pi-youtube',
  },
])

const { data: drama } = await useAsyncData(
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

const hasCrew = drama.value.people.some((p) => roles.crew.includes(p.role))

const peopleByRole = computed(
  () => drama && groupBy(drama.value.people, 'role'),
)

const episodes = computed(() =>
  drama.value.episodes.filter((e) => e.language === locale.value),
)

const availability = computed(() => {
  return drama.value.watch_link
    ? [
        {
          drama_id: drama.value.id,
          watch_link: translation.value.watch_link,
          streaming_service: getStreamingService(drama.value.watch_link),
        },
        ...drama.value.availability,
      ]
    : drama.value.availability
})

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

  toast.add({
    severity: 'success',
    summary: 'Copied to clipboard!',
    life: 3000,
  })
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
</script>
