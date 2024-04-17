<template>
  <a-page-header class="container drama-container">
    <div
      v-for="(tab, tIdx) in Object.keys(tabKeyMap)"
      :key="tab"
      style="margin-bottom: 24px"
    >
      <a-flex v-if="tabList[tab].length" justify="space-between">
        <a-typography-title :level="4">
          <notification-outlined v-if="tab === 'Airing'" />
          <rise-outlined v-if="tab === 'Trending'" />
          <alert-outlined v-if="tab === 'Upcoming'" />
          {{ $t(tab) }}
        </a-typography-title>
        <a-flex v-if="tabList[tab].length > 1">
          <a-button type="text" @click="prev(tIdx)">
            <left-outlined />
          </a-button>
          <a-button type="text" @click="next(tIdx)">
            <right-outlined />
          </a-button>
        </a-flex>
      </a-flex>

      <a-carousel ref="slider" arrows>
        <div v-for="(dramas, idx) in tabList[tab]" :key="idx">
          <a-row :gutter="[16, 16]" type="flex">
            <a-col
              v-for="drama in dramas"
              :key="drama.id"
              :xs="24"
              :md="8"
              :lg="6"
              :xl="4"
            >
              <nuxt-link :to="`/${drama.id}`">
                <a-card hoverable :loading="pending">
                  <template v-if="!pending" #cover>
                    <a-image
                      :preview="false"
                      :alt="drama.title"
                      :src="drama.poster_url"
                    />
                  </template>

                  <a-card-meta :title="drama.title">
                    <template #description>
                      <a-flex justify="space-between">
                        <span
                          ><calendar-outlined />
                          {{ toLocaleDate(drama.air_date, locale) }}</span
                        >
                        <span
                          ><number-outlined />
                          {{ drama.number_of_episodes }}</span
                        >
                      </a-flex>
                    </template>
                  </a-card-meta>
                </a-card>
              </nuxt-link>
            </a-col>
          </a-row>
        </div>
      </a-carousel>
    </div>
  </a-page-header>
</template>

<script setup>
import chunk from 'lodash.chunk'
import groupBy from 'lodash.groupby'

const tabKeyMap = {
  Airing: 'Airing',
  Trending: 'Ended',
  Upcoming: 'Upcoming',
}

const { locale } = useI18n()

const { data, pending } = await useAsyncData(
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

const slider = ref()
const next = (idx) => {
  slider.value[idx].next()
}
const prev = (idx) => {
  slider.value[idx].prev()
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: calc(100vh - 128px); /** minus header & footer */
  display: flex;
  flex-direction: column;
  max-width: 1600px;
}

.drama-container {
  .ant-card-cover {
    height: var(--poster-height);
    overflow: hidden;

    img {
      height: var(--poster-height);
      object-fit: cover;
    }
  }
}

/** Global */
.duplicate-alert {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1.5rem;
}

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
