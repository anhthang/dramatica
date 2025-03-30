<template>
  <div
    class="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
  >
    <div class="relative w-full aspect-[195/118.5] rounded-lg overflow-hidden">
      <img
        :src="tv.cover_url"
        class="w-full h-full object-cover"
        :alt="tv.title"
      />
      <!-- <div
        class="absolute z-10 top-2 right-2 px-2 py-1 text-sm font-medium leading-tight bg-surface-0 dark:bg-surface-950 border border-surface rounded-md"
      >
        {{ tv.point }}
      </div> -->
      <!-- <div class="absolute z-10 bottom-2 inset-x-2">
        <ProgressBar
          :value="tv.watchedPercent"
          :show-value="false"
          :pt="{
            root: {
              class: '!h-1.5 !bg-surface-950 dark:!bg-surface-50 !rounded-full',
            },
            value: {
              class: '!bg-surface-0 dark:!bg-surface-950 !rounded-full',
            },
          }"
        />
      </div> -->
    </div>
    <div class="mt-2 flex items-start justify-between gap-1">
      <div class="px-2 flex-1">
        <div class="text-lg font-medium text-color leading-6 line-clamp-1">
          {{ tv.title }}
        </div>
        <!-- <div class="mt-1 text-muted-color text-sm leading-5">
          {{ tv.categories.join(', ') }}
        </div> -->
      </div>
      <!-- <Button
        v-if="tv.bookmarked"
        icon="pi pi-bookmark-fill"
        severity="contrast"
        text
        rounded
      /> -->
    </div>
  </div>
</template>

<script setup>
defineProps({
  tv: {
    type: Object,
    default: () => ({}),
  },
})
</script>
