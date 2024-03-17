<template>
  <div class="container">
    <a-page-header
      v-if="drama"
      :title="drama.title"
      @back="() => $router.go(-1)"
    >
      <template #extra>
        <a-button><edit-outlined /> Edit</a-button>
      </template>

      <template #tags>
        <a-tag>{{ drama.release_year }}</a-tag>
      </template>

      <a-flex justify="space-between" gap="middle">
        <a-typography>
          <a-typography-paragraph>
            {{ drama.synopsis }}
          </a-typography-paragraph>
        </a-typography>

        <img alt="avatar" :src="drama.poster_url" :width="250" />
      </a-flex>

      <a-row :gutter="[8, 8]" type="flex">
        <a-col v-for="actor in drama.cast" :key="actor.id" :xs="12" :sm="4">
          <nuxt-link :to="`/people/${actor.people_id}`">
            <a-card>
              <a-card-meta
                :title="actor.people.name"
                :description="actor.character_name"
              >
                <template #avatar>
                  <a-avatar :src="actor.people.profile_url" size="large">
                    {{ actor.people.name.charAt(0) }}
                  </a-avatar>
                </template>
              </a-card-meta>
            </a-card>
          </nuxt-link>
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script setup>
const route = useRoute()

const { data: drama } = await useAsyncData(() =>
  $fetch(`/api/${route.params.drama_id}`),
)

useSeoMeta({
  title: drama.value && `${drama.value.title} (${drama.value.release_year})`,
  description: drama.value && drama.value.synopsis,
})
</script>
