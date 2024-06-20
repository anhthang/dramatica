<template>
  <a-flex gap="middle">
    <layout-add-new />

    <layout-language-switcher />

    <a-dropdown>
      <a-avatar v-if="user" :src="user.picture" style="cursor: pointer" />
      <a-avatar v-else>
        <template #icon><user-outlined /> </template>
      </a-avatar>

      <template #overlay>
        <a-menu
          v-if="user"
          :selected-keys="[$colorMode.preference]"
          @click="onChangeMenu"
        >
          <layout-appearance />
          <a-menu-divider />

          <a-menu-item key="logout">
            <template #icon><logout-outlined /></template> Logout
          </a-menu-item>
        </a-menu>
        <a-menu
          v-else
          :selected-keys="[$colorMode.preference]"
          @click="onChangeMenu"
        >
          <a-menu-item key="login">
            <template #icon><login-outlined /></template> Login
          </a-menu-item>
          <a-menu-divider />

          <layout-appearance />
        </a-menu>
      </template>
    </a-dropdown>

    <a-modal v-model:open="visible" destroy-on-close :footer="null">
      <modal-login />
    </a-modal>
  </a-flex>
</template>

<script setup>
const client = useSupabaseClient()
const colorMode = useColorMode()
const router = useRouter()

const user = useState('authenticated')

const visible = ref(false)
const toggleShowLogin = () => {
  visible.value = !visible.value
}

const logout = async () => {
  const { error } = await client.auth.signOut()
  if (error) {
    message.error(error.message)
  } else {
    user.value = undefined
    message.success('You have been logged out successfully.')

    navigateTo('/')
  }
}

const onChangeMenu = (e) => {
  if (!e.key) {
    // nothing
  } else if (e.key.startsWith('/')) {
    router.push(e.key)
  } else if (e.key === 'login') {
    toggleShowLogin()
  } else if (e.key === 'logout') {
    logout()
  } else {
    colorMode.preference = e.key
  }
}
</script>
