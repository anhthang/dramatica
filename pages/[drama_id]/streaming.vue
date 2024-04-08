<template>
  <a-page-header v-if="drama" class="container" title="Streaming Services">
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
      <a-button type="primary" @click="toggle('open')">
        <video-camera-add-outlined /> Add
      </a-button>
    </template>

    <a-table
      :data-source="drama.availability"
      :columns="columns"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'streaming_service'">
          <img
            v-if="themeSpecificServices.includes(record.streaming_service)"
            :src="`/logo/${record.streaming_service.toLowerCase()}-${$colorMode.value}.png`"
            :alt="record.streaming_service"
            :height="20"
          />
          <img
            v-else
            :src="`/logo/${record.streaming_service.toLowerCase()}.png`"
            :alt="record.streaming_service"
            :height="20"
          />
        </template>

        <template v-if="column.key === 'watch_link'">
          <nuxt-link :to="record.watch_link" target="_blank">
            {{ record.watch_link }}
          </nuxt-link>
        </template>

        <template v-if="column.key === 'action'">
          <a-button @click="toggle('open', record)">
            <edit-outlined /> Edit
          </a-button>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="visible.open"
      :title="selection ? 'Edit Streaming Service' : 'Add Streaming Service'"
      destroy-on-close
      :confirm-loading="visible.loading"
      @ok="addStreamingService"
    >
      <form-drama-streaming ref="streamingForm" :metadata="selection" />
    </a-modal>
  </a-page-header>
</template>

<script setup>
const route = useRoute()

const { data: drama, refresh } = await useAsyncData(() =>
  $fetch(`/api/${route.params.drama_id}`),
)

useSeoMeta({
  title:
    drama.value &&
    `Streaming Services - ${drama.value.title} (${drama.value.release_year})`,
  description: drama.value && drama.value.synopsis,
})

const columns = [
  {
    title: 'Streaming Service',
    dataIndex: 'streaming_service',
    key: 'streaming_service',
  },
  {
    title: 'Watch Link',
    dataIndex: 'watch_link',
    key: 'watch_link',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

const visible = ref({
  loading: false,
  open: false,
})

const selection = ref()

const toggle = (key, record) => {
  visible.value[key] = !visible.value[key]

  selection.value = record
}

const streamingForm = ref()
const addStreamingService = async () => {
  toggle('loading')

  await streamingForm.value.onSubmit()

  toggle('loading')
  toggle('open')
  refresh()
}
</script>
