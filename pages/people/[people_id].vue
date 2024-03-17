<template>
  <div class="container">
    <a-page-header v-if="people" :title="people.name">
      <template #extra>
        <a-button><edit-outlined /> Edit</a-button>
      </template>

      <a-row :gutter="[8, 8]" type="flex">
        <a-col :sm="6">
          <a-descriptions title="Personal Information" :column="1" size="small">
            <a-descriptions-item label="Native Name">
              {{ people.name_ch }}
            </a-descriptions-item>
            <a-descriptions-item label="Birthday">
              {{ people.dob }}
            </a-descriptions-item>
            <a-descriptions-item label="Gender">
              {{ people.gender }}
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
        <a-col :sm="18">
          <a-descriptions title="Biography" :column="1">
            <a-typography-text v-if="people.biography">
              {{ people.biography }}
            </a-typography-text>
            <a-typography-text v-else>
              We don't have a biography for {{ people.name }}
            </a-typography-text>
          </a-descriptions>

          <a-divider />

          <a-typography-title :level="5">Drama</a-typography-title>

          <a-timeline>
            <a-timeline-item v-for="drama in people.dramas" :key="drama.id">
              <a-typography-paragraph strong>
                {{ drama.drama.title }} ({{ drama.drama.release_year }})
              </a-typography-paragraph>
              <a-typography-paragraph type="secondary">
                {{ drama.character_name }}
              </a-typography-paragraph>
            </a-timeline-item>
          </a-timeline>
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script setup>
const route = useRoute()

const { data: people } = await useAsyncData(() =>
  $fetch(`/api/people/${route.params.people_id}`),
)

useSeoMeta({
  title: people.value && people.value.name,
  description: people.value && people.value.biography,
})
</script>
