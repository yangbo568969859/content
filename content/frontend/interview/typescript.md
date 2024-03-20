# TypeScript

TypeScript 是 Javascript 的一个超集，并且向这个语言添加了可选的静态类型和基于类的面向对象编程

## 基础

- javascript的超集用于解决大型项目的代码复杂性
- 可以在编译期间发现并纠正错误
- 强类型，支持静态和动态类习惯
- 最终被编译为javascript代码，使得浏览器可以理解
- 支持模块、泛型和接口
- 支持ES3、ES5和ES6

## 类型

- Boolean
- Number
- String
- Array
- Enum
- Any 使用 any 类型，就无法使用 TypeScript 提供的大量的保护机制
- Unknown 就像所有类型都可以赋值给 any，所有类型也都可以赋值给 unknown；这使得 unknown 成为 TypeScript 类型系统的另一种顶级类型（另一种是 any）
  - unknown 类型只能被赋值给 any 类型和 unknown 类型本身
  - 只有能够保存任意类型值的容器才能保存 unknown 类型的值
- Tuple
  - 有时我们需要在单个变量中存储不同类型的值，这时候我们就可以使用元组
- Void
- Null 和 Undefined
  - TypeScript 里，undefined 和 null 两者有各自的类型分别为 undefined 和 null
  - tsconfig 配置项 --strictNullChecks开启情况下，null 和 undefined 只能赋值给 void 和它们各自的类型
- Never
  - never 类型表示的是那些永不存在的值的类型
  - never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型

```typescript
// Boolean
let isFirst: boolean = true
// Number
let count: number = 10
// String
let hellomsg: string = "Hello World"
// Array
let myArray: Array<number> = [1, 2, 3]
let myArray2: number[] = [1, 2, 3]
/// Enum
// 数字枚举
enum Direction {
    default,
    horizontal,
    vertical
}
let dir: Direction = Direction.default;
enum Direction2 {
    default = 2,
    horizontal,
    vertical
}
// 字符串枚举
enum Direction3 {
    default = 'default',
    horizontal = 'horizontal',
    vertical = 'vertical'
}
let dir3: Direction3 = Direction3.default; // dir3 = 'default'
// 异构枚举
enum Anisotropy {
    A,
    B,
    C = "C",
    D = "D",
    E = 8,
    F,
}

// Any
let a: any = 10
a = 'hello'
a = false

// Unknown

let value: unknown
value = true
value = 42
value = 'hello'
value = []
value = {}
value = Math.random()
value = new Date()
value = null
value = undefined
value = new TypeError()
value = Symbol('type')

let value1: unknown = value;
let value2: any = value;
let value3: string = value;

// Tuple 元组
let tupleType: [number, string];
tupleType = [1, 'hello'];

// Void
function warnTest(): void {
    console.log('this is a no return function')
}
// Never
function error(message: string): never {
    throw new Error(message);
}
function infiniteLoop(): never {
    while (true) {}
}
// 假如后来有一天修改了 Foo 的类型
// 使用 never 避免出现新增了联合类型没有对应的实现，目的就是写出类型绝对安全的代码
type Foo = string | number | boolean;
function controlAlow(foo: Foo): void {
    if (typeof foo === 'string') {
        
    } else if (typeof foo === 'number') {

    } else if (typeof foo === 'boolean') {

    } else {
        const check: never = foo;
    }
}
```

## 断言

某个变量非常确定类型，通过断言这种方式告诉编译器，这个变量是某个类型；类型断言好比是类型转换

```typescript
// 尖括号语法
let someValue: any = 'hello';
let strLength: number = (<string>someValue).length;
// as语法
let someValue1: any = 'hello';
let strLength1: number = (someValue1 as string).length;
```

## 函数

```typescript
// 函数类型表达式(Function Type Expressions)
function greeter(fn: (name: string) => void) {
    fn('hello');
}
function printToConsole(name: string) {
    console.log(name);
}
greeter(printToConsole);

// 函数类型
let IdGenerator: (chars: string, nums: number) => string;
function createUserID(name: string, id: number): string {
    return name + id;
}
IdGenerator = createUserID;

// 可选参数及默认参数
function createUserID1(name: string, id: number, age?: number): string {
    return name + id;
}
function  createUserID2(name: string = "default", id: number, age?: number): string {
    return name + id;
}

// 剩余参数
function myPush(array: number[], ...items: number[]) {
    items.forEach(item => {
        array.push(item)
    })
}
myPush([1, 2], 1, 2, 3);

// 参数解构
type ABC = {
    a: number,
    b: string,
    c: boolean
}
function DesParams({a, b, c} : ABC) {
    console.log(a, b, c)
}
function DesParams1({a, b, c} : {a: number, b: string, c: boolean}) {
    console.log(a, b, c)
}
DesParams({a: 1, b: '2', c: true});
DesParams1({a: 1, b: '2', c: true});

// 函数重载
function add(a: number, b: number) : number;
function add(a: number, b: string) : string;
function add(a: string | number, b: string | number) {
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}
add(1, 2)
add(1, '2')
```

## 对象类型

### 属性修饰符

- 可选属性(Property Modifuers)
- 只读属性(Readonly Properties)

```typescript
```

属性继承

```typescript
interface BaseAddressInfo {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface ExtendsAddressInfo extends BaseAddressInfo {
  unit: string;
}
```

交叉类型

```typescript
interface ColorFul {
  color: string;
}
interface Circle {
  radius: number;
  color: number; // 交叉之后color类型为never
}

type ColorFulCircle = ColorFul & Circle;
```

## 泛型

## Keyof

TypeScript允许我们遍历某种类型的属性，并通过keyof操作符提取其属性的名称

keyof操作符可以用于获取某种类型的所有键，其返回类型是联合类型

```typescript
// 使用1
interface PersonInfo {
    name: string;
    age: number;
    location: string;
}
type PersonInfoTypes = keyof PersonInfo;
// type PersonInfoTypes = "name" | "age" | "location";

// 使用2
type Point = { x: number; y: number };
type P = keyof Point;
// type  P = "x" | "y";

// 使用3
class PersonClass {
    name: string = "sImss"
}
let sname: keyof PersonClass;
sname = 'name';

// 使用4
type Todo = {
    id: number;
    text: string;
    done: boolean;
}
const todo: Todo = {
    id: 1,
    text: 'Learn TypeScript',
    done: false
}
function props<T extends object, K extends keyof T>(obj: T,key: K) {
    return obj[key];
}
const resid = props(todo, 'id')
const restext = props(todo, 'text')
const resdone = props(todo, 'done')
```

## Typeof

```ts
// typeof
typeof someValue === 'symbol';

const person = {
    name: 'yyy',
    age: 18
}
type Person = typeof person;
// type Person = {
//  name: string;
//  age: string;
// }

function identity<Type>(arg: Type): Type {
    return arg;
}
type result = typeof identity;
// type result = <Type>(arg: Type) => Type

enum UserResponse {
    NO = 0,
    YES = 1
}
type userResult = typeof UserResponse;
const tempa : userResult = {
    YES: 1,
    NO: 0
}
```

## 索引访问类型

## 条件类型

## 映射类型

## 模板字面量类型

## 类

## 模块

## tsconfig.json

```json
{
  "compilerOptions": {
    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}
```