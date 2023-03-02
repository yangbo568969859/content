<template>
  <div>
    <WebHeader />
    <div class="content">
      <section class="word">
        <div class="menu">
          <nuxtLink to="/Flutter">Flutter</nuxtLink>
          <nuxtLink to="/Vue">Vue</nuxtLink>
          <nuxtLink to="/All">All</nuxtLink>
        </div>
      </section>
      <section class="article-list">
        <div class="article-item" v-for="article in articleList" :key="article.id">
          <span>{{ article.time }}</span>
          <a href="" class="title-content">
            <span class="title">{{ article.title }}</span>
          </a>
        </div>
      </section>
    </div>
    <WebFooter />
  </div>
</template>

<script>
import WebHeader from '@/components/global/Header'
import WebFooter from '@/components/global/Footer'
export default {
  components: {
    WebFooter,
    WebHeader
  },
  async asyncData ({}) {
    let articleList = [
      {
        id: 111,
        title: 'React Suspense',
        time: '2020-08-03'
      },
      {
        id: 1131,
        title: '实现一个网页终端',
        time: '2020-07-03'
      },
      {
        id: 1113,
        title: '关于 CSS Houdini',
        time: '2021-06-06'
      },
      {
        id: 1121,
        title: '网页中的直播',
        time: '2021-06-03'
      },
      {
        id: 1111,
        title: 'Vue 中的 nextTick',
        time: '2020-06-01'
      }
    ]
    return {
      articleList
    }
  }
}
</script>

<style lang="less">
.content {
  min-height: 300px;
}
.article-list {
  width: 600px;
  min-height: 300px;
  margin: 60px auto 40px auto;
}
.article-item {
  display: flex;
  align-items: center;
  margin-top: 40px;
  .title-content {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
}
.word {
  display: flex;
  // justify-content: center;
  width: 600px;
  margin: 0 auto;
}
.menu {
  a {
    position: relative;
    margin-right: 30px;
    font-size: 14px;
    text-align: center;
    color: var(--color-primary);
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 1px;
      bottom: 0;
      left: 0;
      background-color: var(--color-primary);
      visibility: hidden;
      transform: scaleX(0);
      transition: all .25s ease;
    }
    &:hover {
      &::before {
        visibility: visible;
        transform: scaleX(1);
      }
    }
  }
}

@media (min-width: 600px) {
  .title-content {
    &:hover {
      &::before {
        visibility: visible;
        transform: scaleX(1);
      }
    }
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 1px;
      bottom: 0;
      left: 0;
      background-color: #1B3DCC;
      visibility: hidden;
      transform: scaleX(0);
      transition: all .25s ease;
    }
  }
}
</style>