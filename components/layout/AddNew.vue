<template>
  <SplitButton
    icon="pi pi-plus-circle"
    label="Add New..."
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
    label: 'TV/Drama',
    icon: 'pi pi-video',
    command: () => router.push('/tv'),
  },
  {
    label: 'People',
    icon: 'pi pi-user-plus',
    command: () => router.push('/people'),
  },
]
</script>
