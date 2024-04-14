<template>
  <a-dropdown disabled>
    <a-button> <translation-outlined /> English </a-button>

    <template #overlay>
      <a-menu @click="onChangeLocale">
        <a-menu-item key="en"> English </a-menu-item>
        <a-menu-item key="vi"> Tiếng Việt </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
const onChangeLocale = () => {
  // console.log('locale', e.key)
}
</script>
