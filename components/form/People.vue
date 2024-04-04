<template>
  <potential-duplicates-people v-if="!isEdit && people.name" :props="people" />

  <a-form
    :ref="formRef"
    layout="vertical"
    :model="people"
    :rules="formRules"
    :disabled="disabled"
  >
    <a-row :gutter="[16, 16]" type="flex">
      <a-col :xs="24" :md="8">
        <a-form-item
          ref="name"
          name="name"
          label="Stage Name"
          v-bind="validateInfos.name"
        >
          <a-input v-model:value="people.name">
            <template #prefix><font-size-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="8">
        <a-form-item
          ref="native_name"
          name="native_name"
          label="Native Name"
          v-bind="validateInfos.native_name"
        >
          <a-input v-model:value="people.native_name">
            <template #prefix><font-size-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="8">
        <a-form-item
          ref="name_vi"
          name="name_vi"
          label="Vietnamese Name"
          v-bind="validateInfos.name_vi"
        >
          <a-input v-model:value="people.name_vi">
            <template #prefix><font-size-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col :xs="24" :md="8">
        <a-form-item
          ref="gender"
          name="gender"
          label="Gender"
          v-bind="validateInfos.gender"
        >
          <a-select
            v-model:value="people.gender"
            :options="genders.map((value) => ({ value }))"
          />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="8">
        <a-form-item
          ref="dob"
          name="dob"
          label="Date of Birth"
          v-bind="validateInfos.dob"
        >
          <a-date-picker
            v-model:value="people.date"
            style="width: 100%"
            @change="onChangeDates"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item
      ref="profile_url"
      name="profile_url"
      v-bind="validateInfos.profile_url"
      label="Profile Picture"
    >
      <a-input v-model:value="people.profile_url">
        <template #prefix><user-outlined /></template>
      </a-input>
    </a-form-item>

    <a-form-item
      ref="biography"
      name="biography"
      v-bind="validateInfos.biography"
      label="Biography"
    >
      <a-textarea
        v-model:value="people.biography"
        :auto-size="{ minRows: 3, maxRows: 6 }"
      />
      <template #extra>
        When citing a biography found online, please include a reference at the
        bottom.
      </template>
    </a-form-item>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col xs="24" :md="8">
        <a-form-item
          ref="weibo"
          name="weibo"
          v-bind="validateInfos.weibo"
          label="Weibo"
        >
          <a-input v-model:value="people.weibo">
            <template #prefix><weibo-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col xs="24" :md="8">
        <a-form-item
          ref="douyin"
          name="douyin"
          v-bind="validateInfos.douyin"
          label="Douyin"
        >
          <a-input v-model:value="people.douyin">
            <template #prefix><tik-tok-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col xs="24" :md="8">
        <a-form-item
          ref="instagram"
          name="instagram"
          v-bind="validateInfos.instagram"
          label="Instagram"
        >
          <a-input v-model:value="people.instagram">
            <template #prefix><instagram-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup>
import { Button, Form } from 'ant-design-vue'
import dayjs from 'dayjs'

const router = useRouter()

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

const people = ref({
  name: '',
  date: '',
})

onBeforeMount(() => {
  Object.assign(people.value, metadata)

  if (metadata.dob) {
    people.value.date = dayjs(metadata.dob, 'YYYY-MM-DD')
  }
})

const genders = ['Male', 'Female', 'Other']

const formRef = ref()
const formRules = ref({
  name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
  native_name: [{ type: 'string', trigger: ['change', 'blur'] }],
  gender: [
    {
      required: true,
      type: 'enum',
      enum: genders,
      trigger: ['change', 'blur'],
    },
  ],
  name_vi: [{ type: 'string', trigger: ['change', 'blur'] }],
  dob: [{ type: 'date', trigger: ['change', 'blur'] }],
  profile_url: [{ type: 'url', trigger: ['change', 'blur'] }],
  biography: [{ type: 'string', trigger: ['change', 'blur'] }],
  weibo: [{ type: 'url', trigger: ['change', 'blur'] }],
  douyin: [{ type: 'url', trigger: ['change', 'blur'] }],
  instagram: [{ type: 'url', trigger: ['change', 'blur'] }],
})

const onChangeDates = () => {
  if (people.value.date.isValid()) {
    people.value.dob = people.value.date.format('YYYY-MM-DD')
  }
}

const { useForm } = Form
const { validate, validateInfos, resetFields } = useForm(people, formRules)

const disabled = ref(false)
const onSubmit = async () => {
  disabled.value = true

  await validate()
    .then(() => {
      const url = isEdit ? `/api/people/${people.value.id}` : '/api/people'

      $fetch(url, {
        method: 'post',
        body: people.value,
      })
        .then((data) => {
          if (isEdit) {
            message.success(`[${people.value.name}] updated successfully!`)
          } else {
            notification.success({
              message: people.value.name,
              description: 'People added successfully!',
              btn: () =>
                h(
                  Button,
                  {
                    type: 'primary',
                    // size: 'small',
                    onClick: () => router.push(`/people/${data.id}`),
                  },
                  { default: () => 'Manage People' },
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
    .finally(() => {
      disabled.value = false
    })
}

defineExpose({
  onSubmit,
})
</script>
