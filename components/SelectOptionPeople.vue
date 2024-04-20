<template>
  <a-flex gap="small" align="center">
    <a-avatar :src="item.profile_url" size="small">
      {{ peopleName.charAt(0) }}
    </a-avatar>
    {{ peopleName }} ({{ item.native_name }})
  </a-flex>
</template>

<script setup>
const { item } = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const { locale } = useI18n()

const peopleName = computed(() => toLocalePeopleName(item, locale.value))
</script>
