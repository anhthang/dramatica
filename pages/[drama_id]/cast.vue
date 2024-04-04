<template>
  <a-page-header
    v-if="drama"
    class="container"
    :title="drama.title"
    sub-title="Cast & Crew"
    @back="() => $router.go(-1)"
  >
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

    <template #tags>
      <a-tag>{{ drama.release_year }}</a-tag>
    </template>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col :sm="19">
        <div v-for="role in roles.cast" v-show="drama.people[role]" :key="role">
          <a-divider orientation="left">
            <a-typography-title :level="5">{{ role }}</a-typography-title>
          </a-divider>

          <a-row :gutter="[16, 16]" type="flex">
            <a-col
              v-for="people in drama.people[role]"
              :key="people.id"
              :xs="12"
              :sm="6"
            >
              <card-people :people="people" />
            </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :sm="5">
        <div v-for="role in roles.crew" v-show="drama.people[role]" :key="role">
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
import sortBy from 'lodash.sortby'

const route = useRoute()

const { data: drama, refresh } = await useAsyncData(
  () => $fetch(`/api/${route.params.drama_id}`),
  {
    transform: (data) => {
      const people = data.cast.concat(data.crew)
      data.people = groupBy(
        sortBy(people, ['billing_order', 'people.name']),
        'role',
      )

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
