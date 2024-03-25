<template>
  <a-page-header class="container" title="TV">
    <a-card :loading="loading" title="Drama Information">
      <template #extra>
        <a-button
          v-if="!checked"
          type="primary"
          :disabled="!metadata.watch_link"
          :loading="loading"
          @click="fetchMetadata"
        >
          <import-outlined /> Import
        </a-button>
        <a-flex v-else gap="small">
          <a-button @click="toggleChecked">
            <arrow-left-outlined /> Back
          </a-button>
          <a-button type="primary" @click="onSave">
            <save-outlined /> Save
          </a-button>
        </a-flex>
      </template>

      <div v-if="!checked">
        <a-typography-paragraph>
          For new Chinese dramas streaming on WeTV, iQiyi, or Youku, you can
          enter the watch link below to automatically fetch information and then
          edit or update it as needed. Otherwise, you can choose to manually
          input the details.
        </a-typography-paragraph>

        <a-form :model="metadata">
          <a-form-item
            name="watch_link"
            :rules="[{ required: true, type: 'url' }]"
          >
            <a-input v-model:value="metadata.watch_link">
              <template #prefix><link-outlined /></template>
            </a-input>
          </a-form-item>
        </a-form>
      </div>

      <a-checkbox v-if="!checked" v-model:checked="checked">
        I would prefer to enter the information manually.
      </a-checkbox>

      <form-t-v v-if="checked" ref="tvForm" :metadata="metadata" />
    </a-card>
  </a-page-header>
</template>

<script setup>
const metadata = ref({
  watch_link: '',
})

const checked = ref(false)

watch(checked, () => {
  if (!checked.value) {
    metadata.value = {
      watch_link: '',
    }
  }
})

const loading = ref(false)

const fetchMetadata = () => {
  const { hostname } = new URL(metadata.value.watch_link)

  let source
  if (hostname.includes('iq.com') || hostname.includes('iqiyi')) {
    source = 'iqiyi'
  } else if (hostname.includes('youku')) {
    source = 'youku'
  } else if (hostname.includes('wetv')) {
    source = 'wetv'
  }

  if (source) {
    loading.value = true

    $fetch(`/api/metadata`, {
      method: 'get',
      params: {
        source,
        url: metadata.value.watch_link,
      },
    })
      .then((data) => {
        Object.assign(metadata.value, data)
        checked.value = true
      })
      .catch((error) => {
        message.error(error.message)
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    message.error(
      'This streaming service is not currently supported. Please use another link.',
    )
  }
}

const toggleChecked = () => {
  checked.value = !checked.value
}

const tvForm = ref()
const onSave = async () => {
  loading.value = true

  await tvForm.value.onSubmit()

  loading.value = false
}

useSeoMeta({
  title: 'TV',
})
</script>
