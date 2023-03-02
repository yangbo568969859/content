<template>
  <div>
    <WebHeader />
    <WebContent />
    <WebFooter />
  </div>
</template>

<script>
import WebFooter from '@/components/global/Footer'
import WebHeader from '@/components/global/Header'
import WebContent from '@/components/global/Content'
export default {
  components: {
    WebFooter,
    WebHeader,
    WebContent
  },
  data() {
    return {
      theme: 'light',
    }
  },
  methods: {
    switchTheme() {
      if (this.$colorMode.preference === 'dark') {
        this.$colorMode.preference = 'light'
      } else {
        this.$colorMode.preference = 'dark'
      }
    },
  },
}
</script>
