<template>
  <a-form :ref="formRef" layout="vertical" :model="member" :rules="formRules">
    <a-form-item v-if="edit">
      <a-select
        v-if="isDrama"
        v-model:value="member.drama_id"
        @change="onSelect"
      >
        <a-select-opt-group
          v-for="(group, label) in groupBy(metadata, 'drama.release_year')"
          :key="label"
          :label="label"
        >
          <a-select-option v-for="{ drama } in group" :key="drama.id">
            <select-option-t-v :item="drama" />
          </a-select-option>
        </a-select-opt-group>
      </a-select>
      <a-select v-else v-model:value="member.people_id" @change="onSelect">
        <a-select-opt-group
          v-for="(group, label) in groupBy(metadata, 'role')"
          :key="label"
          :label="label"
        >
          <a-select-option v-for="{ people } in group" :key="people.id">
            <select-option-people :item="people" />
          </a-select-option>
        </a-select-opt-group>
      </a-select>
    </a-form-item>
    <a-form-item v-else>
      <a-auto-complete
        v-model:value="input"
        allow-clear
        :options="suggestions"
        @select="onSelectSuggestion"
        @search="fetchSuggestions"
      >
        <a-input placeholder="Search drama or cast/crew member by name...">
          <template #prefix><search-outlined /></template>
        </a-input>

        <template #option="item">
          <select-option-t-v v-if="isDrama" :item="item" />
          <select-option-people v-else :item="item" />
        </template>
      </a-auto-complete>
    </a-form-item>

    <a-form-item v-if="!edit && selection">
      <card-t-v v-if="isDrama" :tv="selection" :highlight="true" />
      <card-person v-else :person="selection" :highlight="true" />
    </a-form-item>

    <a-form-item
      ref="role"
      name="role"
      label="Role"
      v-bind="validateInfos.role"
    >
      <a-select v-model:value="member.role" show-search :options="selectOpts" />
      <template #extra>Cast/Crew member's role in the drama.</template>
    </a-form-item>

    <a-form-item
      v-if="isCast"
      ref="character_name"
      name="character_name"
      label="Character"
      v-bind="validateInfos.character_name"
    >
      <a-input v-model:value="member.character_name">
        <template #prefix><font-size-outlined /></template>
      </a-input>
      <template #extra>
        Character name played by the cast member in the drama
      </template>
    </a-form-item>
    <a-form-item
      v-if="isCast"
      ref="character_name_vi"
      name="character_name_vi"
      label="Character (Vietnamese)"
      v-bind="validateInfos.character_name_vi"
    >
      <a-input v-model:value="member.character_name_vi">
        <template #prefix><font-size-outlined /></template>
      </a-input>
      <template #extra>
        Character name played by the cast member in the drama (in Vietnamese)
      </template>
    </a-form-item>

    <a-form-item
      v-if="isCast"
      ref="billing_order"
      name="billing_order"
      label="Billing Order"
      v-bind="validateInfos.billing_order"
    >
      <a-input-number v-model:value="member.billing_order" style="width: 100%">
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
import groupBy from 'lodash.groupby'
import pick from 'lodash.pick'

const route = useRoute()
const { locale } = useI18n()

const { type, edit, existing, metadata } = defineProps({
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
  edit: {
    type: Boolean,
  },
  metadata: {
    type: Object,
    default: () => ({}),
  },
})

const selectOpts = Object.entries(roles).map(([group, roles]) => ({
  label: group.charAt(0).toUpperCase() + group.slice(1), // capitalize first letter
  options: roles.map((role) => ({ label: role, value: role })),
}))

const enumRoles = Object.values(roles).flat()

const isDrama = type === 'drama'
const isCast = computed(() => roles.cast.includes(member.value.role))

const member = isDrama
  ? ref({
      people_id: Number(route.params.people_id),
    })
  : ref({
      drama_id: Number(route.params.drama_id),
    })

onMounted(() => {
  if (edit) {
    const { drama, people, ...rest } = metadata[0]

    selection.value = isDrama ? drama : people
    Object.assign(member.value, rest)
  }
})

const selection = ref()

const input = ref('')
const suggestions = ref([])

const fetchSuggestions = () => {
  const url = isDrama ? '/api/drama' : '/api/people'

  $fetch(url, {
    params: {
      query: input.value,
      language: locale.value,
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

const onSelect = (value) => {
  const { drama, people, ...rest } = isDrama
    ? metadata.find((d) => d.drama_id === value)
    : metadata.find((p) => p.people_id === value)

  selection.value = isDrama ? drama : people
  Object.assign(member.value, rest)
}

const onSelectSuggestion = (value, option) => {
  if (isDrama) {
    member.value.drama_id = value
  } else {
    member.value.people_id = value
  }

  selection.value = option

  input.value = ''
  suggestions.value = []
}

const formRef = ref()
const formRules = ref({
  drama_id: [{ required: true, type: 'number', trigger: ['change', 'blur'] }],
  people_id: [{ required: true, type: 'number', trigger: ['change', 'blur'] }],
  role: [
    {
      required: true,
      type: 'enum',
      enum: enumRoles,
      trigger: ['change', 'blur'],
    },
  ],
  character_name: [{ type: 'string', trigger: ['change', 'blur'] }],
  character_name_vi: [{ type: 'string', trigger: ['change', 'blur'] }],
  billing_order: [{ type: 'number', trigger: ['change', 'blur'] }],
})

const { useForm } = Form
const { validate, validateInfos } = useForm(member, formRules)

const onSubmit = async () => {
  await validate()
    .then(() => {
      const body = isCast.value
        ? member.value
        : pick(member.value, ['drama_id', 'people_id', 'role'])

      $fetch(`/api/tv/${member.value.drama_id}/people`, {
        method: 'post',
        body,
      })
        .then(() => {
          if (isDrama) {
            message.success(
              `[${selection.value.title}] has been successfully added to the people!`,
            )
          } else {
            message.success(
              `[${selection.value.name}] has been successfully added to the drama!`,
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
