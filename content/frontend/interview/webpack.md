# Webpack

知识体系

- 配置相关
  - Loader
  - Plugin
  - Webpack性能优化
- 原理相关
  - Webpack核心库Tapable
  - Webpack调试和构建
  - Webpack热更新(HMR)原理
  - tree-shaking
  - Bable
- 其它
  - Rollup
  - Vite

## 流程

初始化阶段

- 初始化参数：从配置文件、配置对象、Shell中读取参数，与默认配置参数合并得到最终参数
- 创建编译器对象：用上一步得到的参数创建Cpmpiler对象
- 初始化编译环境：包括注入内置插件、注册各种工厂模块、初始化RuleSet集合、加载配置的插件
- 开始编译：执行Complier的run方法
- 确定入口：根据配置中的entry找出所有文件的入口，调用compilition.addEntry将入口文件转换为dependence对象

构建阶段

- 编译模块(make)：根据entry对应的dependence创建module对象，调用loader将模块转译为标准js内容，调用js解释器将内容转换为AST对象，从中找出该模块的依赖模块，再递归本步骤直到所有入口依赖的文件都经过本步骤的处理
- 完成模块编译：上一步递归处理所能触达到的模块后，得到了每个模块被翻译后的内容以及他们之间的依赖关系图

生成阶段

- 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的chunk，再把每个chunk转换成一个单独的文件加入到输出列表，这一步是可以修改输出文件内容的最后一步
- 写入文件系统：在确定好输出内容后，根据配置确定输出路径和文件名，把文件内容写入到文件系统中

## 初始化一个基本配置的webpack需要的package及分类

### webpack

- webpack 模块捆绑器。它的主要目的是捆绑 JavaScript 文件以在浏览器中使用，但它也能够转换、捆绑或打包几乎任何资源或资产
- webpack-cli 命令行界面
- webpack-dev-server 将webpack与提供实时重新加载的开发服务器结合使用。这应该仅用于开发(底层使用的webpack-dev-middleware)
- webpack-merge 合并多个webpack配置对象，提供了一个函数，可以将两个或多个配置对象合并成一个
- cross-env 跨平台运行设置和使用环境变量的脚本

### babel

- @babel/core 将 ES6+ 转译为向后兼容的 JavaScript
- @babel/plugin-proposal-class-properties 直接在类上使用属性（Babel 配置示例）

```js
class MyClass {
  myProps = 42; // 类中直接定义实例属性和静态属性，而不需要在构造函数中使用 this 关键字

  constructor() {
    console.log(this.myProps);
  }
}
```

- @babel/preset-env Babel预设，它可以根据你的目标环境自动确定你需要的 Babel 插件和 polyfills
- @babel/plugin-proposal-decorators Babel插件，用于转换装饰器语法。装饰器是一种语法，允许你注解和修改类和属性

```js
function mixin(behaviour) {
  return function(target) {
    Object.assign(target.prototype, behaviour)
  }
}
// 使用装饰器应用mixin
@mixin({ foo: 'bar' })
class MyClass {}

let obj = new MyClass();
console.log(obj.foo); // 输出 bar
```

### Loaders

- babel-loader webpack的加载器，使用babel和webpack转换 JavaScript 文件
- sass-loader 加载SCSS并编译为CSS
- postcss-loader 使用 PostCSS 处理 CSS(自动添加 CSS3 部分属性的浏览器前缀)
- css-loader 解决 CSS 导入问题
- style-loader 将 CSS 注入 DOM(就是将处理好的 css 通过 style 标签的形式添加到页面上)
- 其它
  - webpack5 之后就不需要使用url-loader、file-loader去处理图片和字体等，使用内置的asset/resource类型
    - asset/resource 类型的模块会生成一个单独的文件，并导出此文件的 URL。这与 file-loader 的行为类似
    - asset/inline 将资源作为 data URI 内联到 bundle 中，这与 url-loader 的行为类似
    - asset 在文件大小小于指定限制时，将资源作为 data URI 内联，否则作为单独的文件处理。这是 url-loader 和 file-loader 的混合行为

```js
// 图片和字体处理
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name][hash:8][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024 // 50kb
          }
        }
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
        generator: {
          filename: '[name][hash:8][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024 // 50kb
          }
        }
      },
    ]
  }
}
```

### Plugins

- html-webpack-plugin 从模板生成 HTML 文件
- clean-webpack-plugin 删除/清理构建文件夹
- mini-css-extract-plugin 将 CSS 提取到单独的文件中
- css-minimizer-webpack-plugin 优化并最小化 CSS 资源
- copy-webpack-plugin 将文件复制到构建目录

### 其它

- eslint 跨应用程序强制执行样式指南
- eslint-config-prettier 实施更漂亮的规则
- eslint-import-resolver-webpack 在 webpack 中抛出导入/导出异常

## 配置及参数

### hash

例如 filename: "[name][hash:8][ext]"

- hash：任何一个文件改动，整个项目的构建hash值都会改变
- chunkhash：文件的改动只会影响其所在chunk的hash值
- contenthash：每个文件都有单独的hash，文件的改动只会影响自身的hash值

## Loader

## Plugin

## SourceMap

SourceMap 是一种映射关系，当项目运行后，如果出现错误，我们可以利用 SourceMap 反向定位到源码位置

```js
module.exports = {
  //...
  devtool: 'source-map', // 使用完整的 SourceMap
};
```

- eval 每个模块都使用 eval() 执行，并且都有 //@ sourceURL。这是最快的配置，但它不能帮助你找到列信息，也不能很好地处理源代码内容
  - 生成代码通过 eval 执行
  - 无法定位到错误位置，只能定位到某个文件
  - 源代码位置通过 @sourceURL 注明
  - 不用生成 SourceMap 文件，打包速度快
- eval-source-map
  - 生成代码通过 eval 执行
  - 包含 dataUrl 形式的 SourceMap 文件
  - 可以在编译后的代码中定位到错误所在行列信息
  - 生成 dataUrl 形式的 SourceMap，打包速度慢
- source-map
  - 生成了对应的 SourceMap 文件，打包速度慢
  - 在源代码中定位到错误所在行列信息
- cheap-source-map 生成一个不包含列信息的 SourceMap，同时 loader 的 SourceMap 也被简化为只包含对应的行
- inline-source-map 生成完整的 SourceMap，并且将 SourceMap 作为 DataUrl 嵌入到 bundle 中
  - 通过 dataUrl 的形式引入 SourceMap 文件
  - 余下和 source-map 模式一样
- cheap-module-source-map 和 'cheap-source-map' 类似，但是会生成完整的 SourceMap，包括 loader 的 sourcemap
- inline-cheap-source-map
- eval-cheap-module-source-map
  - 生成代码通过 eval 执行
  - 包含 dataUrl 形式的 SourceMap 文件
  - 可以在编译后的代码中定位到错误所在行信息
  - 不需要定位列信息，打包速度较快
  - 在源代码中定位到错误所在行信息
- inline-cheap-module-source-map
- hidden-source-map 生成完整的 SourceMap，但不会在 bundle 中添加引用注释
- nosources-source-map 生成完整的 SourceMap，但不包含源代码内容
  - 能看到错误出现的位置
  - 但是没有办法现实对应的源码

推荐

- 本地开发： eval-cheap-module-source-map
- 生产环境：none

## Webpack性能优化

- 优化 resolve 配置
  - alias 创建 import 或 require 的别名，可以让你更方便地引入模块
  - extensions 自动解析确定的扩展名，使你在引入模块时可以不带扩展名(高频文件后缀名放前面；手动配置后，默认配置会被覆盖; 如果想保留默认配置，可以用 ... 扩展运算符代表默认配置)
  - modules 告诉 webpack 解析模块时应该搜索的目录
  - resolveLoader
- externals
- npParse
- IgnorePlugin
- 多进程配置

```js
module.exports = {
  resolve: {
    modules: [paths.src, 'node_modules'], // webpack 优先 src 目录下查找需要解析的文件，会大大节省查找时间
    extensions: ['.js', '.jsx', '.json'],
    // extensions: ['.ts', '...'],
    alias: {
      '@': paths.src,
      assets: paths.public,
    },
  }
}
```
