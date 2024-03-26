<template>
  <a-page-header
    v-if="drama"
    class="container"
    :title="drama.title"
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

    <a-typography-title :level="4">Cast & Crew</a-typography-title>

    <a-row :gutter="[8, 8]" type="flex">
      <a-col v-for="actor in drama.cast" :key="actor.id" :xs="12" :sm="4">
        <card-people :people="actor" />
      </a-col>
    </a-row>

    <a-modal
      v-model:open="visible"
      title="Add Drama Cast"
      destroy-on-close
      @ok="addCast"
    >
      <form-drama-cast
        ref="dramaCastForm"
        type="cast"
        :existing-cast-member="drama.cast.map((a) => a.people_id)"
      />
    </a-modal>
  </a-page-header>
</template>

<script setup>
const route = useRoute()

const { data: drama, refresh } = await useAsyncData(() =>
  $fetch(`/api/${route.params.drama_id}`),
)

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
