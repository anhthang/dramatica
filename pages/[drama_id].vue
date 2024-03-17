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
          <a-card>
            <a-card-meta
              :title="actor.character_name"
              :description="actor.character_name_vi"
            >
              <template #avatar>
                <a-avatar size="large">
                  {{ actor.character_name.charAt(0) }}
                </a-avatar>
              </template>
            </a-card-meta>
          </a-card>
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
