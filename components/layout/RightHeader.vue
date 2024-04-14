<template>
  <a-flex gap="middle">
    <layout-locale />

    <layout-add-new />

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
  </a-flex>
</template>

<script setup>
const router = useRouter()
const colorMode = useColorMode()

const onChangeMenu = (e) => {
  if (!e.key) {
    // nothing
  } else if (e.key.startsWith('/')) {
    router.push(e.key)
  } else {
    colorMode.preference = e.key
  }
}
</script>
