# React

## React 生命周期

新的生命周期不再使用以下三个钩子函数

- componentWillMount
  - 不推荐使用的原因是它的执行时机可能会导致一些问题，具体来说：在 componentWillMount 中触发了异步操作，可能会导致在组件卸载前仍然执行未完成的操作，发生一些潜在错误
- componentWillReceiveProps(nextProps)
  - 容易导致状态不一致的问题，在这个方法中，你可以在组件接收新的 props 之前执行某些操作，但是它不适合进行依赖于 props 的状态更新
- componentWillUpdate(nextProps, nextState)
  - 与 componentWillReceiveProps()类似，这个方法也容易导致状态不一致

因为 ReactFiber Reconciliation 这个过程有可能暂停然后继续执行，所以挂载和更新之前的生命周期钩子就有可能不执行或执行多次

### 旧的生命周期

初始化阶段，由 ReactDOM.render()方法触发初次渲染，会调用以下钩子函数

- constructor
- componentWillMount
- render()
- componentDidMount

更新阶段 由组件内部 this.setState()或父组件重新 render 触发

- shouldComponentUpdate
- componentWillUpdate
- render()
- componentDidUpdate(prevProps,prevState)

卸载阶段 由 ReactDOM.unmountComponentAtNode()方法触发

- componentWillUnmount

### 新的生命周期

初始化阶段

- constructor
  - 构造函数，通常用于初始化组件的状态(state)和绑定方法 (注意：不能在 constructor 中调用 setState，因为第一次 render 还未执行,DOM 节点还未挂载)
- **getDerivedStateFromProps(nextProps, prevState)** 是一个静态方法，用于在组件接收新的 props 时计算并返回新的 state，用来替代不推荐使用的 componentWillReceiveProps
  - 静态方法：getDerivedStateFromProps() 是一个静态方法，因此不能访问实例的 this，它只接收两个参数：nextProps 和 prevState
  - 计算新的 state 通常，你可以在这个方法内部根据 nextProps 和 prevState 来计算并返回新的 state。这个新的 state 将在组件更新时应用
  - 不触发副作用 与 componentDidUpdate() 不同，getDerivedStateFromProps() 不应执行副作用，如发起网络请求。它只用于计算 state
  - 适用于控制组件内部的状态 getDerivedStateFromProps() 主要用于控制组件内部的状态，以确保它与外部传入的 props 保持同步
- render() 是 class 组件中唯一必须实现的方法，用于渲染 dom，必须返回 reactDOM (注意：不要再 render 里面 setState，否则会触发死循环导致内存崩溃)
- componentDidMount() 组件挂载后立即调用，是发送网络请求，启用事件监听方法的好时机，并且可以在此钩子函数里直接调用 setState() 方法

更新阶段

- **getDerivedStateFromProps**
- shouldComponentUpdate
  - 参数：nextProps, nextState(第一个是即将更新的 props 值，第二个是即将跟新后的 state 值)，可以根据更新前后的 props 和 state 老比较加一些限制条件，决定是否更新
  - 不建议在 shouldComponentUpdate() 中进行深层比较或 JSON.stringify()，非常影响效率和性能
  - 不要在 shouldComponentUpdate 中调用 setState，否则会导致无限循环调用更新、渲染，直至浏览器内存崩溃
  - 可以使用内置的 PureComponent 组件替代
- render
- **getSnapshotBeforeUpdate** 它在组件更新之前触发，它允许你捕获组件更新前的一些信息，并在组件更新后使用这些信息
  - 触发时机 getSnapshotBeforeUpdate() 在 render()方法被调用后、组件 DOM 更新前触发，通常用于在更新前捕获一些 DOM 信息
  - 接收两个参数 (prevProps、prevState)，你可以使用这些参数来比较前后的 props 和 state
  - 返回值 方法应该返回一个值（通常是一个对象），它将成为 componentDidUpdate() 方法的第三个参数。这个返回值通常用于保存一些 DOM 相关的信息，比如滚动位置
  - 通常和 componentDidUpdate 一起使用 getSnapshotBeforeUpdate()  结合 componentDidUpdate(prevProps, prevState, snapshot)  使用，snapshot 参数是 getSnapshotBeforeUpdate()  的返回值。你可以在 componentDidUpdate()  中使用 snapshot 来执行 DOM 操作或其他一些操作
- componentDidUpdate(prevProps, prevState, snapshot)
  - 会在更新后会被立即调用。首次渲染不会执行
  - 如果组件实现了  getSnapshotBeforeUpdate 生命周期，第三个是“snapshot” 参数传递

卸载阶段

- componentWillUnmount
  - 这个函数是在组件卸载前执行的，可以在这里做一些清理工作，比如取消订阅、清除定时器、取消异步请求或者移除事件监听

## React 事件原理

## React 组件通讯

- props (父子组件通信)
- Provider,Consumer,Context (跨级组件间通信)
  - Context 在 react 16.x 之前是定义一个全局的对象，类似于 vue 的 eventBus，如果组件要使用到该值直接通过 this.context 获取
- EventEmitter (非嵌套组件间通信)
- onRef
- ref

## React 全局数据

### Redux

Redux 的灵感来源于 Flux 架构和函数式编程原理，状态更新可预测、可跟踪，提倡使用单一存储

单向数据流

- 用户在 view 层触发某个事件，通过 dispatch 发送了 action 和 payload
- action 和 payload 被传入 reducer 函数，返回一个新的 state
- store 拿到 reducer 返回的 state 并做更新，同时通知 view 层进行 re-render

三大原则

- 单一数据源：整个应用的全局 state 被存储在一颗 objectTree 中，并且这个 objectTree 只存在唯一一个 store
- state 是只读的：唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象
- 纯函数修改：通过 reducer 修改状态，reducer 是纯函数，它接收之前的 state 和 action，返回一个新的 state

缺点：

- 学习曲线陡峭
- 大量的模板代码
- 状态量多的情况，性能较差
- reducer 需要返回新的对象，如果更新的值层级较深，更新成本也很高
- 更多的内存占用，由于采用单一数据源，所有状态存储在一个 state 中，当某些状态不在需要使用时，也不会被垃圾回收器释放资源

## React Hooks

### Hooks 解决的问题

- 类组件的不足
  - 状态逻辑复用，在组件之间复用状态逻辑很难，可能要用到 Render Props(渲染属性)或者 Hoc(高阶组件)，但无论是渲染属性还是高阶组件，都会在原先的组件外包裹一层父容器，导致层级冗余
  - 趋向复杂难以维护。在声明周期中混杂不相干的逻辑，如在 componentDidMount 中注册事件以及其它逻辑，在 componentWillUnmount 中卸载事件，这样分散不集中的写法，很容易出 bug
  - this 指向问题，父组件给子组件传递函数时，必须绑定 this

```js
// this 使用方式
// 1. 构造函数中绑定this
// 2. render()中绑定this
// 3. 箭头函数
// 4. 使用类的静态属性：原理和第一种差不多，更简洁
class TestThis extends React.Component {
  handleClick2;
  constructor(props) {
    super(props);
    this.state = {
      num: 1,
      title: "react study"
    };
    this.handleClick2 = this.handleClick1.bind(this);
  }
  handleClick1() {
    this.setState({
      num: this.state.num + 1
    });
  }
  handleClick3 = () => {
    this.setState({
      num: this.state.num + 1
    });
  };

  render() {
    return (
      <div>
        <h2>Hello, {this.state.num}</h2>
        <button onClick={() => this.handleClick1()}>but1</button>
        <button onClick={this.handleClick2}>but2</button>
        <button onClick={this.handleClick1.bind(this)}>but3</button>
        <button onClick={this.handleClick3}>but4</button>
      </div>
    );
  }
}
export default TestThis;
```

- Hooks 的优势

### useState

useState 是 react 自带的一个 hook 函数，他的作用就是用来声明状态变量

- 参数：状态初始值
- 返回: 一个数组，第一个元素是当前状态的值，第二个元素是更新状态的函数
- useState 可以多次调用，相互之间是独立的；react 是根据 useState 的顺序来定的
- react 规定我们必须把 hooks 函数写在最外层，不能写在 ifelse 条件语句中，确保 hooks 的顺序一致

性能

- Hook 内部使用 Object.is 来比较新/旧 state 是否相等
- 与 class 组件中的 setState 方法不同，如果你修改状态的时候，传的状态值没有变化，则不重新渲染
- 与 class 组件中的 setState 方法不同，useState 不会自动合并更新对象。你可以用函数式的 setSatte 结合展开运算符来达到合并更新对象的效果

默认情况下，只要父组件状态变了，不管子组件一部以来该状态，子组件也会重新渲染

- 类组件：使用 PureComponent
- 函数组件：使用 useMemo，将函数组件传递给 mono 之后，就会返回一个新的组件，新组件的功能：如果接收到的属性没发生变化，则不重新渲染函数

```js
import React, { useState } from "react";

function TestUseState() {
  const [count, setCount] = useState(0);
  const [age, setAge] = useState(18);

  return (
    <div>
      <p>{count}</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        计数
      </button>
    </div>
  );
}
```

### useEffect

类似于 componentDidMount 和 componentDidUpdate

我们写的有状态组件，通常会产生很多的副作用(side effect),比如发起 ajax 请求获取数据，添加一些事件监听和取消注册，手动修改 dom 等。我们之前都把这些副作用的函数写在生命周期钩子函数中，比如 componentDidMount，componentDidUpdate；而现在的 useEffect 就相当于这些生命周期的集合体

注意：

- react 首次渲染和之后每次渲染都会调用一边传给 useEffect 的函数，之前的话我们需要声明两个生命周期来表示首次渲染(componentDidMount)和之后的更新导致的重新渲染(componentDidUpdate)
- useEffect 中定义的副作用函数的执行不会阻碍浏览器更新视图，也就是说这些函数是异步执行的；而之前的 componentDidMount 或 componentDidUpdate 中的代码则是同步执行的
- 解绑副作用（清除）：让我们传给 useEffect 的副作用函数返回一个新函数，这个新的函数将会在组件的下一次重新渲染之后执行
- 跳过不必要的副作用函数： useEffect 提供了第二个参数，用来告诉 react 只有当这个参数的值繁盛变化时，我们才执行第一个参数副作用函数

```js
// 使用useEffect
useEffect(() => {
  document.title = `YOU CLICK ${count} times`;
})

// 不使用useEffect
componentDidMount() {
  document.title = `You clicked ${this.state.count} times`;
}

componentDidUpdate() {
  document.title = `You clicked ${this.state.count} times`;
}
```

### useCallback

useCallback: 接收一个内联回调函数参数和一个依赖项数组（子组件依赖父组件状态，即子组件会使用到父组件的值），会返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新

### useMemo

把创建函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算

### useReducer

useReducer 和 redux 中的 reducer 很像；useState 内部就是靠 useReducer 来实现的

useState 的替代方案，它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法

在某些场景下，useReducer 会比 useState 更适合，例如：state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于前一个 state

```js
const initialState = 0;
function reducer(state, action) {
  console.log("state", state);
  switch (action.type) {
    case "increment":
      return {
        ...state,
        number: state.number + 1
      };

    case "decrement":
      return {
        ...state,
        number: state.number - 1
      };
    default:
      throw new Error("unknown action type");
  }
}

function init(initialState) {
  return {
    number: initialState,
    age: 1
  };
}

function Counter7() {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  return (
    <div>
      Count: {state.number}
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </div>
  );
}
export default Counter7;
```

### 自定义的 Effect Hooks

本质是把可以复用的逻辑抽离出来，变成一个个可随意插拔的插销，哪个组件需要，就插进哪个组件中去

```js
function useFirendState(id) {
  const [isOnline, setIsOnline] = useState(null);
  function handleStatusChange(isOnline) {
    setIsOnline(isOnline);
  }

  useEffect(() => {
    // dosometings
    return () => {
      // cleanup 清除事件
    };
  });

  return isOnline;
}

// 使用
function FriendStatus(props) {
  const isOnline = useFirendState(props.friend.id);

  if (isOnline === null) {
    return "Loading...";
  }

  return isOnline ? "Online" : "Offline";
}

function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? "green" : "black" }}>{props.friend.name}</li>
  );
}
```
