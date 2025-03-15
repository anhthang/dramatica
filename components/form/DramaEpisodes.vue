<template>
  <Form class="flex flex-col gap-6" @submit="onSubmit">
    <div class="flex flex-col gap-2">
      <RadioButtonGroup
        v-model="language"
        name="language"
        class="flex flex-wrap gap-4"
      >
        <div
          v-for="{ code, name } in locales"
          :key="code"
          class="flex items-center gap-2"
        >
          <RadioButton input-id="code" :value="code" />
          <label for="code">{{ name }}</label>
        </div>
      </RadioButtonGroup>
    </div>

    <Skeleton v-if="status === 'pending'" class="!h-20" />
    <Card
      v-else-if="tv"
      pt:root:class="!border-0"
      pt:subtitle:class="text-justify"
    >
      <template #header>
        <img loading="lazy" :alt="tv.title" :src="tv.cover_url" />
      </template>
      <template #title>{{ tv.title }}</template>
      <template #subtitle>{{ tv.synopsis }}</template>

      <template #content>
        <DataView
          :value="tv.episodes"
          paginator
          :always-show-paginator="false"
          :rows="5"
        >
          <template #list="slotProps">
            <div class="flex flex-col">
              <div v-for="(item, index) in slotProps.items" :key="index">
                <div
                  class="flex flex-col sm:flex-row sm:items-center py-3 gap-3"
                  :class="{
                    'border-t border-surface-200 dark:border-surface-700':
                      index !== 0,
                  }"
                >
                  <div class="md:w-48 relative">
                    <img
                      class="block xl:block mx-auto rounded w-full"
                      :src="item.preview_img"
                      :alt="item.title"
                    />
                  </div>
                  <div
                    class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6"
                  >
                    <div
                      class="flex flex-row md:flex-col justify-between items-start gap-2"
                    >
                      <div class="text-lg font-medium">
                        {{ item.title }}
                      </div>
                      <span class="text-muted-color text-sm">
                        {{ item.synopsis }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <Message severity="warn" size="small" variant="simple">
              Please verify the data carefully before inserting it to avoid
              incorrect entries.
            </Message>
          </template>
        </DataView>
      </template>
    </Card>

    <div v-if="status === 'success'" class="flex gap-2">
      <Checkbox v-model="ignoreTitle" input-id="checkbox" binary />
      <label for="checkbox">
        Leave the checkbox checked for episode titles that appear to be the
        drama name followed by a number.
      </label>
    </div>

    <div class="flex flex-col gap-2">
      <Button label="Save" type="submit" />
    </div>
  </Form>
</template>

<script setup>
import keyBy from 'lodash.keyby'
import pick from 'lodash.pick'

const props = defineProps({
  availability: {
    type: Array,
    default: () => [],
  },
})

const { locale, locales } = useI18n()
const route = useRoute()
const toast = useToast()

const language = ref(locale.value)

const { data: tv, status } = useAsyncData(
  () =>
    Promise.all(
      props.availability
        .filter(
          (a) =>
            a.streaming_service === 'Netflix' || a.language === language.value,
        )
        .map((s) =>
          $fetch(`/api/scrape/tv/${route.params.drama_id}/episodes`, {
            method: 'get',
            params: {
              url: s.watch_link,
              drama_id: route.params.drama_id,
              language: language.value,
            },
          }).catch(() => {
            // sometime netflix scraper is broken
            return undefined
          }),
        ),
    ),
  {
    watch: [language],
    transform: (data) => {
      const [original, netflix] = data
      if (netflix) {
        const epMap = keyBy(netflix.episodes, 'episode_number')

        original.episodes.forEach((ep) => {
          if (epMap[ep.episode_number]) {
            const picked = pick(epMap[ep.episode_number], [
              'title',
              'synopsis',
              'synopsis_source',
              // 'preview_img', // prefer airing source img instead of netflix
            ])

            Object.assign(ep, picked)
          }
        })
      }

      return original
    },
  },
)

const ignoreTitle = ref(true)

const onSubmit = async () => {
  const body = ignoreTitle.value
    ? tv.value.episodes.map((e) => {
        delete e.title
        return e
      })
    : tv.value.episodes

  await $fetch(`/api/tv/${route.params.drama_id}/episodes`, {
    method: 'post',
    body,
  })
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Episodes added/updated successfully!',
        life: 3000,
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: error.message,
        life: 3000,
      })
    })
}
</script>
