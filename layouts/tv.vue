<template>
  <div
    class="bg-zinc-50 dark:bg-zinc-950 w-full h-screen p-6 flex items-start gap-6 overflow-hidden"
  >
    <!-- <LayoutSider /> -->
    <div
      class="flex flex-col flex-1 mx-auto max-w-screen-2xl h-full overflow-y-auto pb-0.5"
    >
      <LayoutHeader />

      <Panel
        header="Manage TV"
        class="flex-grow"
        :pt="{
          root: '!border-0 !bg-transparent',
          title: 'flex items-center gap-4 font-medium text-3xl',
          headerActions: 'flex gap-2',
        }"
      >
        <template #icons>
          <NuxtLink :to="`/${$route.params.drama_id}`">
            <Button label="View TV" icon="pi pi-video" severity="info" />
          </NuxtLink>
        </template>
        <div class="flex gap-4">
          <MegaMenu
            :model="items"
            class="w-2/12"
            orientation="vertical"
            :pt="{
              root: '!border-0 !bg-transparent !min-w-fit',
              itemContent: 'py-1 hover:dark:!bg-zinc-700 hover:rounded',
            }"
          />

          <NuxtPage class="w-10/12" />
        </div>
      </Panel>

      <LayoutFooter />
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const information = ref()

provide('setPageInformation', (data) => {
  information.value = data
})

const onChangeMenu = ({ item }) => {
  router.push(item.route)
}

const activeMenu = '!bg-slate-200 dark:!bg-zinc-800 rounded'

const items = computed(() => [
  {
    label: 'Information',
    icon: 'pi pi-info-circle',
    route: `/manage/${route.params.drama_id}`,
    class: route.path === `/manage/${route.params.drama_id}` && activeMenu,
    command: onChangeMenu,
  },
  {
    label: 'Cast & Crew',
    icon: 'pi pi-users',
    route: `/manage/${route.params.drama_id}/cast`,
    class: route.path === `/manage/${route.params.drama_id}/cast` && activeMenu,
    command: onChangeMenu,
  },
  {
    label: 'Episodes',
    icon: 'pi pi-youtube',
    route: `/manage/${route.params.drama_id}/episodes`,
    class:
      route.path === `/manage/${route.params.drama_id}/episodes` && activeMenu,
    command: onChangeMenu,
  },
  {
    label: 'Services',
    icon: 'pi pi-desktop',
    route: `/manage/${route.params.drama_id}/service`,
    class:
      route.path === `/manage/${route.params.drama_id}/service` && activeMenu,
    command: onChangeMenu,
  },
])
</script>
