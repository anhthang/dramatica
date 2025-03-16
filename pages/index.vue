<template>
  <Panel
    header="Homepage"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <div v-for="(tab, tIdx) in Object.keys(tabKeyMap)" :key="tab" class="mb-4">
      <TVCarousel :key="tIdx" :heading="tab" :items="tabList[tab]" />
    </div>
  </Panel>
</template>

<script setup>
import groupBy from 'lodash.groupby'

const tabKeyMap = {
  Airing: 'Airing',
  Trending: 'Ended',
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
    out[tab] = tvs[status]

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
