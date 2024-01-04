# creative-platform-service-frontend

## Project setup

```shell
npm install
```

### Compiles and hot-reloads for development

```shell
npm run serve
```

### Compiles and minifies for production

```shell
npm run build
```

### Lints and fixes files

```shell
npm run lint
```

## TODO

1. 菜单导航未实现someApis功能，未实现children权限功能
2. 接口请求发出之前先判断当前接口是否有权限再发送

### 项目架构

- vue-cli全家桶
  - vue-config-js vue-cli的配置文件
    - 增加打包分析工具 npm run analyzer
    - 增加ant-design-vue icons 按需加载配置项 需要的icon需要在 src/assets/icons.js 声明引入
    - 增加moment的语言筛选功能，目前只打包 中文和英文
    - 增加首屏js拆解，利用webpack的splitChunks 将 wangeditor从主包拆解出去，按需加载拆解后的js
    - vue-router import 增加 webpackChunkName 配置，可以知道每个懒加载路由的页面具体大小是多少，分析大小并优化
    - 优化之后 parsed 体积缩小 60%； gzipped包缩小 30%

### 运行注意事项

- 根文件需要新增本地env环境变量(.env.local文件)

```shell
VUE_APP_API_URL=https://cms-test.163yun.com
VUE_APP_PASSPORT_URL=https://console-test.g.163yun.com
VUE_APP_VISUAL_PREVIEW_URL=https://creative-cms-visual-dev.163cms.com
```

- 本地电脑需要配置域名相关的hosts
  - windows电脑hosts目录 C:\Windows\System32\drivers\etc
  - 或者下载switchHosts管理hosts

  ```shell
    本地ip g-test.163yun.com cms-test.163yun.com
    59.111.163.8 cms-test.163yun.com
    59.111.163.8 console-dev.g.163yun.com g.163yun-dev.com
  ```

- npm run serve
- google浏览器打开 <http://test.163yun.com:8080>
