# React

## React 生命周期

新的生命周期不再使用以下三个钩子函数

- componentWillMount
  - 不推荐使用的原因是它的执行时机可能会导致一些问题，具体来说：在componentWillMount中触发了异步操作，可能会导致在组件卸载前仍然执行未完成的操作，发生一些潜在错误
- componentWillReceiveProps(nextProps)
  - 容易导致状态不一致的问题，在这个方法中，你可以在组件接收新的props之前执行某些操作，但是它不适合进行依赖于props的状态更新
- componentWillUpdate(nextProps, nextState)
  - 与componentWillReceiveProps()类似，这个方法也容易导致状态不一致

因为ReactFiber Reconciliation 这个过程有可能暂停然后继续执行，所以挂载和更新之前的生命周期钩子就有可能不执行或执行多次

### 旧的生命周期

初始化阶段，由ReactDOM.render()方法触发初次渲染，会调用以下钩子函数

- constructor
- componentWillMount
- render()
- componentDidMount

更新阶段 由组件内部this.setState()或父组件重新render触发

- shouldComponentUpdate
- componentWillUpdate
- render()
- componentDidUpdate(prevProps,prevState)

卸载阶段 由ReactDOM.unmountComponentAtNode()方法触发

- componentWillUnmount

### 新的生命周期

初始化阶段

- constructor
  - 构造函数，通常用于初始化组件的状态(state)和绑定方法 (注意：不能在constructor中调用setState，因为第一次render还未执行,DOM节点还未挂载)
- **getDerivedStateFromProps(nextProps, prevState)** 是一个静态方法，用于在组件接收新的props时计算并返回新的state，用来替代不推荐使用的componentWillReceiveProps
  - 静态方法：getDerivedStateFromProps() 是一个静态方法，因此不能访问实例的this，它只接收两个参数：nextProps 和 prevState
  - 计算新的 state 通常，你可以在这个方法内部根据nextProps 和 prevState 来计算并返回新的state。这个新的state将在组件更新时应用
  - 不触发副作用 与 componentDidUpdate() 不同，getDerivedStateFromProps() 不应执行副作用，如发起网络请求。它只用于计算state
  - 适用于控制组件内部的状态 getDerivedStateFromProps() 主要用于控制组件内部的状态，以确保它与外部传入的props保持同步
- render() 是class组件中唯一必须实现的方法，用于渲染dom，必须返回reactDOM (注意：不要再render里面setState，否则会触发死循环导致内存崩溃)
- componentDidMount() 组件挂载后立即调用，是发送网络请求，启用事件监听方法的好时机，并且可以在此钩子函数里直接调用 setState() 方法

更新阶段

- **getDerivedStateFromProps**
- shouldComponentUpdate
  - 参数：nextProps, nextState(第一个是即将更新的 props 值，第二个是即将跟新后的 state 值)，可以根据更新前后的props和state老比较加一些限制条件，决定是否更新
  - 不建议在shouldComponentUpdate() 中进行深层比较或JSON.stringify()，非常影响效率和性能
  - 不要在shouldComponentUpdate中调用setState，否则会导致无限循环调用更新、渲染，直至浏览器内存崩溃
  - 可以使用内置的PureComponent组件替代
- render
- **getSnapshotBeforeUpdate** 它在组件更新之前触发，它允许你捕获组件更新前的一些信息，并在组件更新后使用这些信息
  - 触发时机 getSnapshotBeforeUpdate() 在render()方法被调用后、组件DOM更新前触发，通常用于在更新前捕获一些DOM信息
  - 接收两个参数 (prevProps、prevState)，你可以使用这些参数来比较前后的props和state
  - 返回值 方法应该返回一个值（通常是一个对象），它将成为componentDidUpdate() 方法的第三个参数。这个返回值通常用于保存一些DOM相关的信息，比如滚动位置
  - 通常和componentDidUpdate一起使用 getSnapshotBeforeUpdate() 结合componentDidUpdate(prevProps, prevState, snapshot) 使用，snapshot参数是getSnapshotBeforeUpdate() 的返回值。你可以在componentDidUpdate() 中使用snapshot来执行DOM操作或其他一些操作
- componentDidUpdate(prevProps, prevState, snapshot)
  - 会在更新后会被立即调用。首次渲染不会执行
  - 如果组件实现了 getSnapshotBeforeUpdate 生命周期，第三个是“snapshot” 参数传递

卸载阶段

- componentWillUnmount
  - 这个函数是在组件卸载前执行的，可以在这里做一些清理工作，比如取消订阅、清除定时器、取消异步请求或者移除事件监听

## React 组件通讯

- props
- Provider,Consumer,Context
  - Context 在react 16.x 之前是定义一个全局的对象，类似于vue的eventBus，如果组件要使用到该值直接通过this.context获取
- EventEmitter
- onRef
- ref

## React 全局数据

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
