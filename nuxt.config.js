export default {
  env: {
    STATIC_URL: process.env.STATIC_URL || ''
  },
  /*
   ** Build configuration
   */
  build: {
    extend(config, { isDev, isClient }) {
      if (!isDev && process.env.STATIC_URL) {
        config.output.publicPath = process.env.STATIC_URL
      }
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'Yang Bo | LUo bin',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Yang Bo | LUo bin Created By Serverless Framework'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: `${process.env.STATIC_URL || ''}/favicon.ico` }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@/assets/style/base.less', '@/assets/style/main.less'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    // '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/svg',
    '@nuxtjs/pwa',
    '@nuxtjs/color-mode',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxt/content'
  ],
  content: {},
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  pwa: {
    icon: {
      source: '/logo512.png',
      fileName: 'icon.png'
    },
    manifest: {
      name: 'YangBo | LUo Bin',
      short_name: 'YangBo',
      lang: 'en',
      display: 'standalone',
      orientation: 'any',
      theme_color: '#8a00f9',
      background_color: '#ffffff',
      // icons: [
      //   {
      //     src: 'static/favicon.ico',
      //     sizes: '64x64 32x32 24x24 16x16',
      //     type: 'image/x-icon',
      //   },
      //   {
      //     src: 'static/logo128.png',
      //     sizes: '128x128',
      //     type: 'image/png',
      //   },
      //   {
      //     src: 'static/logo144.png',
      //     sizes: '144x144',
      //     type: 'image/png',
      //   },
      //   {
      //     src: 'static/logo192.png',
      //     sizes: '192x192',
      //     type: 'image/png',
      //   },
      //   {
      //     src: 'static/logo256.png',
      //     sizes: '256x256',
      //     type: 'image/png',
      //   },
      //   {
      //     src: 'static/logo512.png',
      //     sizes: '512x512',
      //     type: 'image/png',
      //   }
      // ]
    }
  }
}
