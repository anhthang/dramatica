<template>
  <div
    class="flex items-center gap-3 w-full"
    :class="{
      'items-center !p-0': simple,
      'p-3 relative bg-emerald-100 dark:bg-emerald-900 border border-emerald-500 rounded-md':
        selected,
      'p-3 relative border border-slate-200 dark:border-zinc-700 rounded-md':
        bordered && !selected,
    }"
  >
    <img
      class="w-40 shrink-0 rounded"
      :class="{
        '!w-16': size === 'small',
        '!w-48': size === 'large',
      }"
      :src="image"
      :alt="title"
    />

    <span v-if="simple">{{ title }}</span>
    <Card v-else class="!shadow-none bg-transparent flex-1" pt:body:class="p-0">
      <template #title>{{ title }}</template>
      <template v-if="subtitle" #subtitle>{{ subtitle }}</template>
      <template v-if="content" #content>{{ content }}</template>
    </Card>

    <div
      v-if="selected"
      class="absolute top-0 right-0 w-0 h-0 border-[10px] border-emerald-500 border-b-[10px] border-b-transparent border-l-[10px] border-l-transparent rounded-tr-md"
    />
  </div>
</template>

<script setup>
defineProps({
  image: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'normal',
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  simple: Boolean,
  selected: Boolean,
  bordered: Boolean,
})
</script>
