<template>
  <a-page-header
    v-if="drama"
    class="container"
    :title="drama.title"
    sub-title="Cast & Crew"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <a-button type="primary" @click="toggleAddCast">
        <user-add-outlined /> Add Cast
      </a-button>
    </template>

    <template #tags>
      <a-tag>{{ drama.release_year }}</a-tag>
    </template>

    <div
      v-for="role in roles"
      v-show="castByRole[role]"
      :key="role"
      style="margin-bottom: 16px"
    >
      <a-divider orientation="left">
        <a-typography-title :level="5">{{ role }}</a-typography-title>
      </a-divider>

      <a-row :gutter="[16, 16]" type="flex">
        <a-col v-for="cast in castByRole[role]" :key="cast.id" :xs="12" :sm="4">
          <card-people :people="cast" />
        </a-col>
      </a-row>
    </div>

    <a-modal
      v-model:open="visible"
      title="Add Cast"
      destroy-on-close
      @ok="addCast"
    >
      <form-drama-cast
        ref="dramaCastForm"
        type="cast"
        :existing="drama.cast.map((a) => a.people_id)"
      />
    </a-modal>
  </a-page-header>
</template>

<script setup>
import groupBy from 'lodash.groupby'

const route = useRoute()

const roles = ['Main', 'Supporting', 'Special Guest']

const { data: drama, refresh } = await useAsyncData(() =>
  $fetch(`/api/${route.params.drama_id}`),
)

const castByRole = computed(() => {
  return drama.value && groupBy(drama.value.cast, 'role')
})

const visible = ref(false)
const toggleAddCast = () => {
  visible.value = !visible.value
}

const dramaCastForm = ref()
const addCast = async () => {
  await dramaCastForm.value.onSubmit()

  toggleAddCast()
  refresh()
}

useSeoMeta({
  title:
    drama.value &&
    `Cast & Crew - ${drama.value.title} (${drama.value.release_year})`,
  description: drama.value && drama.value.synopsis,
})
</script>
