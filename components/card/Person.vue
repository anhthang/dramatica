<template>
  <div
    class="flex gap-3 p-3"
    :class="{
      'items-center !p-0': simple,
      'relative bg-emerald-100 dark:bg-emerald-900 border-emerald-500 border rounded-md':
        selected,
      'p-3 relative border border-slate-200 dark:border-zinc-700 rounded-md':
        bordered && !selected,
    }"
  >
    <Avatar
      v-if="image"
      :image="image"
      :size="size"
      class="relative"
      pt:image:class="object-cover"
      shape="circle"
    />
    <Avatar v-else :label="title.charAt(0)" :size="size" shape="circle" />

    <span v-if="simple">{{ title }}</span>
    <Card
      v-else
      class="!shadow-none !bg-transparent flex-1"
      pt:body:class="p-0"
    >
      <template #title>{{ title }}</template>
      <template v-if="subtitle" #subtitle>{{ subtitle }}</template>
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
    default: '',
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
  simple: Boolean,
  selected: Boolean,
  bordered: Boolean,
})
</script>
