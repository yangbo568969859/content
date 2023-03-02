# 前端包管理器探究

前端接触到的包管理工具有 npm、yarn 以及 pnpm，项目中一般常用 npm 来作为包管理工具，最近有接触到 pnpm，具有安装速度快、节约磁盘控件、安全性好的优点，它的出现是为了解决 npm 和 yarn 存在的问题，然后就研究了一下三者之间的差别

## npm

npm 从 v1 - v3 - v5 版本迭代都有重大变化

### npm v1 依赖嵌套

npm v1 版本中使用了简单的嵌套模式进行依赖管理。比如我们在项目中依赖了 A、C、D 模块，而这三个模块依赖了不同的 B 模块，此时生成的 node_modules 目录如下

```
node_modules
├── A@1.0.0
|     └── node_modules
|            └── B@1.0.0
├── C@1.0.0
|     └── node_modules
|            └── B@2.0.0
├── D@1.0.0
|     └── node_modules
|            └── B@1.0.0
```

项目中引用的包越多，嵌套的层级越深，文件路径过长，大量的重复包被安装，比如上面的 B@1.0.0 就会安装两份

### npm v3 扁平化

npm v3 完成重写依赖安装程序，npm v3 通过扁平化的方式将子依赖所在的目录中，以减少依赖嵌套导致的深层树和冗余，此时的 node_modules 目录如下

```
node_modules
├── A@1.0.0
├── B@1.0.0
├── C@1.0.0
      └── node_modules
            └── B@2.0.0
├── D@1.0.0
```
npm实现了额外的依赖查找算法，核心是递归向上查找node_modules。在安装新包时，会不停的向上级node_modules中查找。如果找到相同版本的包就不会重新安装，在遇到版本冲突时才会在该模块下的node_modules目录下存放该模块的子依赖
v3的变化，虽然避免了嵌套过深和重复安装问题，带来了新的问题：幽灵依赖（Phantom dependency），带来了结构不确定性

幽灵依赖主要是发生在某个包未在package.json中定义，但项目中依然可以引用到的情况

```json
{
  "name": "nuxt-demo",
  "version": "1.0.0",
  "description": "Serverless Nuxt.js Application Created By Serverless Framework",
  "author": "yangbo",
  "private": true,
  "dependencies": {
    "A": "^1.15.1",
    "C": "^2.14.3"
  },
}
```
在js文件中可以直接引用A包，也可以引用B包，因为B是A的依赖项，安装的时候，npm会将依赖B平铺安装在node_modules，因此可以引用它，导致的问题：
- 依赖不兼容
- 依赖缺失

### npm v5 扁平 + lock
v5版本会在下载包时默认生成package-lock.json文件

package-lock.json文件可以帮我们记录每一个包版本和其所依赖的其他包版本，这样在下一次安装的时候就可以通过这个文件来安装。package.json和package-lock.json两者确保得到的node_modules目录结构，保证了安装依赖的确定性
- 一致性
- 兼容性
## yarn
### yarn v1
yarn的出现是为了解决npm v3中存在的一些问题；yarn生成的node_modules目录结构和npm v5是相同的，默认生成一个yarn.lock文件，只不过和package-lock的格式有所不同
#### yarn.lock vs package-lock.json
- 文件格式不同，npm v5使用的是json格式，yarn使用的是自定义格式
- package-lock.json文件里记录的依赖的版本都是确定的，不会出现语义化版本范围符号(~ ^ *)，而yarn.lock文件里仍然会出现语义化版本范围符号
- package-lock.json文件内容更丰富，实现了更密集的锁文件，包括子依赖的提升信息
  - npm v5只需要package.lock文件就可以确认node_modules目录结构
  - yarn.lock无法确定顶层依赖，需要package.json和yarn.lock两个文件才能确定node_modules目录结构
### yarn v2
推出了Plug'n'Play 零安装模式，放弃了node_modules，更加保证以来的可靠性，构建速度也得到了极大提升
## pnpm （performance npm）
pnpm具有安装速度快、节约磁盘空间、安全性好等优点，它的出现也是为了解决npm和yarn存在的问题
### 基本使用
```
npm install -g pnpm

pnpm add vue
pnpm add vue -D
pnpm add -O [package] //保存到optionalDependencies

pnpm update

pnpm remove/uninstall

pnpm dlx // 从源中获取包而不将其安装为依赖项，热加载，并运行它公开的任何默认命令二进制文件。

pnpm link

pnpm store prune // 删除全局不再被引用的包
```
### 特性
- 本地安装包速度快 
- 磁盘空间利用高效
- 安全性高 避免了npm/yarn 非法访问依赖和二重身风险
### 性能提升
#### 硬链接（hard link）节约磁盘空间
硬链接可以理解为源文件的副本，使得用户可以通过不同的路径去找到某个文件，他和源文件大小一样但事实是不占用任何控件。pnpm会在全局store目录里存储项目node_modules文件的硬链接。硬链接可以使得不同的项目可以从全局store寻找到同一个依赖，大大节省了磁盘空间

如果A是B的硬链接，则A的indexNode（指针）与B的indexNode指向的是同一个。删除其中任何一个都不会影响另外一个的访问。作用：允许一个文件拥有多个有效路径，这样用户可以避免勿删
#### 符号链接（symbolic link）创建嵌套结构
pnpm在引用依赖时通过符号链接去找对应磁盘目录（.pnpm）下的依赖地址
类似于桌面快捷方式。比如A是B的软链接（A和B都是文件名），A和B的indexNode不相同，但A中只是存放着B的路径，访问A时，系统会自动找到B，删掉A与B没有影响，相反删掉B，A依然存在，但它的指向是一个无效链接


#### pnpm局限性
- 忽略了package-lock。npm的锁文件旨在反映平铺的node_modules布局，但是pnpm默认创建隔离布局，无法由npm的锁文件格式反映出来，而是使用自身的锁文件pnpm-locl.yaml
- 符号链接兼容性；存在一些场景符号链接不能适用比如electron应用、部署在lambda上的应用无法使用pnpm
- 子依赖提升到统计的目录结构，虽然由于node.js的父目录上溯寻址逻辑，可以实现兼容。但对于类似 Egg、Webpack 的插件加载逻辑，在用到相对路径的地方，需要去适配
- 不同应用的依赖是硬链接到同一份文件，如果在调试时修改了文件，有可能会无意中影响到其他项目
