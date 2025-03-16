<template>
  <Form
    v-slot="$form"
    :initial-values="translation"
    :resolver
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <div class="flex flex-col gap-2">
      <RadioButtonGroup name="language" class="flex flex-wrap gap-4">
        <div
          v-for="{ code, name } in allowedLocales"
          :key="code"
          class="flex items-center gap-2"
        >
          <RadioButton input-id="code" :value="code" />
          <label for="code">{{ name }}</label>
        </div>
      </RadioButtonGroup>
      <Message
        v-if="$form.language?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.language.error?.message }}
      </Message>
    </div>

    <div class="flex flex-col gap-2">
      <label for="translation_watch_link">Watch Link</label>
      <IconField>
        <InputIcon class="pi pi-video" />
        <InputText
          id="translation_watch_link"
          v-model.trim="translation.watch_link"
          name="watch_link"
          type="text"
          fluid
        />
        <InputIcon
          class="pi pi-search cursor-pointer hover:text-green-400"
          @click="fetchMetadata"
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
      <label for="translation_title">Title</label>
      <IconField>
        <InputIcon class="pi pi-pencil" />
        <InputText
          id="translation_title"
          v-model.trim="translation.title"
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
      <label for="translation_synopsis">Synopsis</label>
      <Textarea
        id="translation_synopsis"
        v-model.trim="translation.synopsis"
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
      <label for="translation_synopsis_source">Source</label>
      <IconField>
        <InputIcon class="pi pi-pencil" />
        <InputText
          id="translation_synopsis_source"
          v-model.trim="translation.synopsis_source"
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
      <label for="translation_poster_url">Poster</label>
      <IconField>
        <InputIcon class="pi pi-image" />
        <InputText
          id="translation_poster_url"
          v-model.trim="translation.poster_url"
          name="poster_url"
          type="text"
          fluid
        />
      </IconField>
      <Message
        v-if="$form.poster_url?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.poster_url.error.message }}
      </Message>
    </div>

    <div class="flex flex-col gap-2">
      <label for="translation_cover">Cover</label>
      <IconField>
        <InputIcon class="pi pi-image" />
        <InputText
          id="translation_cover"
          v-model.trim="translation.cover_url"
          name="cover"
          type="text"
          fluid
        />
      </IconField>
      <Message
        v-if="$form.cover?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.cover.error.message }}
      </Message>
    </div>

    <div class="flex flex-col gap-2">
      <Button
        label="Save"
        type="submit"
        :disabled="!$form.valid"
        :loading="loading"
      />
    </div>
  </Form>
</template>

<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import pick from 'lodash.pick'
import { z } from 'zod'

const emit = defineEmits(['onSuccess'])

const { translations } = defineProps({
  translations: {
    type: Array,
    default: () => [],
  },
})

const { locale, locales } = useI18n()
const route = useRoute()
const toast = useToast()

const allowedLocales = locales.value.filter(({ code }) => code !== 'en')

const translation = ref({
  drama_id: Number(route.params.drama_id),
  language: locale.value !== 'en' ? locale.value : allowedLocales[0].code,
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

watch(
  () => translation.value.language,
  () => {
    const translated = translations.find(
      (t) => t.language === translation.value.language,
    )
    if (translated) {
      Object.assign(translation.value, translated)
    }
  },
)

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

const resolver = ref(
  zodResolver(
    z.object({
      title: z.string().min(1),
      synopsis: z.string().nullish(),
      synopsis_source: z.string().nullish(),
      poster_url: z.string().url().nullish().or(z.string().min(0).max(0)),
      cover_url: z.string().url().nullish().or(z.string().min(0).max(0)),
      watch_link: z.string().url().nullish().or(z.string().min(0).max(0)),
    }),
  ),
)

const onSubmit = async ({ valid }) => {
  if (!valid) return

  $fetch(`/api/tv/${translation.value.drama_id}/translation`, {
    method: 'post',
    body: translation.value,
  })
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Translation updated successfully!',
        life: 3000,
      })

      emit('onSuccess', 'translation', true)
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
