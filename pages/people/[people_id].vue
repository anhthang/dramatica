<template>
  <a-page-header v-if="people" class="container">
    <a-row :gutter="[16, 16]" type="flex">
      <a-col :sm="6">
        <a-flex vertical gap="large" align="center">
          <a-avatar
            :src="people.profile_url"
            :size="{ xs: 160, sm: 160, md: 160, lg: 240, xl: 240, xxl: 240 }"
          >
            <template #icon><user-outlined /></template>
          </a-avatar>

          <a-typography-title :level="3">
            {{ people.name }}
          </a-typography-title>

          <a-flex>
            <nuxt-link :to="people.weibo" target="_blank">
              <a-button type="text" size="large" :disabled="!people.weibo">
                <weibo-outlined />
              </a-button>
            </nuxt-link>
            <nuxt-link :to="people.douyin" target="_blank">
              <a-button type="text" size="large" :disabled="!people.douyin">
                <tik-tok-outlined />
              </a-button>
            </nuxt-link>
            <nuxt-link :to="people.instagram" target="_blank">
              <a-button type="text" size="large" :disabled="!people.instagram">
                <instagram-outlined />
              </a-button>
            </nuxt-link>
          </a-flex>
        </a-flex>
        <a-divider />

        <a-descriptions title="Personal Information" :column="1" size="small">
          <template #extra>
            <a-button @click="toggle('edit')"><edit-outlined /> Edit</a-button>
          </template>
          <a-descriptions-item label="Native Name">
            {{ people.native_name }}
          </a-descriptions-item>
          <a-descriptions-item label="Gender">
            {{ people.gender }}
          </a-descriptions-item>
          <a-descriptions-item label="Birthday">
            {{ toLocaleDate(people.dob) }}
          </a-descriptions-item>
          <!-- <a-descriptions-item label="Age">
              {{
                Math.floor(
                  (new Date() - new Date(people.dob).getTime()) / 3.15576e10,
                )
              }}
            </a-descriptions-item> -->
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
          <template #extra>
            <a-button type="link" @click="toggle('add_drama')">
              <video-camera-add-outlined /> Add
            </a-button>
          </template>
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
              <nuxt-link :to="`/${drama.drama_id}`">
                <a-card-meta
                  :title="drama.drama.title"
                  :description="drama.character_name"
                />
              </nuxt-link>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
    </a-row>

    <a-modal
      v-model:open="visible.edit"
      title="Edit People"
      destroy-on-close
      :width="1000"
      :confirm-loading="visible.loading"
      @ok="onEditPeople"
    >
      <form-people ref="peopleForm" :is-edit="true" :metadata="people" />
    </a-modal>

    <a-modal
      v-model:open="visible.add_drama"
      title="Add Drama"
      destroy-on-close
      :confirm-loading="visible.loading"
      @ok="onAddDrama"
    >
      <form-drama-cast
        ref="dramaCastForm"
        type="drama"
        :existing="people.dramas.map((d) => d.id)"
      />
    </a-modal>
  </a-page-header>
</template>

<script setup>
import groupBy from 'lodash.groupby'

const airingColor = {
  Airing: 'blue',
  Ended: 'green',
  Hiatus: 'orange',
}

const route = useRoute()

const { data: people, refresh } = await useAsyncData(() =>
  $fetch(`/api/people/${route.params.people_id}`),
)

const dramaByYear = computed(() =>
  groupBy(people.value.dramas, 'drama.release_year'),
)

useSeoMeta({
  title: people.value && people.value.name,
  description: people.value && people.value.biography,
  ogTitle: people.value && people.value.name,
  ogDescription: people.value && people.value.biography,
  ogImage: people.value && people.value.profile_url,
  twitterTitle: people.value && people.value.name,
  twitterDescription: people.value && people.value.biography,
  twitterImage: people.value && people.value.profile_url,
})

const visible = ref({
  edit: false,
  add_drama: false,
  loading: false,
})

const toggle = (key) => {
  visible.value[key] = !visible.value[key]
}

const peopleForm = ref()
const onEditPeople = async () => {
  toggle('loading')

  await peopleForm.value.onSubmit()

  toggle('loading')
  toggle('edit')
  refresh()
}

const dramaCastForm = ref()
const onAddDrama = async () => {
  toggle('loading')

  await dramaCastForm.value.onSubmit()

  toggle('loading')
  toggle('add_drama')
  refresh()
}
</script>
