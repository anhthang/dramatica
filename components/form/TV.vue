<template>
  <potential-duplicates-t-v v-if="!isEdit && tv.title" :props="tv" />

  <a-form :ref="formRef" layout="vertical" :model="tv" :rules="formRules">
    <a-row :gutter="[16, 16]" type="flex">
      <a-col :xl="8">
        <a-form-item
          ref="title"
          name="title"
          label="Title"
          v-bind="validateInfos.title"
        >
          <a-input v-model:value.trim="tv.title">
            <template #prefix><font-size-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xl="8">
        <a-form-item
          ref="title_pinyin"
          name="title_pinyin"
          label="Title Pinyin"
          v-bind="validateInfos.title_pinyin"
        >
          <a-input v-model:value.trim="tv.title_pinyin">
            <template #prefix><font-size-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item
      ref="synopsis"
      name="synopsis"
      v-bind="validateInfos.synopsis"
      label="Synopsis"
    >
      <a-textarea
        v-model:value.trim="tv.synopsis"
        :auto-size="{ minRows: 3, maxRows: 6 }"
      />
      <template #extra>
        When copying a synopsis from another source, please include a citation
        at the field below.
      </template>
    </a-form-item>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col :xl="8">
        <a-form-item
          ref="synopsis_source"
          name="synopsis_source"
          label="Source"
          v-bind="validateInfos.synopsis_source"
        >
          <a-input v-model:value.trim="tv.synopsis_source">
            <template #prefix><font-size-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xl="8">
        <a-form-item
          ref="trailer_url"
          name="trailer_url"
          label="Trailer"
          v-bind="validateInfos.trailer_url"
        >
          <a-input v-model:value.trim="tv.trailer_url">
            <template #prefix><video-camera-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xl="8">
        <a-form-item
          ref="watch_link"
          name="watch_link"
          label="Watch Link"
          v-bind="validateInfos.watch_link"
        >
          <a-input v-model:value.trim="tv.watch_link">
            <template #prefix><link-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col :xl="8">
        <a-form-item
          ref="airing_platform"
          name="airing_platform"
          label="Airing Platform"
          v-bind="validateInfos.airing_platform"
        >
          <a-input v-model:value.trim="tv.airing_platform">
            <template #prefix><font-size-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xl="8">
        <a-form-item
          ref="release_year"
          name="release_year"
          label="Release Year"
          v-bind="validateInfos.release_year"
        >
          <a-input-number v-model:value="tv.release_year" style="width: 100%">
            <template #prefix><number-outlined /></template>
          </a-input-number>
        </a-form-item>
      </a-col>
      <a-col :xl="8">
        <a-form-item
          ref="number_of_episodes"
          name="number_of_episodes"
          label="Total Episodes"
          v-bind="validateInfos.number_of_episodes"
        >
          <a-input-number
            v-model:value="tv.number_of_episodes"
            style="width: 100%"
          >
            <template #prefix><number-outlined /></template>
          </a-input-number>
        </a-form-item>
      </a-col>
      <a-col :xl="8">
        <a-form-item
          ref="airing_status"
          name="airing_status"
          label="Airing Status"
          v-bind="validateInfos.airing_status"
        >
          <a-select
            v-model:value="tv.airing_status"
            :options="status.map((value) => ({ value }))"
          />
        </a-form-item>
      </a-col>
      <a-col :xl="8">
        <a-form-item
          ref="air_date"
          name="air_date"
          label="Air Date"
          v-bind="validateInfos.air_date"
        >
          <a-date-picker
            v-model:value="tv.dates[0]"
            style="width: 100%"
            @change="onChangeDates"
          />
        </a-form-item>
      </a-col>
      <a-col :xl="8">
        <a-form-item
          ref="end_date"
          name="end_date"
          label="End Date"
          v-bind="validateInfos.end_date"
        >
          <a-date-picker
            v-model:value="tv.dates[1]"
            style="width: 100%"
            @change="onChangeDates"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col :xl="8">
        <a-form-item
          ref="poster_url"
          name="poster_url"
          label="Poster"
          v-bind="validateInfos.poster_url"
        >
          <a-input v-model:value.trim="tv.poster_url">
            <template #prefix><file-image-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xl="8">
        <a-form-item
          ref="cover_url"
          name="cover_url"
          label="Cover"
          v-bind="validateInfos.cover_url"
        >
          <a-input v-model:value.trim="tv.cover_url">
            <template #prefix><file-image-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup>
import dayjs from 'dayjs'
import { Button, Form } from 'ant-design-vue'

const router = useRouter()

const { isEdit, metadata } = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: Object,
    default: () => ({}),
  },
})

const tv = ref({
  title: '',
  dates: [],
})

onBeforeMount(() => {
  Object.assign(tv.value, metadata)
  if (metadata.air_date) {
    tv.value.dates[0] = dayjs(metadata.air_date, 'YYYY-MM-DD')
  }
  if (metadata.end_date) {
    tv.value.dates[1] = dayjs(metadata.end_date, 'YYYY-MM-DD')
  }
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

const formRef = ref()
const formRules = ref({
  title: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
  title_pinyin: [{ type: 'string', trigger: ['change', 'blur'] }],
  release_year: [
    {
      required: false,
      type: 'number',
      min: 1970,
      max: 2200,
      trigger: ['change', 'blur'],
    },
  ],
  number_of_episodes: [
    {
      required: false,
      type: 'number',
      min: 1,
      max: 1000,
      trigger: ['change', 'blur'],
    },
  ],
  synopsis: [{ type: 'string', trigger: ['change', 'blur'] }],
  synopsis_source: [{ type: 'string', trigger: ['change', 'blur'] }],
  airing_platform: [{ type: 'string', trigger: ['change', 'blur'] }],
  poster_url: [{ type: 'url', trigger: ['change', 'blur'] }],
  cover_url: [{ type: 'url', trigger: ['change', 'blur'] }],
  trailer_url: [{ type: 'url', trigger: ['change', 'blur'] }],
  watch_link: [{ type: 'url', trigger: ['change', 'blur'] }],
  airing_status: [
    {
      required: true,
      type: 'enum',
      enum: status,
      trigger: ['change', 'blur'],
    },
  ],
  air_day: [
    {
      type: 'enum',
      enum: dayOfWeek,
      trigger: ['change', 'blur'],
    },
  ],
  air_date: [{ type: 'date', trigger: ['change', 'blur'] }],
  end_date: [{ type: 'date', trigger: ['change', 'blur'] }],
})

const onChangeDates = () => {
  if (tv.value.dates[0] && tv.value.dates[0].isValid()) {
    tv.value.air_date = tv.value.dates[0].format('YYYY-MM-DD')
  }
  if (tv.value.dates[1] && tv.value.dates[1].isValid()) {
    tv.value.end_date = tv.value.dates[1].format('YYYY-MM-DD')
  }
}

const { useForm } = Form
const { validate, validateInfos, resetFields } = useForm(tv, formRules)

const onSubmit = async () => {
  await validate()
    .then(() => {
      const url = isEdit ? `/api/tv/${tv.value.id}` : '/api/tv'

      $fetch(url, {
        method: 'post',
        body: tv.value,
      })
        .then((data) => {
          if (isEdit) {
            message.success(`[${tv.value.title}] updated successfully!`)
          } else {
            notification.success({
              message: tv.value.title,
              description: 'TV/Drama added successfully!',
              btn: () =>
                h(
                  Button,
                  {
                    type: 'primary',
                    onClick: () => router.push(`/${data.id}`),
                  },
                  { default: () => 'Manage TV/Drama' },
                ),
            })
          }

          resetFields()
        })
        .catch((error) => {
          message.error(error.message)
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
