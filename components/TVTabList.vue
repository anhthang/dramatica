<template>
  <TabList pt:tablist:class="bg-transparent">
    <Tab v-for="tab in items" :key="tab.label" :value="tab.value">
      <NuxtLink v-if="tab.value !== currentTab && tab.route" :to="tab.route">
        <div class="flex items-center gap-2 text-inherit">
          <i :class="tab.icon" />
          <span>{{ $t(tab.label) }}</span>
        </div>
      </NuxtLink>
      <div v-else class="flex items-center gap-2 text-inherit">
        <i :class="tab.icon" />
        <span>{{ $t(tab.label) }}</span>
      </div>
    </Tab>
  </TabList>
</template>

<script setup>
const { id, currentTab } = defineProps({
  id: {
    type: Number,
    required: true,
  },
  currentTab: {
    type: String,
    default: 'information',
  },
})

const items = ref([
  {
    route: `/${id}`,
    value: 'information',
    label: 'Information',
    icon: 'pi pi-video',
  },
  {
    route: `/${id}/cast`,
    value: 'cast',
    label: 'Cast',
    icon: 'pi pi-users',
  },
  {
    route: `/${id}/episodes`,
    value: 'episodes',
    label: 'Episodes',
    icon: 'pi pi-youtube',
  },
  // {
  //   route: `/${id}/streaming`,
  //   value: 'where_to_watch',
  //   label: 'Where to Watch',
  //   icon: 'pi pi-youtube',
  // },
])
</script>
