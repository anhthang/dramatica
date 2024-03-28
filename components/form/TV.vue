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
          <a-input v-model:value="tv.title">
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
          <a-input v-model:value="tv.title_pinyin">
            <template #prefix><font-size-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xl="8">
        <a-form-item
          ref="title_vi"
          name="title_vi"
          label="Vietnamese Title"
          v-bind="validateInfos.title_vi"
        >
          <a-input v-model:value="tv.title_vi">
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
        v-model:value="tv.synopsis"
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
          <a-input v-model:value="tv.synopsis_source">
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
    </a-row>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col :xl="8">
        <a-form-item
          ref="airing_platform"
          name="airing_platform"
          label="Airing Platform"
          v-bind="validateInfos.airing_platform"
        >
          <a-input v-model:value="tv.airing_platform">
            <template #prefix><font-size-outlined /></template>
          </a-input>
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
            v-model:value="tv.date"
            style="width: 100%"
            @change="onChangeDates"
          />
        </a-form-item>
      </a-col>
      <a-col :xl="8">
        <a-form-item
          ref="watch_link"
          name="watch_link"
          label="Watch Link"
          v-bind="validateInfos.watch_link"
        >
          <a-input v-model:value="tv.watch_link">
            <template #prefix><link-outlined /></template>
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
          <a-input v-model:value="tv.trailer_url">
            <template #prefix><video-camera-outlined /></template>
          </a-input>
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
          <a-input v-model:value="tv.poster_url">
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
          <a-input v-model:value="tv.cover_url">
            <template #prefix><file-image-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup>
import dayjs from 'dayjs'
import { Form } from 'ant-design-vue'

const { isEdit, metadata } = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: Object,
    default() {
      return {}
    },
  },
})

const tv = ref({
  title: '',
  date: '',
})

onBeforeMount(() => {
  Object.assign(tv.value, metadata)
  if (metadata.air_date) {
    tv.value.date = dayjs(metadata.air_date, 'YYYY-MM-DD')
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

const status = ['Airing', 'Ended', 'Hiatus']

const formRef = ref()
const formRules = ref({
  title: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
  title_pinyin: [{ type: 'string', trigger: ['change', 'blur'] }],
  title_vi: [{ type: 'string', trigger: ['change', 'blur'] }],
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
})

const onChangeDates = () => {
  if (tv.value.date.isValid()) {
    tv.value.air_date = tv.value.date.format('YYYY-MM-DD')
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
        .then(() => {
          if (isEdit) {
            message.success(`[${tv.value.title}] updated successfully!`)
          } else {
            message.success(`[${tv.value.title}] added successfully!`)
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
