<template>
  <div>
    <div
      v-if="title"
      class="font-medium text-xl mb-2"
      :class="{ 'mb-4': !subtitle }"
    >
      {{ $t(title) }}
    </div>
    <div v-if="subtitle" class="text-slate-500 dark:text-zinc-400 mb-6">
      {{ subtitle }}
    </div>

    <ul class="list-none p-0 m-0">
      <li
        v-for="(description, idx) in descriptions"
        :key="description.title"
        class="flex items-center py-2 px-2 flex-wrap"
        :class="{
          'border-t border-zinc-100 dark:border-zinc-700': idx !== 0,
        }"
      >
        <div
          class="text-surface-500 dark:text-surface-300 w-6/12 md:w-3/12 font-medium"
        >
          {{ $t(description.title) }}
        </div>
        <div
          v-if="description.title === 'Status'"
          class="text-surface-500 dark:text-surface-200 w-full md:w-9/12 md:order-none order-1 text-justify"
        >
          {{ $t(description.value) }}
        </div>
        <div
          v-else
          class="text-surface-500 dark:text-surface-200 w-full md:w-9/12 md:order-none order-1 text-justify"
        >
          {{ description.value }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  descriptions: {
    type: Array,
    default: () => [],
  },
})
</script>
