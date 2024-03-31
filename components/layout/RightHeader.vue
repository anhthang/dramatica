<template>
  <a-dropdown>
    <a-avatar>
      <template #icon><user-outlined /> </template>
    </a-avatar>

    <template #overlay>
      <a-menu :selected-keys="[$colorMode.preference]" @click="onChangeMenu">
        <layout-appearance />

        <a-menu-divider />
        <a-menu-item key="/tv">
          <template #icon><video-camera-add-outlined /></template> New TV/Drama
        </a-menu-item>
        <a-menu-item key="/people">
          <template #icon><user-add-outlined /></template> New People
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
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
