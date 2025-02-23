<template>
  <div class="global-footer">
    <div class="global-footer-copyright">
      <NuxtLink to="/" target="_blank">
        {{ $config.app.name }}
      </NuxtLink>
      ©{{ new Date().getFullYear() }} - Made with ☕️ in Hanoi
    </div>
  </div>
</template>

<style>
.global-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.credits {
  margin-bottom: 1rem;
}
</style>
