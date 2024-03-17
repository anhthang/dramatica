<template>
  <div class="container drama-container">
    <a-page-header title="Trending">
      <a-row :gutter="[8, 8]" type="flex">
        <a-col
          v-for="drama in data"
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
    </a-page-header>
  </div>
</template>

<script setup>
const { data } = await useAsyncData(() => $fetch('/api/drama'))
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
  .ant-card-cover img {
    height: 320px;
    object-fit: cover;
  }
}
</style>
