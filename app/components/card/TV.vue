<template>
  <div
    class="flex flex-col sm:flex-row sm:items-center p-3 gap-3 border rounded-md"
    :class="{
      'card-highlighted': highlight,
    }"
  >
    <div class="md:w-48 relative">
      <img
        class="block xl:block mx-auto rounded w-full"
        :src="tv.cover_url"
        :alt="tv.title"
      />
    </div>
    <div
      class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6"
    >
      <div class="flex flex-row md:flex-col justify-between items-start gap-2">
        <div class="text-lg font-medium">
          {{ tv.release_year ? `${tv.title} (${tv.release_year})` : tv.title }}
        </div>
        <span class="text-muted-color text-sm">
          {{ tv.title_pinyin || tv.original_title }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tv: {
    type: Object,
    default: () => ({}),
  },
  highlight: Boolean,
})
</script>
