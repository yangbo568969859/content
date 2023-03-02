<template>
  <main>
    <div>
      <div class="px-4 max-w-container-max-width my-10 mx-auto">
        <div
          class="text-sm leading-sm w-full max-w-readable-line-length md:text-eight md:leading-eight nuxt-content"
        >
          <p>
            Hello! I am <em>Yangbo</em>
            . I am a web developer
          </p>
          <br />
          <p>I am also on JueJin</p>
        </div>
      </div>
      <div
        class="bg-light-mode-surface-color dark:bg-dark-mode-surface-color"
      ></div>
    </div>
  </main>
</template>

<style lang="less">
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.note {
  transition: all 0.3s;
  display: inline-block;
  padding: 15px 15px;
  border-radius: 5px;
  background-color: var(--bg-secondary);
  color: var(--color-secondary);
}
</style>