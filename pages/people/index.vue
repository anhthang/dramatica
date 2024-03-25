<template>
  <a-page-header class="container" title="People">
    <a-card title="People Information">
      <template #extra>
        <a-button type="primary" :loading="loading" @click="onSave">
          <save-outlined /> Save
        </a-button>
      </template>
      <form-people ref="peopleForm" />
    </a-card>
  </a-page-header>
</template>

<script setup>
useSeoMeta({
  title: 'People',
})

const loading = ref(false)
const peopleForm = ref()

const onSave = async () => {
  loading.value = true

  await peopleForm.value.onSubmit()

  loading.value = false
}
</script>
