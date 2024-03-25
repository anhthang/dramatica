<template>
  <a-form :ref="formRef" layout="vertical" :model="cast" :rules="formRules">
    <a-form-item>
      <a-auto-complete
        v-model:value="input"
        allow-clear
        :options="actors"
        placeholder="Search cast member by name..."
        @select="onSelect"
        @search="fetchCast"
      >
        <template #option="item">
          <a-flex gap="small" align="center">
            <a-avatar :src="item.profile_url">
              {{ item.name.charAt(0) }}
            </a-avatar>
            {{ item.name }} ({{ item.native_name }})
          </a-flex>
        </template>
      </a-auto-complete>
    </a-form-item>

    <a-form-item v-if="actor">
      <a-card class="card-highlighted">
        <a-card-meta :title="actor.name" :description="actor.native_name">
          <template #avatar>
            <a-avatar :src="actor.profile_url" :size="60">
              {{ actor.name.charAt(0) }}
            </a-avatar>
          </template>
        </a-card-meta>
      </a-card>
    </a-form-item>

    <a-form-item
      ref="character_name"
      name="character_name"
      label="Character Name"
      v-bind="validateInfos.character_name"
    >
      <a-input v-model:value="cast.character_name">
        <template #prefix><font-size-outlined /></template>
      </a-input>
      <template #extra>
        Character name played by the cast member in the drama
      </template>
    </a-form-item>
    <a-form-item
      ref="character_name_vi"
      name="character_name_vi"
      label="Character Name (Vietnamese)"
      v-bind="validateInfos.character_name_vi"
    >
      <a-input v-model:value="cast.character_name_vi">
        <template #prefix><font-size-outlined /></template>
      </a-input>
      <template #extra>
        Character name played by the cast member in the drama (in Vietnamese)
      </template>
    </a-form-item>
    <a-form-item
      ref="billing_order"
      name="billing_order"
      label="Billing Order"
      v-bind="validateInfos.billing_order"
    >
      <a-input-number v-model:value="cast.billing_order" style="width: 100%">
        <template #prefix><number-outlined /></template>
      </a-input-number>
      <template #extra>
        Order of appearance in the credits (lower number is higher billing)
      </template>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { Form } from 'ant-design-vue'

const { existingCastMember } = defineProps({
  existingCastMember: {
    type: Array,
    default() {
      return []
    },
  },
})

const route = useRoute()

const cast = ref({
  drama_id: Number(route.params.drama_id),
  people_id: '',
})

const input = ref('')
const actors = ref([])

const fetchCast = () => {
  $fetch('/api/cast', {
    params: {
      query: input.value,
    },
  }).then((data) => {
    actors.value = data
      .filter((p) => !existingCastMember.includes(p.id))
      .map((p) => ({
        value: p.id,
        ...p,
      }))
  })
}

const actor = ref()
const onSelect = (value, option) => {
  cast.value.people_id = value
  actor.value = option

  input.value = ''
  actors.value = []
}

const formRef = ref()
const formRules = ref({
  drama_id: [{ required: true, type: 'number', trigger: ['change', 'blur'] }],
  people_id: [{ required: true, type: 'number', trigger: ['change', 'blur'] }],
  character_name: [
    { required: true, type: 'string', trigger: ['change', 'blur'] },
  ],
  character_name_vi: [{ type: 'string', trigger: ['change', 'blur'] }],
  billing_order: [{ type: 'number', trigger: ['change', 'blur'] }],
})

const { useForm } = Form
const { validate, validateInfos } = useForm(cast, formRules)

const onSubmit = async () => {
  await validate()
    .then(() => {
      $fetch(`/api/tv/${cast.value.drama_id}/cast`, {
        method: 'post',
        body: cast.value,
      })
        .then(() => {
          message.success(
            `[${actor.value.name}] has been successfully added to the cast!`,
          )
        })
        .catch((error) => {
          message.error(error.message)
        })
    })
    .catch((error) => {
      console.error(error)
    })
}

defineExpose({
  onSubmit,
})
</script>

<style>
.card-highlighted {
  background-color: #d2e5ff;
  border-color: #1677ff;

  /* @media (prefers-color-scheme: dark) {
    background-color: #002159;
  } */
}
</style>
