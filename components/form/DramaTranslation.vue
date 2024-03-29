<template>
  <a-form
    :ref="formRef"
    layout="vertical"
    :model="translation"
    :rules="formRules"
  >
    <a-form-item
      ref="language"
      name="language"
      label="Language"
      v-bind="validateInfos.title"
    >
      <a-radio-group
        v-model:value="translation.language"
        :options="
          Object.entries(languages).map(([value, label]) => ({ value, label }))
        "
      />
    </a-form-item>

    <a-form-item
      ref="watch_link"
      name="watch_link"
      label="Watch Link"
      v-bind="validateInfos.watch_link"
    >
      <a-input-search
        v-model:value="translation.watch_link"
        enter-button
        :loading="loading"
        @search="fetchMetadata"
      >
        <template #prefix><link-outlined /></template>
      </a-input-search>
      <template #extra>
        You can enter the watch link here to automatically fetch information and
        then edit or update it as needed.
      </template>
    </a-form-item>

    <a-form-item
      ref="title"
      name="title"
      label="Title"
      v-bind="validateInfos.title"
    >
      <a-input v-model:value="translation.title">
        <template #prefix><font-size-outlined /></template>
      </a-input>
    </a-form-item>

    <a-form-item
      ref="synopsis"
      name="synopsis"
      v-bind="validateInfos.synopsis"
      label="Synopsis"
    >
      <a-textarea v-model:value="translation.synopsis" />
      <template #extra>
        When copying a synopsis from another source, please include a citation
        at the field below.
      </template>
    </a-form-item>

    <a-form-item
      ref="synopsis_source"
      name="synopsis_source"
      label="Source"
      v-bind="validateInfos.synopsis_source"
    >
      <a-input v-model:value="translation.synopsis_source">
        <template #prefix><font-size-outlined /></template>
      </a-input>
    </a-form-item>

    <a-form-item
      ref="poster_url"
      name="poster_url"
      label="Poster"
      v-bind="validateInfos.poster_url"
    >
      <a-input v-model:value="translation.poster_url">
        <template #prefix><file-image-outlined /></template>
      </a-input>
    </a-form-item>

    <a-form-item
      ref="cover_url"
      name="cover_url"
      label="Cover"
      v-bind="validateInfos.cover_url"
    >
      <a-input v-model:value="translation.cover_url">
        <template #prefix><file-image-outlined /></template>
      </a-input>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { Form } from 'ant-design-vue'
import pick from 'lodash.pick'

const { translations } = defineProps({
  translations: {
    type: Array,
    default: () => [],
  },
})

const route = useRoute()

const languages = {
  vi: 'Vietnamese',
}

const translation = ref({
  drama_id: Number(route.params.drama_id),
  language: 'vi',
  watch_link: '',
})

onMounted(() => {
  const translated = translations.find(
    (t) => t.language === translation.value.language,
  )
  if (translated) {
    Object.assign(translation.value, translated)
  }
})

const loading = ref(false)

const fetchMetadata = () => {
  loading.value = true

  $fetch('/api/scrape/tv', {
    method: 'get',
    params: {
      url: translation.value.watch_link,
      language: translation.value.language,
    },
  })
    .then((data) => {
      const translated = pick(data, [
        'title',
        'synopsis',
        'synopsis_source',
        'watch_link',
        'poster_url',
        'cover_url',
      ])

      Object.assign(translation.value, translated)
    })
    .catch((error) => {
      message.error(error.message)
    })
    .finally(() => {
      loading.value = false
    })
}

const formRef = ref()
const formRules = ref({
  title: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
  synopsis: [{ type: 'string', trigger: ['change', 'blur'] }],
  synopsis_source: [{ type: 'string', trigger: ['change', 'blur'] }],
  poster_url: [{ type: 'url', trigger: ['change', 'blur'] }],
  cover_url: [{ type: 'url', trigger: ['change', 'blur'] }],
  // trailer_url: [{ type: 'url', trigger: ['change', 'blur'] }],
  watch_link: [{ type: 'url', trigger: ['change', 'blur'] }],
})

const { useForm } = Form
const { validate, validateInfos } = useForm(translation, formRules)

const onSubmit = async () => {
  await validate()
    .then(() => {
      $fetch(`/api/tv/${translation.value.drama_id}/translation`, {
        method: 'post',
        body: translation.value,
      })
        .then(() => {
          message.success(
            `[${languages[translation.value.language]}] added successfully!`,
          )
        })
        .catch((error) => {
          console.error(error)
        })
    })
    .catch(() => {
      // nothing
    })
}

defineExpose({
  onSubmit,
})
</script>
