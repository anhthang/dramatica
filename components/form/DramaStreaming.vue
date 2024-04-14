<template>
  <a-form :ref="formRef" layout="vertical" :model="service" :rules="formRules">
    <a-form-item
      ref="streaming_service"
      name="streaming_service"
      label="Streaming Service"
      v-bind="validateInfos.streaming_service"
    >
      <a-select
        v-model:value="service.streaming_service"
        :options="
          Object.values(serviceMap).map((value) => ({
            value,
            label: value,
            disabled: existing.includes(value),
          }))
        "
      />
    </a-form-item>

    <a-form-item
      ref="watch_link"
      name="watch_link"
      label="Watch Link"
      v-bind="validateInfos.watch_link"
    >
      <a-input v-model:value="service.watch_link">
        <template #prefix><link-outlined /></template>
      </a-input>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { Form } from 'ant-design-vue'

const { metadata, existing } = defineProps({
  existing: {
    type: Array,
    default: () => [],
  },
  metadata: {
    type: Object,
    default: () => ({}),
  },
})

const route = useRoute()

const service = ref({
  drama_id: Number(route.params.drama_id),
  watch_link: '',
})

onMounted(() => {
  Object.assign(service.value, metadata)
})

const formRef = ref()
const formRules = ref({
  streaming_service: [
    {
      required: true,
      type: 'enum',
      enum: Object.values(serviceMap),
      trigger: ['change', 'blur'],
    },
  ],
  watch_link: [{ required: true, type: 'url', trigger: ['change', 'blur'] }],
})

const { useForm } = Form
const { validate, validateInfos } = useForm(service, formRules)

const onSubmit = async () => {
  await validate()
    .then(() => {
      $fetch(`/api/tv/${service.value.drama_id}/streaming`, {
        method: 'post',
        body: service.value,
      })
        .then(() => {
          message.success(
            `[${languages[service.value.streaming_service]}] added/updated successfully!`,
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
