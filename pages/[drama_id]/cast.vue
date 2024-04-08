<template>
  <a-page-header v-if="drama" class="container" title="Cast & Crew">
    <template #breadcrumb>
      <a-breadcrumb>
        <a-breadcrumb-item>
          <nuxt-link to="/"> Home </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/${drama.id}`">
            {{ drama.title }} ({{ drama.release_year }})
          </nuxt-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </template>

    <template #extra>
      <a-dropdown>
        <a-button type="primary"><user-add-outlined /> Add</a-button>
        <template #overlay>
          <a-menu @click="(e) => toggle(e.key)">
            <a-menu-item key="cast"> Add Cast </a-menu-item>
            <a-menu-item key="crew"> Add Crew </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col :xs="24" :sm="16" :lg="18">
        <div v-for="role in roles.cast" v-show="drama.people[role]" :key="role">
          <a-divider orientation="left">
            <a-typography-title :level="5">{{ role }}</a-typography-title>
          </a-divider>

          <a-row :gutter="[16, 16]" type="flex">
            <a-col
              v-for="people in drama.people[role]"
              :key="people.id"
              :xs="24"
              :md="12"
              :lg="8"
            >
              <card-people :people="people" />
            </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :xs="24" :sm="8" :lg="6">
        <div
          v-for="role in roles.crew"
          v-show="drama.people[role]"
          :key="role"
          class="drama-crew"
        >
          <a-divider orientation="left">
            <a-typography-title :level="5">{{ role }}</a-typography-title>
          </a-divider>

          <a-row :gutter="[16, 16]" type="flex">
            <a-col
              v-for="people in drama.people[role]"
              :key="people.id"
              :xs="24"
            >
              <card-people :people="people" />
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>

    <a-modal
      v-model:open="visible.cast"
      title="Add Cast"
      destroy-on-close
      :confirm-loading="visible.loading"
      @ok="addDramaMember('cast')"
    >
      <form-drama-people
        ref="peopleForm"
        type="cast"
        :existing="drama.cast.map((a) => a.people_id)"
      />
    </a-modal>

    <a-modal
      v-model:open="visible.crew"
      title="Add Crew"
      destroy-on-close
      :confirm-loading="visible.loading"
      @ok="addDramaMember('crew')"
    >
      <form-drama-people
        ref="peopleForm"
        type="crew"
        :existing="drama.crew.map((a) => a.people_id)"
      />
    </a-modal>
  </a-page-header>
</template>

<script setup>
import groupBy from 'lodash.groupby'

const route = useRoute()

const { data: drama, refresh } = await useAsyncData(
  () => $fetch(`/api/${route.params.drama_id}`),
  {
    transform: (data) => {
      const people = data.cast.concat(data.crew)
      data.people = groupBy(people, 'role')

      return data
    },
  },
)

const visible = ref({
  cast: false,
  crew: false,
  loading: false,
})

const toggle = (key) => {
  visible.value[key] = !visible.value[key]
}

const peopleForm = ref()
const addDramaMember = async (key) => {
  toggle('loading')

  await peopleForm.value.onSubmit()

  toggle('loading')
  toggle(key)
  refresh()
}

useSeoMeta({
  title:
    drama.value &&
    `Cast & Crew - ${drama.value.title} (${drama.value.release_year})`,
  description: drama.value && drama.value.synopsis,
})
</script>

<style>
.drama-crew .ant-card-meta-detail {
  display: flex;
  align-items: center;
}
</style>
