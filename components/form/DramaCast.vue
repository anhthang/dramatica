<template>
  <a-form :ref="formRef" layout="vertical" :model="cast" :rules="formRules">
    <a-form-item>
      <a-auto-complete
        v-model:value="input"
        allow-clear
        :options="suggestions"
        @select="onSelect"
        @search="fetchSuggestions"
      >
        <a-input placeholder="Search drama or cast member by name...">
          <template #prefix><search-outlined /></template>
        </a-input>
        <template v-if="type === 'cast'" #option="item">
          <a-flex gap="small" align="center">
            <a-avatar :src="item.profile_url">
              {{ item.name.charAt(0) }}
            </a-avatar>
            {{ item.name }} ({{ item.native_name }})
          </a-flex>
        </template>
        <template v-else-if="type === 'drama'" #option="item">
          <a-flex gap="small" align="center">
            <a-avatar :src="item.poster_url">
              {{ item.title.charAt(0) }}
            </a-avatar>
            {{ item.title }} ({{ item.release_year }})
          </a-flex>
        </template>
      </a-auto-complete>
    </a-form-item>

    <a-form-item v-if="selection">
      <a-card class="card-highlighted">
        <a-card-meta
          v-if="type === 'cast'"
          :title="selection.name"
          :description="selection.native_name"
        >
          <template #avatar>
            <a-avatar :src="selection.profile_url" :size="60">
              {{ selection.name.charAt(0) }}
            </a-avatar>
          </template>
        </a-card-meta>
        <a-card-meta
          v-if="type === 'drama'"
          :title="selection.title"
          :description="selection.title_pinyin || selection.title_vi"
        >
          <template #avatar>
            <a-avatar :src="selection.poster_url" :size="60">
              {{ selection.title.charAt(0) }}
            </a-avatar>
          </template>
        </a-card-meta>
      </a-card>
    </a-form-item>

    <a-form-item
      ref="character_name"
      name="character_name"
      label="Character"
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
      label="Character (Vietnamese)"
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
      ref="role"
      name="role"
      label="Role"
      v-bind="validateInfos.role"
    >
      <a-select
        v-model:value="cast.role"
        :options="roles.map((role) => ({ value: role, label: role }))"
      />
      <template #extra>Cast member's role in the drama.</template>
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

const { type, existing } = defineProps({
  type: {
    type: String,
    required: true,
  },
  existing: {
    type: Array,
    default() {
      return []
    },
  },
})

const roles = ['Main', 'Supporting', 'Special Guess']

const route = useRoute()

const cast = ref({
  drama_id: Number(route.params.drama_id),
  people_id: Number(route.params.people_id),
})

const input = ref('')
const suggestions = ref([])

const fetchSuggestions = () => {
  $fetch(`/api/${type}`, {
    params: {
      query: input.value,
    },
  }).then((data) => {
    suggestions.value = data
      .filter((p) => !existing.includes(p.id))
      .map((p) => ({
        value: p.id,
        ...p,
      }))
  })
}

const selection = ref()
const onSelect = (value, option) => {
  if (type === 'cast') {
    cast.value.people_id = value
  } else {
    cast.value.drama_id = value
  }

  selection.value = option

  input.value = ''
  suggestions.value = []
}

const formRef = ref()
const formRules = ref({
  drama_id: [{ required: true, type: 'number', trigger: ['change', 'blur'] }],
  people_id: [{ required: true, type: 'number', trigger: ['change', 'blur'] }],
  character_name: [
    { required: true, type: 'string', trigger: ['change', 'blur'] },
  ],
  character_name_vi: [{ type: 'string', trigger: ['change', 'blur'] }],
  role: [
    { required: true, type: 'enum', enum: roles, trigger: ['change', 'blur'] },
  ],
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
          if (type === 'cast') {
            message.success(
              `[${selection.value.name}] has been successfully added to the drama!`,
            )
          }
          if (type === 'drama') {
            message.success(
              `[${selection.value.title}] has been successfully added to the cast!`,
            )
          }
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
