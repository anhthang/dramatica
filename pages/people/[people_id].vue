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

          <a-card title="Drama">
            <a-timeline
              v-for="year of Object.keys(dramaByYear).reverse()"
              :key="year"
            >
              <a-timeline-item>
                <template #dot>
                  <clock-circle-outlined style="font-size: 16px" />
                </template>
                <a-typography-title :level="5">{{ year }}</a-typography-title>
              </a-timeline-item>

              <a-timeline-item
                v-for="drama in dramaByYear[year]"
                :key="drama.id"
                :color="airingColor[drama.drama.airing_status] || 'gray'"
              >
                <a-card-meta
                  :title="drama.drama.title"
                  :description="drama.character_name"
                />
              </a-timeline-item>
            </a-timeline>
          </a-card>
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script setup>
import groupBy from 'lodash.groupby'

const airingColor = {
  Airing: 'blue',
  Ended: 'green',
  Hiatus: 'orange',
}

const route = useRoute()

const { data: people } = await useAsyncData(() =>
  $fetch(`/api/people/${route.params.people_id}`),
)

const dramaByYear = computed(() =>
  groupBy(people.value.dramas, 'drama.release_year'),
)

useSeoMeta({
  title: people.value && people.value.name,
  description: people.value && people.value.biography,
})
</script>
