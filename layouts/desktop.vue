<template>
  <a-layout>
    <SpeedInsights />
    <a-layout-header
      :style="{
        position: 'fixed',
        zIndex: 1,
        width: '100%',
        background: token.colorBgLayout,
        borderBlockEnd: `1px solid ${token.colorSplit}`,
      }"
    >
      <a-flex justify="space-between" align="center" style="width: 100%">
        <nuxt-link to="/">
          <!-- https://www.freepik.com/icon/television_5481937 -->
          <img src="/tv.png" alt="logo" height="40px" />
        </nuxt-link>

        <layout-right-header />
      </a-flex>
    </a-layout-header>

    <a-layout-content style="margin-top: 64px">
      <NuxtPage />
    </a-layout-content>
    <a-layout-footer>
      <layout-footer />
    </a-layout-footer>

    <a-back-top />
  </a-layout>
</template>

<script setup>
import { theme } from 'ant-design-vue'

import { SpeedInsights } from '@vercel/speed-insights/nuxt'
const { token } = theme.useToken()
</script>
