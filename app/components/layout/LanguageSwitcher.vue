<template>
  <Select
    v-model="locale"
    :options="locales"
    option-label="name"
    option-value="code"
    size="small"
    @change="(e) => setLocale(e.value)"
  >
    <template #dropdownicon>
      <i class="pi pi-language" />
    </template>
  </Select>
</template>

<script setup>
const { locale, locales, setLocale } = useI18n()
</script>
