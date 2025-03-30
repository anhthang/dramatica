<template>
  <Form
    v-slot="$form"
    :initial-values="episode"
    :resolver
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <div class="flex flex-col gap-2">
      <label for="title">Title</label>
      <IconField>
        <InputIcon class="pi pi-pencil" />
        <InputText
          id="title"
          v-model.trim="episode.title"
          name="title"
          type="text"
          fluid
        />
      </IconField>
      <Message
        v-if="$form.title?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.title.error.message }}
      </Message>
    </div>

    <div class="flex flex-col gap-2">
      <label for="synopsis">Synopsis</label>
      <Textarea
        id="synopsis"
        v-model.trim="episode.synopsis"
        name="synopsis"
        :rows="5"
        auto-resize
      />
      <Message severity="secondary" size="small" variant="simple">
        When copying a synopsis from another source, please include a citation
        at the field below.
      </Message>
    </div>

    <div class="flex flex-col gap-2">
      <label for="synopsis_source">Source</label>
      <IconField>
        <InputIcon class="pi pi-pencil" />
        <InputText
          id="synopsis_source"
          v-model.trim="episode.synopsis_source"
          name="synopsis_source"
          type="text"
          fluid
        />
      </IconField>
      <Message
        v-if="$form.synopsis_source?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.synopsis_source.error.message }}
      </Message>
    </div>

    <div class="flex flex-col gap-2">
      <label for="air_date">Air Date</label>
      <DatePicker
        v-model="episode.air_date"
        date-format="dd/mm/yy"
        show-button-bar
        class="w-full"
      />
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
  edit: Boolean,
  metadata: {
    type: Object,
    default: () => ({}),
  },
})

const route = useRoute()
const toast = useToast()

const episode = ref({
  drama_id: route.params.drama_id,
})

onBeforeMount(() => {
  Object.assign(episode.value, metadata)

  if (metadata.air_date) {
    episode.value.air_date = new Date(metadata.air_date)
  }
})

const resolver = ref(
  zodResolver(
    z.object({
      title: z.string().nullish(),
      synopsis: z.string().nullish(),
      synopsis_source: z.string().nullish(),
      air_date: z.date(),
    }),
  ),
)

const onSubmit = async ({ valid }) => {
  if (!valid) return

  if (episode.value.air_date) {
    episode.value.air_date = toISODate(episode.value.air_date)
  }

  $fetch(`/api/tv/${episode.value.drama_id}/episodes`, {
    method: 'post',
    body: [episode.value],
  })
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Episode updated successfully!',
        life: 3000,
      })

      emit('onSuccess', 'edit', true)
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
