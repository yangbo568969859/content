<template>
  <div class="md">
    <WebHeader />
    <div class="md-list">
      <nuxt-link v-for="item in mdList" :key="item.id" :to="item.to">
        <div class="md-list-item">
          <div class="left">{{ item.name }}</div>
          <div class="right">{{ item.time }}</div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import WebHeader from '@/components/global/Header'
export default {
  components: {
    WebHeader
  },
  async asyncData () {
    if (process.server) {
      // const path = require('path')
      // const componentPath = path.resolve(process.cwd(), './content')
      // const fse = require('fs-extra')
      // const fileRes = await fse.readdir(componentPath)
      // console.log(fileRes)
    }
  },
  data () {
    return {
      mdList: [
        {
          name: 'Zig Build System Internals',
          time: '2022.03.08',
          id: 1,
          to: '/md/three/base'
        },
        {
          name: 'Zig 11111 System Internals',
          time: '2022.03.12',
          id: 2,
          to: '/md/designPatterns/pattern1'
        }
      ]
    }
  }
}
</script>

<style lang="less">
.md {
  // display: flex;
  // width: 100%;
  // flex-direction: column;

  &-list {
    flex: 1;
    display: flex;
    flex-direction: column;

    &-item {
      display: flex;
      justify-content: space-between;

      .left {
        font-size: 16px;
      }
      .right {
        font-size: 13px;
        color: #333;
      }
    }
  }
}
</style>