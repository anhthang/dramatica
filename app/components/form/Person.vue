<template>
  <PotentialDuplicatesPeople
    v-if="!isEdit && person.name"
    :props="person"
    class="mb-12"
  />

  <Form
    v-slot="$form"
    :initial-values="person"
    :resolver
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-3 gap-4">
      <div class="flex flex-col gap-2">
        <label for="name">Stage Name</label>
        <IconField>
          <InputIcon class="pi pi-user-edit" />
          <InputText
            id="name"
            v-model.trim="person.name"
            name="name"
            type="text"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.name?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.name.error.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="native_name">Native Name</label>
        <IconField>
          <InputIcon class="pi pi-user-edit" />
          <InputText
            id="native_name"
            v-model.trim="person.native_name"
            name="native_name"
            type="text"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.native_name?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.native_name.error.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="name_vi">Vietnamese Name</label>
        <IconField>
          <InputIcon class="pi pi-user-edit" />
          <InputText
            id="name_vi"
            v-model.trim="person.name_vi"
            name="name_vi"
            type="text"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.name_vi?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.name_vi.error.message }}
        </Message>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="flex flex-col gap-2">
        <label for="gender">Gender</label>
        <Select v-model="person.gender" name="gender" :options="genders">
        </Select>
        <Message
          v-if="$form.gender?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.gender.error.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="dob">Date of Birth</label>
        <DatePicker
          v-model="person.dob"
          date-format="dd/mm/yy"
          show-button-bar
          class="w-full"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="profile_url">Profile Picture</label>
        <IconField>
          <InputIcon class="pi pi-image" />
          <InputText
            id="profile_url"
            v-model.trim="person.profile_url"
            name="profile_url"
            type="text"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.profile_url?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.profile_url.error.message }}
        </Message>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label for="biography">Biography</label>
      <Textarea
        id="biography"
        v-model.trim="person.biography"
        name="biography"
        :rows="5"
        auto-resize
      />
      <Message severity="secondary" size="small" variant="simple">
        When citing a biography found online, please include a reference at the
        bottom.
      </Message>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="flex flex-col gap-2">
        <label for="weibo">Weibo</label>
        <IconField>
          <InputIcon class="pi pi-comment" />
          <InputText
            id="weibo"
            v-model.trim="person.weibo"
            name="weibo"
            type="text"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.weibo?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.weibo.error.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="douyin">Douyin</label>
        <IconField>
          <InputIcon class="pi pi-tiktok" />
          <InputText
            id="douyin"
            v-model.trim="person.douyin"
            name="douyin"
            type="text"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.douyin?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.douyin.error.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="instagram">Instagram</label>
        <IconField>
          <InputIcon class="pi pi-instagram" />
          <InputText
            id="instagram"
            v-model.trim="person.instagram"
            name="instagram"
            type="text"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.instagram?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.instagram.error.message }}
        </Message>
      </div>
    </div>

    <div class="flex gap-2 justify-end">
      <Button
        label="Save"
        icon="pi pi-save"
        type="submit"
        :disabled="!$form.valid"
      />
    </div>
  </Form>
</template>

<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const toast = useToast()

const emit = defineEmits(['onSuccess'])

const { isEdit, metadata } = defineProps({
  isEdit: Boolean,
  metadata: {
    type: Object,
    default: () => ({}),
  },
})

const person = ref({
  name: '',
})

onBeforeMount(() => {
  Object.assign(person.value, metadata)

  if (metadata.dob) {
    person.value.dob = new Date(metadata.dob)
  }
})

const genders = ['Male', 'Female', 'Other']

const resolver = ref(
  zodResolver(
    z.object({
      name: z.string().min(1),
      native_name: z.string().nullish(),
      gender: z.enum(genders).nullish(),
      name_vi: z.string().nullish(),
      dob: z.date(),
      profile_url: z.string().url().nullish().or(z.string().min(0).max(0)),
      biography: z.string().nullish(),
      weibo: z.string().url().nullish().or(z.string().min(0).max(0)),
      douyin: z.string().url().nullish().or(z.string().min(0).max(0)),
      instagram: z.string().url().nullish().or(z.string().min(0).max(0)),
    }),
  ),
)

const disabled = ref(false)
const onSubmit = async ({ valid }) => {
  if (!valid) return

  disabled.value = true

  if (person.value.dob) {
    person.value.dob = toISODate(person.value.dob)
  }

  const url = isEdit ? `/api/people/${person.value.id}` : '/api/people'

  $fetch(url, {
    method: 'post',
    body: person.value,
  })
    .then(() => {
      if (isEdit) {
        toast.add({
          severity: 'success',
          summary: `[${person.value.name}] updated successfully!`,
          life: 3000,
        })

        emit('onSuccess', 'edit', true)
      } else {
        toast.add({
          severity: 'success',
          summary: person.value.name,
          detail: 'People added successfully!',
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
    .finally(() => {
      disabled.value = false
    })
}
</script>
