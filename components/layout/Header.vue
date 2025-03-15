<template>
  <Menubar>
    <template #start>
      <NuxtLink to="/">
        <img :src="`/tv.png`" class="h-8" />
      </NuxtLink>
    </template>

    <template #end>
      <div class="flex items-center gap-2">
        <LayoutAddNew />

        <LayoutLanguageSwitcher />

        <LayoutProfile />
      </div>
    </template>
  </Menubar>
</template>
