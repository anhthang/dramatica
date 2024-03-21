<template>
  <a-page-header class="container" title="TV">
    <a-card :loading="loading">
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

          <a-form-item>
            <a-button :disabled="!metadata.watch_link" @click="fetchMetadata">
              Fetch
            </a-button>
          </a-form-item>
        </a-form>
      </div>
      <a-checkbox v-model:checked="checked">
        I would prefer to enter the information manually.
      </a-checkbox>

      <form-t-v v-if="checked" :metadata="metadata" style="margin-top: 8px" />
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

useSeoMeta({
  title: 'TV',
})
</script>
