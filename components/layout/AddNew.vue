<template>
  <a-dropdown trigger="click">
    <a-button>
      <plus-outlined />
      <caret-down-outlined />
    </a-button>

    <template #overlay>
      <a-menu @click="onChangeMenu">
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

const onChangeMenu = (e) => {
  router.push(e.key)
}
</script>
