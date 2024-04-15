<template>
  <a-dropdown>
    <a-button> <translation-outlined /> {{ localeMap[locale].name }} </a-button>

    <template #overlay>
      <a-menu :selected-keys="[locale]" @click="onChangeLocale">
        <a-menu-item v-for="{ code, name } in locales" :key="code">
          {{ name }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import keyBy from 'lodash.keyby'

const { locale, locales, setLocale } = useI18n()

const localeMap = keyBy(locales.value, 'code')

const onChangeLocale = (e) => {
  setLocale(e.key)
}
</script>
