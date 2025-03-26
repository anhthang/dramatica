<template>
  <Panel
    header="Add New Person"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <FormPerson />

    <Toast />
  </Panel>
</template>

<script setup>
useSeoMeta({
  title: 'Add New Person',
})
</script>
