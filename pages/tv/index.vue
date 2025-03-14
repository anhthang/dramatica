<template>
  <Panel
    header="Add New TV"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <Stepper value="1" linear>
      <StepList>
        <Step value="1">Enter TV URL</Step>
        <Step value="2">Review & Complete</Step>
      </StepList>
      <StepPanels>
        <StepPanel
          v-slot="{ activateCallback }"
          value="1"
          pt:root:class="!bg-transparent"
        >
          <Form
            v-slot="$form"
            :initial-values="metadata"
            :resolver
            class="flex flex-col gap-6"
          >
            <Message variant="simple" severity="secondary">
              For new Chinese dramas streaming on WeTV, iQIYI, or Youku, you can
              enter the watch link below to automatically fetch information and
              then edit or update it as needed. Otherwise, you can choose to
              manually input the details.
            </Message>

            <div class="flex flex-col gap-2">
              <IconField>
                <InputIcon class="pi pi-external-link" />
                <InputText
                  id="watch_link"
                  v-model.trim="metadata.watch_link"
                  name="watch_link"
                  type="text"
                  fluid
                />
              </IconField>
              <Message
                v-if="$form.watch_link?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.watch_link.error.message }}
              </Message>
            </div>

            <div class="flex gap-2" @click="activateCallback('2')">
              <Checkbox input-id="checkbox" />
              <label for="checkbox">
                I would prefer to enter the information manually.
              </label>
            </div>
          </Form>
          <div class="flex pt-6 justify-end">
            <Button
              label="Fetch"
              icon="pi pi-sync"
              :disabled="!metadata.watch_link"
              @click="activateCallback('2')"
            />
          </div>
        </StepPanel>
        <StepPanel
          v-slot="{ activateCallback }"
          value="2"
          pt:root:class="!bg-transparent"
        >
          <FormTV :metadata="metadata" @on-back="activateCallback('1')" />
        </StepPanel>
      </StepPanels>
    </Stepper>
  </Panel>
</template>

<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const metadata = ref({
  watch_link: '',
})

const resolver = ref(
  zodResolver(
    z.object({
      watch_link: z.string().url(),
    }),
  ),
)

// const loading = ref(false)

// const fetchMetadata = (callback) => {
//   loading.value = true

//   $fetch('/api/scrape/tv', {
//     method: 'get',
//     params: {
//       url: metadata.value.watch_link,
//       language: 'en',
//     },
//   })
//     .then(({ season_id, ...rest }) => {
//       Object.assign(metadata.value, rest)
//     })
//     .catch((error) => {
//       message.error(error.message)
//     })
//     .finally(() => {
//       loading.value = false

//       callback()
//     })
// }

useSeoMeta({
  title: 'Add New TV',
})
</script>
