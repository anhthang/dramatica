<template>
  <a-form
    :ref="formRef"
    layout="vertical"
    :model="people"
    :rules="formRules"
    :disabled="disabled"
  >
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

    <a-row :gutter="[8, 8]" type="flex">
      <a-col :xs="12">
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
      <a-col :xs="12">
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

    <a-row :gutter="[8, 8]" type="flex">
      <a-col :xs="12">
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
      <a-col :xs="12">
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

    <a-form-item>
      <a-button type="primary" @click="onSubmit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { Form } from 'ant-design-vue'

const people = ref({
  name: '',
  date: '',
})

const genders = ['Male', 'Female', 'Other']

const formRef = ref()
const formRules = ref({
  name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
  native_name: [
    { required: false, type: 'string', trigger: ['change', 'blur'] },
  ],
  gender: [
    {
      required: true,
      type: 'enum',
      enum: genders,
      trigger: ['change', 'blur'],
    },
  ],
  name_vi: [{ required: false, type: 'string', trigger: ['change', 'blur'] }],
  dob: [{ required: false, type: 'date', trigger: ['change', 'blur'] }],
  biography: [{ type: 'string', trigger: ['change', 'blur'] }],
})

const onChangeDates = () => {
  if (people.value.date.isValid()) {
    people.value.dob = people.value.date.format('YYYY-MM-DD')
  }
}

const { useForm } = Form
const { validate, validateInfos } = useForm(people, formRules)

const disabled = ref(false)
const onSubmit = async () => {
  disabled.value = true

  await validate()
    .then(() => {
      $fetch(`/api/people`, {
        method: 'post',
        body: people.value,
      })
        .then(() => {
          message.success(`[${people.value.name}] added successfully!`)

          formRef.value.resetFields()
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
</script>
