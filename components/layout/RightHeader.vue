<template>
  <a-dropdown>
    <a-avatar>
      <template #icon><user-outlined /> </template>
    </a-avatar>

    <template #overlay>
      <a-menu :selected-keys="[$colorMode.preference]" @click="onChangeMenu">
        <layout-appearance />
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
const colorMode = useColorMode()

const onChangeMenu = (e) => {
  if (!e.key) {
    // nothing
  } else {
    colorMode.preference = e.key
  }
}
</script>
