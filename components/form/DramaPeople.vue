<template>
  <Form
    v-slot="$form"
    :initial-values="member"
    :resolver
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <AutoComplete
      v-if="!edit"
      v-model="input"
      v-focustrap
      :suggestions="suggestions"
      fluid
      placeholder="Search drama or cast/crew member by name..."
      @option-select="onSelectSuggestion"
      @complete="fetchSuggestions"
    >
      <template #option="{ option }">
        <div v-if="isDrama" class="flex items-center gap-2">
          <CardTVHorizontal
            :image="option.cover_url"
            size="small"
            :title="option.title"
            simple
          />
        </div>
        <div v-else class="flex items-center gap-2">
          <CardPerson
            simple
            :image="option.profile_url"
            :title="`${toLocalePersonName(option, locale)} (${option.native_name})`"
          />
        </div>
      </template>
    </AutoComplete>

    <div v-if="selection">
      <CardTVHorizontal
        v-if="isDrama"
        :image="selection.cover_url"
        :title="
          selection.release_year
            ? `${selection.title} (${selection.release_year})`
            : selection.title
        "
        :subtitle="selection.title_pinyin || selection.original_title"
        selected
      />
      <CardPerson
        v-else
        :image="selection.profile_url"
        size="xlarge"
        :title="toLocalePersonName(selection, locale)"
        :subtitle="selection.native_name"
        selected
      />
    </div>

    <div class="flex flex-col gap-2">
      <label for="member_role">Role</label>
      <Select
        v-model="member.role"
        name="role"
        :options="selectOpts"
        option-group-label="label"
        option-group-children="options"
        option-label="label"
        option-value="value"
      />
      <Message
        v-if="$form.role?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.role.error.message }}
      </Message>
    </div>

    <div v-if="isCast" class="flex flex-col gap-2">
      <label for="member_character_name">Character</label>
      <IconField>
        <InputIcon class="pi pi-user" />
        <InputText
          id="member_character_name"
          v-model.trim="member.character_name"
          name="character_name"
          type="text"
          fluid
        />
      </IconField>
      <Message
        v-if="$form.character_name?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.character_name.error.message }}
      </Message>
      <Message v-else severity="secondary" size="small" variant="simple">
        Character name played by the cast member in the drama
      </Message>
    </div>

    <div v-if="isCast" class="flex flex-col gap-2">
      <label for="member_character_name_vi">Character (Vietnamese)</label>
      <IconField>
        <InputIcon class="pi pi-user" />
        <InputText
          id="member_character_name_vi"
          v-model.trim="member.character_name_vi"
          name="character_name_vi"
          type="text"
          fluid
        />
      </IconField>
      <Message
        v-if="$form.character_name_vi?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.character_name_vi.error.message }}
      </Message>
      <Message v-else severity="secondary" size="small" variant="simple">
        Character name played by the cast member in the drama (in Vietnamese)
      </Message>
    </div>

    <div v-if="isCast" class="flex flex-col gap-2">
      <label for="member_billing_order">Billing Order</label>
      <IconField>
        <InputIcon class="pi pi-hashtag" />
        <InputNumber
          v-model.number="member.billing_order"
          input-id="tv_billing_order"
          name="billing_order"
          :use-grouping="false"
          fluid
        />
      </IconField>
      <Message
        v-if="$form.billing_order?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.billing_order.error.message }}
      </Message>
      <Message v-else severity="secondary" size="small" variant="simple">
        Order of appearance in the credits (lower number is higher billing)
      </Message>
    </div>

    <div class="flex flex-col gap-2">
      <Button label="Save" type="submit" :disabled="!$form.valid" />
    </div>
  </Form>
</template>

<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import pick from 'lodash.pick'
import { z } from 'zod'

const route = useRoute()
const toast = useToast()
const { locale } = useI18n()

const emit = defineEmits(['onSuccess'])

const { type, edit, metadata, existing } = defineProps({
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
  edit: Boolean,
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
      person_id: Number(route.params.person_id),
    })
  : ref({
      drama_id: Number(route.params.drama_id),
    })

onMounted(() => {
  if (edit) {
    const { drama, person, ...rest } = metadata

    selection.value = isDrama ? drama : person
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
    suggestions.value = data.filter((p) => !existing.includes(p.id))
  })
}

const onSelectSuggestion = (option) => {
  if (isDrama) {
    member.value.drama_id = option.value.id
  } else {
    member.value.person_id = option.value.id
  }

  selection.value = option.value

  input.value = ''
  suggestions.value = []
}

const resolver = ref(
  zodResolver(
    z.object({
      drama_id: z.number().nullish(),
      person_id: z.number().nullish(),
      role: z.enum(enumRoles),
      character_name: z.string().nullish(),
      character_name_vi: z.string().nullish(),
      billing_order: z.number().nullish(),
    }),
  ),
)

const onSubmit = async ({ valid }) => {
  if (!valid) return

  const body = isCast.value
    ? member.value
    : pick(member.value, ['drama_id', 'person_id', 'role'])

  $fetch(`/api/tv/${member.value.drama_id}/people`, {
    method: 'post',
    body,
  })
    .then(() => {
      if (isDrama) {
        toast.add({
          severity: 'success',
          summary: `[${selection.value.title}] has been successfully added to the people!`,
          life: 3000,
        })

        emit('onSuccess', edit ? 'edit_drama' : 'add_drama', true)
      } else {
        toast.add({
          severity: 'success',
          summary: `[${selection.value.name}] has been successfully added to the drama!`,
          life: 3000,
        })

        emit('onSuccess', edit ? 'edit' : 'add', true)
      }
    })
    .catch((error) => {
      message.error(error.message)
    })
}
</script>
