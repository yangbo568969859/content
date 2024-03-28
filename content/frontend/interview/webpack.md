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

## 配置及参数

### hash

例如 filename: "[name][hash:8][ext]"

- hash：任何一个文件改动，整个项目的构建hash值都会改变
- chunkhash：文件的改动只会影响其所在chunk的hash值
- contenthash：每个文件都有单独的hash，文件的改动只会影响自身的hash值

## Loader

## Plugin

## Webpack性能优化
