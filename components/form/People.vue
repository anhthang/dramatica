<template>
  <!-- <potential-duplicates-people v-if="!isEdit && people.name" :props="people" /> -->

  <Form
    v-slot="$form"
    :initial-values="people"
    :resolver
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-3 gap-4">
      <div class="flex flex-col gap-2">
        <label for="people_name">Stage Name</label>
        <IconField>
          <InputIcon class="pi pi-user" />
          <InputText
            id="people_name"
            v-model.trim="people.name"
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
        <label for="people_native_name">Native Name</label>
        <IconField>
          <InputIcon class="pi pi-user" />
          <InputText
            id="people_native_name"
            v-model.trim="people.native_name"
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
        <label for="people_name_vi">Vietnamese Name</label>
        <IconField>
          <InputIcon class="pi pi-user" />
          <InputText
            id="people_name_vi"
            v-model.trim="people.name_vi"
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
        <label for="people_gender">Gender</label>
        <Select v-model="people.gender" name="gender" :options="genders">
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
        <label for="people_dob">Date of Birth</label>
        <DatePicker
          v-model="people.dob"
          date-format="dd/mm/yy"
          show-button-bar
          :min-date="new Date()"
          class="w-full"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="people_profile_url">Profile Picture</label>
        <IconField>
          <InputIcon class="pi pi-image" />
          <InputText
            id="people_profile_url"
            v-model.trim="people.profile_url"
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
      <label for="people_biography">Biography</label>
      <Textarea
        id="people_biography"
        v-model.trim="people.biography"
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
        <label for="people_weibo">Weibo</label>
        <IconField>
          <InputIcon class="pi pi-comment" />
          <InputText
            id="people_weibo"
            v-model.trim="people.weibo"
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
        <label for="people_douyin">Douyin</label>
        <IconField>
          <InputIcon class="pi pi-tiktok" />
          <InputText
            id="people_douyin"
            v-model.trim="people.douyin"
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
        <label for="people_instagram">Instagram</label>
        <IconField>
          <InputIcon class="pi pi-instagram" />
          <InputText
            id="people_instagram"
            v-model.trim="people.instagram"
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
  isEdit: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: Object,
    default: () => ({}),
  },
})

const people = ref({
  name: '',
})

onBeforeMount(() => {
  Object.assign(people.value, metadata)

  if (metadata.dob) {
    people.value.dob = new Date(metadata.dob)
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

  if (people.value.dob) {
    people.value.dob = toISODate(people.value.dob)
  }

  const url = isEdit ? `/api/people/${people.value.id}` : '/api/people'

  $fetch(url, {
    method: 'post',
    body: people.value,
  })
    .then(() => {
      if (isEdit) {
        toast.add({
          severity: 'success',
          summary: `[${people.value.name}] updated successfully!`,
          life: 3000,
        })

        emit('onSuccess', 'edit', true)
      } else {
        toast.add({
          severity: 'success',
          summary: people.value.name,
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
