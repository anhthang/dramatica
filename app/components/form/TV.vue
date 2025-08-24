<template>
  <PotentialDuplicatesTV v-if="!isEdit && tv.title" :props="tv" class="mb-12" />

  <Skeleton v-if="loading" class="!h-40" />
  <Form
    v-else
    v-slot="$form"
    :initial-values="tv"
    :resolver
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-3 gap-4">
      <div class="flex flex-col gap-2">
        <label for="title">Title</label>
        <IconField>
          <InputIcon class="pi pi-pencil" />
          <InputText
            id="title"
            v-model.trim="tv.title"
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
        <label for="title_pinyin">Pinyin Title</label>
        <IconField>
          <InputIcon class="pi pi-pencil" />
          <InputText
            id="title_pinyin"
            v-model.trim="tv.title_pinyin"
            name="title_pinyin"
            type="text"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.title_pinyin?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.title_pinyin.error.message }}
        </Message>
      </div>

      <div class="flex flex-col gap-2">
        <label for="original_title">Original Title</label>
        <IconField>
          <InputIcon class="pi pi-pencil" />
          <InputText
            id="original_title"
            v-model.trim="tv.original_title"
            name="original_title"
            type="text"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.original_title?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.original_title.error.message }}
        </Message>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label for="synopsis">Synopsis</label>
      <Textarea
        id="synopsis"
        v-model.trim="tv.synopsis"
        name="synopsis"
        :rows="5"
        auto-resize
      />
      <Message severity="secondary" size="small" variant="simple">
        When copying a synopsis from another source, please include a citation
        at the field below.
      </Message>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="flex flex-col gap-2">
        <label for="synopsis_source">Source</label>
        <IconField>
          <InputIcon class="pi pi-pencil" />
          <InputText
            id="synopsis_source"
            v-model.trim="tv.synopsis_source"
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
        <label for="airing_platform">Airing Platform</label>
        <IconField>
          <InputIcon class="pi pi-desktop" />
          <InputText
            id="airing_platform"
            v-model.trim="tv.airing_platform"
            name="airing_platform"
            type="text"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.airing_platform?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.airing_platform.error.message }}
        </Message>
      </div>

      <div class="flex flex-col gap-2">
        <label for="watch_link">Watch Link</label>
        <IconField>
          <InputIcon class="pi pi-video" />
          <InputText
            id="watch_link"
            v-model.trim="tv.watch_link"
            name="watch_link"
            type="text"
            fluid
          />
          <InputIcon
            class="pi pi-sync cursor-pointer hover:text-emerald-500"
            @click="fetchMetadata(tv.watch_link)"
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
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="flex flex-col gap-2">
        <label for="release_year">Release Year</label>
        <IconField>
          <InputIcon class="pi pi-hashtag" />
          <InputNumber
            v-model.number="tv.release_year"
            input-id="release_year"
            name="release_year"
            :use-grouping="false"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.release_year?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.release_year.error.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="number_of_episodes">Total Episodes</label>
        <IconField>
          <InputIcon class="pi pi-hashtag" />
          <InputNumber
            v-model.number="tv.number_of_episodes"
            input-id="number_of_episodes"
            name="number_of_episodes"
            :use-grouping="false"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.number_of_episodes?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.number_of_episodes.error.message }}
        </Message>
      </div>

      <div class="flex flex-col gap-2">
        <label for="rating_name">Rating</label>
        <IconField>
          <InputIcon class="pi pi-shield" />
          <InputText
            id="rating_name"
            v-model.trim="tv.rating_name"
            name="rating_name"
            type="text"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.rating_name?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.rating_name.error.message }}
        </Message>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="flex flex-col gap-2">
        <label for="airing_status">Airing Status</label>
        <Select
          v-model="tv.airing_status"
          name="airing_status"
          :options="status"
        >
        </Select>
        <Message
          v-if="$form.airing_status?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.airing_status.error.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="air_date">Air Date</label>
        <DatePicker
          v-model="tv.air_date"
          date-format="dd/mm/yy"
          show-button-bar
          class="w-full"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="end_date">End Date</label>
        <DatePicker
          v-model="tv.end_date"
          date-format="dd/mm/yy"
          show-button-bar
          class="w-full"
        />
      </div>
    </div>

    <div class="grid gap-2">
      <label for="genre">Genres</label>
      <MultiSelect
        v-model="tv.tv_genres"
        name="tv_genre"
        :options="tvGenres"
        option-label="label"
        option-value="value"
        filter
        class="w-full"
      />
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="flex flex-col gap-2">
        <label for="douban">Douban</label>
        <IconField>
          <InputIcon class="pi pi-tiktok" />
          <InputText
            id="douban"
            v-model.trim="tv.douban"
            name="douban"
            type="text"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.douban?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.douban.error.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="imdb">IMDb</label>
        <IconField>
          <InputIcon class="pi pi-desktop" />
          <InputText
            id="imdb"
            v-model.trim="tv.imdb"
            name="imdb"
            type="text"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.imdb?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.imdb.error.message }}
        </Message>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="flex flex-col gap-2">
        <label for="poster_url">Poster</label>
        <IconField>
          <InputIcon class="pi pi-image" />
          <InputText
            id="poster_url"
            v-model.trim="tv.poster_url"
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
        <label for="cover">Cover</label>
        <IconField>
          <InputIcon class="pi pi-image" />
          <InputText
            id="cover"
            v-model.trim="tv.cover_url"
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
    </div>

    <div
      class="flex gap-2"
      :class="{
        'justify-between': !isEdit,
        'justify-end': isEdit,
      }"
    >
      <Button
        v-if="!isEdit"
        label="Back"
        icon="pi pi-arrow-circle-left"
        severity="secondary"
        :loading="loading"
        @click="$emit('onBack')"
      />
      <Button
        label="Save"
        icon="pi pi-save"
        type="submit"
        :disabled="!$form.valid"
        :loading="loading"
      />
    </div>
  </Form>
</template>

<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const emit = defineEmits(['onBack', 'onSuccess'])

const toast = useToast()

const { isEdit, metadata } = defineProps({
  isEdit: Boolean,
  metadata: {
    type: Object,
    default: () => ({}),
  },
})

const tv = ref({
  title: '',
  tv_genres: [],
})

onBeforeMount(() => {
  Object.assign(tv.value, metadata)

  if (metadata.air_date) {
    tv.value.air_date = new Date(metadata.air_date)
  }
  if (metadata.end_date) {
    tv.value.end_date = new Date(metadata.end_date)
  }

  if (Array.isArray(metadata.genres)) {
    tv.value.tv_genres = metadata.genres.map(({ id }) => id)
  }
})

const { data: tvGenres } = useAsyncData(() => $fetch('/api/genre'), {
  transform: (data) => {
    return data.map(({ id, name }) => ({ value: id, label: name }))
  },
})

const dayOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const status = ['Upcoming', 'Airing', 'Ended', 'Hiatus']

const loading = ref(false)
const fetchMetadata = (url) => {
  if (url) {
    loading.value = true

    $fetch('/api/scrape/tv', {
      method: 'get',
      params: {
        url,
        language: 'en',
      },
    })
      .then((data) => {
        if (Array.isArray(data.tv_genres)) {
          data.tv_genres = tvGenres.value
            .filter((g) => data.tv_genres.includes(g.label))
            .map(({ value }) => value)
        }

        Object.assign(tv.value, data)
      })
      .catch((error) => {
        toast.add({
          severity: 'error',
          summary: error.message,
          life: 3000,
        })
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const resolver = ref(
  zodResolver(
    z.object({
      title: z.string().min(1),
      title_pinyin: z.string().nullish(),
      original_title: z.string().nullish(),
      release_year: z.number().min(1970).max(2200).nullish(),
      number_of_episodes: z.number().nullish(),
      synopsis: z.string().nullish(),
      synopsis_source: z.string().nullish(),
      airing_platform: z.string().nullish(),
      poster_url: z.string().url().nullish().or(z.string().min(0).max(0)),
      cover_url: z.string().url().nullish().or(z.string().min(0).max(0)),
      rating_name: z.string().nullish(),
      watch_link: z.string().url().nullish().or(z.string().min(0).max(0)),
      douban: z.string().url().nullish().or(z.string().min(0).max(0)),
      imdb: z.string().url().nullish().or(z.string().min(0).max(0)),
      airing_status: z.enum(status).nullish(),
      air_day: z.enum(dayOfWeek).nullish(),
      air_date: z.date(),
      end_date: z.date(),
    }),
  ),
)

const onSubmit = async ({ valid }) => {
  if (!valid) return

  const url = isEdit ? `/api/tv/${tv.value.id}` : '/api/tv'

  if (tv.value.air_date) {
    tv.value.air_date = toISODate(tv.value.air_date)
  }
  if (tv.value.end_date) {
    tv.value.end_date = toISODate(tv.value.end_date)
  }

  $fetch(url, {
    method: 'post',
    body: tv.value,
  })
    .then(() => {
      if (isEdit) {
        toast.add({
          severity: 'success',
          summary: `[${tv.value.title}] updated successfully!`,
          life: 3000,
        })

        emit('onSuccess')
      } else {
        toast.add({
          severity: 'success',
          summary: tv.value.title,
          detail: 'TV/Drama added successfully!',
          life: 3000,
        })

        emit('onSuccess', 'add', true)
      }
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: error.message,
        life: 3000,
      })
    })
}

defineExpose({ fetchMetadata })
</script>
