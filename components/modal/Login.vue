<template>
  <div class="flex flex-col gap-12">
    <span
      class="text-4xl font-bold bg-gradient-to-r from-red-300 via-pink-400 to-violet-600 dark:from-amber-200 dark:to-rose-400 text-transparent bg-clip-text"
    >
      Welcome back
    </span>
    <div class="flex flex-col gap-4">
      <Button
        label="Continue with Google"
        icon="pi pi-google"
        class="!bg-[#ea4335] !text-white !border-none"
        @click="login('google')"
      />

      <span class="text-center">
        By clicking continue, you agree to our
        <NuxtLink href="/policy" target="_blank" class="underline">
          Privacy Policy
        </NuxtLink>
        and Terms of Service.
      </span>
    </div>

    <Toast />
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const toast = useToast()

const login = async (provider) => {
  const { user, error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
    },
  })

  if (error) {
    toast.add({ severity: 'error', summary: err.message, life: 3000 })
  } else if (user) {
    toast.add({
      severity: 'success',
      summary: `Hello, ${user.name}. You successfully logged into this website.`,
      life: 3000,
    })

    router.back()
  }
}
</script>
