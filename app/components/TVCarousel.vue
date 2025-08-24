<template>
  <div class="flex items-center justify-between gap-2 px-2 mb-2">
    <div class="text-color text-xl font-medium leading-7">
      <i class="mr-2" :class="iconMap[heading]" />
      {{ $t(heading) }}
    </div>

    <div
      v-if="items.length > itemsPerPage"
      class="xl:flex hidden items-center gap-2"
    >
      <Button
        :disabled="page === 0"
        icon="pi pi-chevron-left"
        severity="secondary"
        size="small"
        text
        @click="page -= 1"
      />
      <Button
        :disabled="page === items.length - page"
        icon="pi pi-chevron-right"
        severity="secondary"
        size="small"
        text
        @click="page += 1"
      />
    </div>
    <!-- <div class="xl:hidden flex items-center gap-2">
      <Button
        :disabled="page === 0"
        icon="pi pi-chevron-left"
        severity="secondary"
        outlined
        @click="page -= 1"
      />
      <Button
        :disabled="page === items.length - 3"
        icon="pi pi-chevron-right"
        severity="secondary"
        outlined
        @click="page += 1"
      />
    </div> -->
  </div>

  <Carousel
    v-if="items.length > itemsPerPage"
    :value="items"
    :page="page"
    :num-visible="itemsPerPage"
    :num-scroll="itemsPerPage"
    :responsive-options="responsiveOptions"
    :show-indicators="false"
    :show-navigators="false"
    circular
    :autoplay-interval="3000"
  >
    <template #item="{ data: tv }">
      <NuxtLink :to="`/${tv.id}`">
        <CardTVCarousel :tv="tv" />
      </NuxtLink>
    </template>
  </Carousel>
  <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
    <div v-for="(tv, index) of items" :key="index" class="cursor-pointer">
      <NuxtLink :to="`/${tv.id}`">
        <CardTVCarousel :tv="tv" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  heading: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
})

const itemsPerPage = 4

const iconMap = {
  Airing: 'pi pi-volume-up',
  Trending: 'pi pi-chart-line',
  Upcoming: 'pi pi-bell',
}

const page = ref(0)
const responsiveOptions = [
  {
    breakpoint: '1199px',
    numVisible: 3,
    numScroll: 1,
  },

  {
    breakpoint: '767px',
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: '575px',
    numVisible: 1,
    numScroll: 1,
  },
]
</script>
