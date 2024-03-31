<template>
  <a-page-header class="container drama-container">
    <a-tabs v-model:activeKey="activeKey" size="large">
      <template #rightExtra>
        <a-pagination
          v-model:current="page"
          :page-size="size"
          :total="tabShows.length"
          simple
          hide-on-single-page
        />
      </template>

      <a-tab-pane v-for="tab in tabs" :key="tab">
        <template #tab>
          <notification-outlined v-if="tab === 'Airing'" />
          <rise-outlined v-if="tab === 'Trending'" />
          {{ tab }}
        </template>

        <a-row :gutter="[16, 16]" type="flex">
          <a-col
            v-for="drama in currentPage"
            :key="drama.id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <nuxt-link :to="`/${drama.id}`">
              <a-card hoverable>
                <template #cover>
                  <a-image
                    :preview="false"
                    :alt="drama.title"
                    :src="drama.poster_url"
                  />
                </template>

                <a-card-meta
                  :title="drama.title"
                  :description="`${drama.number_of_episodes} episodes`"
                />
              </a-card>
            </nuxt-link>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </a-page-header>
</template>

<script setup>
const activeKey = ref('Airing')
const tabs = ['Airing', 'Trending']

const tabKeyMap = {
  Airing: 'Airing',
  Trending: 'Ended',
}

const { data } = await useAsyncData(() => $fetch('/api/drama'))

const page = ref(1)
const size = 12

const tabShows = computed(() =>
  data.value.filter((tv) => tv.airing_status === tabKeyMap[activeKey.value]),
)

const currentPage = computed(() =>
  tabShows.value.slice((page.value - 1) * size, page.value * size),
)
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
