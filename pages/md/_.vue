<template>
  <div class="container">
    <article class="post-article">
      <div class="post-card">
        <nuxt-content :document="page"></nuxt-content>
      </div>
    </article>
    <aside class="post-widget">
      <nav class="post-toc-wrap">
        <h4 class="catalog-title">目录</h4>
        <ul class="catalog-list">
          <li class="catalog-list-item" v-for="(title, index) in toc" :key="index">
            <div class="a-container">
              <a :href="`#${title.id}`">{{ title.text }}</a>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    console.log(params)
    const fetchUrl = params.pathMatch
    const page = await $content(fetchUrl).fetch()
    let toc = []
    if (page.toc) {
      toc = page.toc
    }

    // console.log(page)

    return {
      page,
      toc
    }
  },
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {
  }
  // validate({ params }) {
  //   console.log(params)
  // }
}
</script>
<style lang="less">
.container {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 1140px;
}
.post-article {
  position: relative;
  width: 820px;
  max-width: 100%;
  box-sizing: border-box;

}
.post-card {
  margin-top: 50px;
  min-height: 100px;
  padding: 35px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 24px rgba(64, 80, 128, 0.08);
}

.post-widget {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  transition: top .2s;
}

.post-toc-wrap {
  background: #fff;
  border-radius: 4px;
  padding: 0;
}

.catalog-title {
  font-weight: 500;
  padding: 16px 0;
  margin: 0 20px;
  font-size: 16px;
  line-height: 24px;
  color: #1d2129;
  border-bottom: 1px solid #e4e6eb;
}

.catalog-list {
  position: relative;
  line-height: 22px;
  padding: 0 0 12px;
  &-item {
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #333;
    list-style: none;
    &:hover {
      a {
        background-color: #f7f8fa;
        border-radius: 4px;
      }
    }
  }
}
.a-container {
      margin: 0;
    padding: 0 0 0 11px;
      display: block;
    position: relative;
    padding: 0 0 0 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    a {
          color: inherit;
    display: inline-block;
    padding: 8px;
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    }
}
</style>