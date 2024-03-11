# 基础八股文

## for...in 和 for...of 和 foreach 区别

for...in 遍历对象属性，顺序不确定，取决于js引擎实现（无法直接遍历数组），遍历的是对象的属性名(键)，（使用该循环时，需要使用hasOwnProperty方法过滤原型链上的属性，以确保只遍历对象本身的属性）
for...of 遍历可迭代对象(数组，字符串，Map，Set)元素时，按照元素在数组中的顺序进行遍历，遍历的是元素值
foreach 只能用于遍历数组，不能用于遍历对象，遍历的是元素值

## Performance指标

## window.onload 和 DOMContentLoaded 区别

DOMContentLoaded 是在HTML文档被完全加载和解析之后才会触发的事件，并不需要等到(样式表，图像，子框架)加载完成之后再进行
load事件，用于检测一个加载完全的页面，当一个资源及其依赖的资源已完成加载时，将会触发load事件

### DOMContentLoaded

## async 和 defer

async 和 defer 属性只对外部脚本起作用，如果没有 src 属性它们会被忽略

async： 指外部js文件和当前html页面同时加载（异步加载），在当前js文件加载完成后，执行js代码
defer： 指外部js文件和当前html页面同时加载（异步加载），但只在当前页面解析完成之后执行js代码

异步加载：指同时加载，即某个js文件加载的同时，其余文件也可以加载
同步加载：指某个js文件加载的同时，其余文件不能加载

defer比async要先引入，他的执行在解析完全完成之后才能开始，它处在DOMContentLoaded事件之前。它保证脚本会按照它在html中出现的顺序执行，并且不会阻塞解析
async 脚本在他们完成下载后的第一时间执行，它处在weidow的load事件之前，这意味着可能设置了async的脚本不会按照它在html中出现的舒徐执行
