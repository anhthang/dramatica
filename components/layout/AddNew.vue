<template>
  <SplitButton
    icon="pi pi-plus-circle"
    label="Add"
    outlined
    severity="secondary"
    :model="items"
    size="small"
  />
</template>

<script setup>
const router = useRouter()

const items = [
  {
    label: 'New TV/Drama',
    icon: 'pi pi-video',
    command: () => router.push('/tv'),
  },
  {
    label: 'New People',
    icon: 'pi pi-user-plus',
    command: () => router.push('/people'),
  },
]
</script>
