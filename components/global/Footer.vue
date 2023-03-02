<template>
  <footer
    class="
      max-w-container-max-width
      m-auto
      p-4
      h-20
      text-sm
      leading-sm
      flex flex-col
      justify-center
      md:text-base
      md:leading-base
      md:flex-row
      md:justify-between
      md:items-center
    "
  >
    <div>
      <span class="text-grey-base"> © {{ time }} </span>
      <span>YangBo</span>
    </div>
    <div>
      <ul class="flex">
        <li class="mr-2 flex">
          <nuxtLink to="/archives" rel="noopener noreferrer" class="mr-2"
            >Archives</nuxtLink
          >
          <span class="text-grey-base">/</span>
        </li>
        <li class="mr-2 flex">
          <a href="/" target="_blank" rel="noopener noreferrer" class="mr-2"
            >Email</a
          >
          <span class="text-grey-base">/</span>
        </li>
        <li class="mr-2 flex">
          <a
            href="https://juejin.cn/user/2594503171260199"
            target="_blank"
            rel="noopener noreferrer"
            class="mr-2"
          >
            JueJin
          </a>
          <span class="text-grey-base">/</span>
        </li>
        <li class="mr-2 flex">
          <a
            href="https://github.com/ybb926426"
            target="_blank"
            rel="noopener noreferrer"
            class="mr-2"
          >
            GitHub
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      time: 2022
    }
  },
  created () {
    this.getTimeYear()
  },
  methods: {
    getTimeYear () {
      const time = new Date()
      this.time = time.getFullYear()
    }
  }
}
</script>