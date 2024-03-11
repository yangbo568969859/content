# React

## React Hooks

### Hooks解决的问题

- 类组件的不足
  - 状态逻辑复用，在组件之间复用状态逻辑很难，可能要用到Render Props(渲染属性)或者Hoc(高阶组件)，但无论是渲染属性还是高阶组件，都会在原先的组件外包裹一层父容器，导致层级冗余
  - 趋向复杂难以维护。在声明周期中混杂不相干的逻辑，如在componentDidMount中注册事件以及其它逻辑，在componentWillUnmount中卸载事件，这样分散不集中的写法，很容易出bug
  - this指向问题，父组件给子组件传递函数时，必须绑定this

```js
// this 使用方式

```

- Hooks的优势
