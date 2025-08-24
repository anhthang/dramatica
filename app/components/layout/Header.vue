<template>
  <Menubar>
    <template #start>
      <NuxtLink to="/">
        <span
          class="logo-text text-3xl bg-gradient-to-r from-blue-400 to-violet-600 text-transparent bg-clip-text"
        >
          {{ $config.app.name }}
        </span>
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

<style>
.logo-text {
  font-family: 'Amarante', serif;
  font-weight: 400;
  font-style: normal;
}
</style>
