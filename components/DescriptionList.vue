<template>
  <ul class="list-none p-0 m-0">
    <li
      v-for="(description, idx) in descriptions"
      :key="description.title"
      class="flex items-center py-2 px-2 flex-wrap"
      :class="{
        'border-t border-surface': idx !== 0,
      }"
    >
      <div
        class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium"
      >
        {{ $t(description.title) }}
      </div>
      <div
        v-if="description.title === 'Status'"
        class="text-surface-900 dark:text-surface-0 w-full md:w-10/12 md:order-none order-1 text-justify"
      >
        {{ $t(description.value) }}
      </div>
      <div
        v-else
        class="text-surface-900 dark:text-surface-0 w-full md:w-10/12 md:order-none order-1 text-justify"
      >
        {{ description.value }}
      </div>
    </li>
  </ul>
</template>

<script setup>
const { descriptions } = defineProps({
  descriptions: {
    type: Array,
    default: () => [],
  },
})
</script>
