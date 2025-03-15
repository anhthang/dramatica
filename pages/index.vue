<template>
  <Panel
    header="Homepage"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <div v-for="(tab, tIdx) in Object.keys(tabKeyMap)" :key="tab" class="mb-4">
      <Carousel
        :key="tIdx"
        :value="tabList[tab]"
        :num-visible="6"
        :num-scroll="1"
        circular
        :autoplay-interval="3000"
      >
        <template #item="{ data: page }">
          <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4"
          >
            <CardTVPoster v-for="tv in page" :key="tv.idx" :tv="tv" />
          </div>
        </template>
      </Carousel>
    </div>
  </Panel>
</template>

<script setup>
import chunk from 'lodash.chunk'
import groupBy from 'lodash.groupby'

const tabKeyMap = {
  Airing: 'Airing',
  // Trending: 'Ended',
  Upcoming: 'Upcoming',
}

const { locale } = useI18n()

const { data } = await useAsyncData(
  () => $fetch('/api/drama', { params: { language: locale.value } }),
  { watch: [locale] },
)

const tabList = computed(() => {
  const tvs = groupBy(data.value, 'airing_status')

  return Object.entries(tabKeyMap).reduce((out, [tab, status]) => {
    out[tab] = chunk(tvs[status], 6)

    return out
  }, {})
})
</script>

<style>
/** Global */
.card-highlighted {
  background-color: var(--card-highlighted-bg-light);
  border-color: var(--card-highlighted-border);
}

html.dark-mode .card-highlighted {
  background-color: var(--card-highlighted-bg-dark);
}

.card-highlighted::after {
  position: absolute;
  inset-block-start: 2px;
  inset-inline-end: 2px;
  width: 0;
  height: 0;
  border: 10px solid var(--card-highlighted-border);
  border-block-end: 10px solid transparent;
  border-inline-start: 10px solid transparent;
  border-start-end-radius: 6px;
  content: '';
}
</style>
