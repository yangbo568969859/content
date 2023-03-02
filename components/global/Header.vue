<template>
  <header class="max-w-container-max-width m-auto px-4 h-14 md:h-20">
    <div class="h-full flex items-center justify-between">
      <div class="flex">
        <h1
          class="text-base leading-base font-bold-body-weight uppercase md:text-six md:leading-six"
        >
          Yangbo
        </h1>
        <div class="menu md:text-six md:leading-six">
          <nuxt-link to="/">About</nuxt-link>
          <nuxt-link to="/md/list">Writing</nuxt-link>
        </div>
      </div>
      <div>
        <ColorModePicker />
      </div>
    </div>
  </header>
</template>

<script>
import ColorModePicker from '@/components/ColorModePicker'
export default {
  components: {
    ColorModePicker
  }
}
</script>

<style lang="less" scoped>
.menu {
  margin-left: 60px;
}
</style>