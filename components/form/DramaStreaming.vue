<template>
  <Form
    v-slot="$form"
    :initial-values="service"
    :resolver
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <div class="flex flex-col gap-2">
      <label for="service_streaming_service">Streaming Service</label>
      <Select
        v-model="service.streaming_service"
        name="streaming_service"
        :options="Object.values(serviceMap)"
        :disabled="!!Object.keys(metadata).length"
      >
      </Select>
      <Message
        v-if="$form.streaming_service?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.streaming_service.error.message }}
      </Message>
    </div>

    <div class="flex flex-col gap-2">
      <label for="service_watch_link">Watch Link</label>
      <IconField>
        <InputIcon class="pi pi-external-link" />
        <InputText
          id="service_watch_link"
          v-model.trim="service.watch_link"
          name="watch_link"
          type="text"
          fluid
        />
      </IconField>
      <Message
        v-if="$form.watch_link?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.watch_link.error.message }}
      </Message>
    </div>

    <div class="flex flex-col gap-2">
      <Button label="Save" type="submit" :disabled="!$form.valid" />
    </div>
  </Form>
</template>

<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const emit = defineEmits(['onSuccess'])

const { metadata } = defineProps({
  isEdit: Boolean,
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
const toast = useToast()

const service = ref({
  drama_id: Number(route.params.drama_id),
  watch_link: '',
})

onMounted(() => {
  Object.assign(service.value, metadata)
})

const resolver = ref(
  zodResolver(
    z.object({
      streaming_service: z.enum(Object.values(serviceMap)),
      watch_link: z.string().url(),
    }),
  ),
)

const onSubmit = async ({ valid }) => {
  if (!valid) return

  $fetch(`/api/tv/${service.value.drama_id}/streaming`, {
    method: 'post',
    body: service.value,
  })
    .then(() => {
      toast.add({
        severity: 'success',
        summary: `[${service.value.streaming_service}] updated successfully!`,
        life: 3000,
      })

      emit('onSuccess', true)
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: error.message,
        life: 3000,
      })
    })
}
</script>
