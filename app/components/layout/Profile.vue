<template>
  <Avatar
    v-if="user"
    :image="user.picture"
    shape="circle"
    class="cursor-pointer"
    @click="toggleProfileSettings"
  />
  <Avatar
    v-else
    icon="pi pi-user"
    shape="circle"
    class="cursor-pointer"
    @click="toggleProfileSettings"
  />
  <Menu
    id="overlay_menu"
    ref="profileSettings"
    :model="settingsMenu"
    :popup="true"
  />

  <Dialog
    v-model:visible="visible"
    modal
    class="w-[36rem]"
    :closable="false"
    dismissable-mask
  >
    <ModalLogin />
  </Dialog>
</template>

<script setup>
const client = useSupabaseClient()
const colorMode = useColorMode()
const toast = useToast()

const user = useState('authenticated')

const profileSettings = ref()
const toggleProfileSettings = (event) => {
  profileSettings.value.toggle(event)
}

const onChangeTheme = (mode) => {
  colorMode.preference = mode
}

const activePopMenu = '!bg-slate-100 dark:!bg-zinc-800 rounded'

const settingsMenu = computed(() => {
  const items = [
    {
      label: 'Appearance',
      items: [
        {
          label: 'System',
          icon: 'pi pi-desktop',
          command: () => onChangeTheme('system'),
          class: colorMode.preference === 'system' && activePopMenu,
        },
        {
          label: 'Light',
          icon: 'pi pi-sun',
          command: () => onChangeTheme('light'),
          class: colorMode.preference === 'light' && activePopMenu,
        },
        {
          label: 'Dark',
          icon: 'pi pi-moon',
          command: () => onChangeTheme('dark'),
          class: colorMode.preference === 'dark' && activePopMenu,
        },
      ],
    },
  ]

  if (user.value) {
    items.unshift(
      {
        label: user.value.name,
        items: [
          {
            label: user.value.email,
            disabled: true,
          },
        ],
      },
      {
        separator: true,
      },
    )

    items.push(
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          logout()
        },
      },
    )
  } else {
    items.unshift(
      {
        label: 'Welcome',
        items: [
          {
            label: 'Login',
            icon: 'pi pi-sign-in',
            command: () => {
              toggleShowLogin()
            },
          },
        ],
      },
      {
        separator: true,
      },
    )
  }

  return items
})

const visible = ref(false)
const toggleShowLogin = () => {
  visible.value = !visible.value
}

const logout = async () => {
  const { error } = await client.auth.signOut()
  if (error) {
    toast.add({ severity: 'error', summary: error.message, life: 3000 })
  } else {
    toast.add({
      severity: 'success',
      summary: 'You have been logged out successfully.',
      life: 3000,
    })

    navigateTo('/')
  }
}
</script>
