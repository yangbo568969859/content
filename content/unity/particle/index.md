# Particle System 粒子系统

## 说明

用于模拟一些流动的，没有形状的物质；如：液体，烟雾，火焰，爆炸，魔法效果等

## 模块

- 一个主模块 Main Module （基础参数）
- 22个子模块（扩展参数） 默认启用了 Emission/Shape/Renderer 三个模块

### 主模块

- Start Color 颜色(可设置两个值，表示两个值之间取值)
- Start Speed 速度
- Start Size 大小
- Duration 周期 粒子系统工作时长
- Lopping 循环
- Prewarm 预热 是否先内部预热一个周期
- Start Lifetime 粒子的生命时长(存在时间)，默认5s
- Simulation Space 模拟空间
  - Local 本地空间（以粒子发生器为中心 火焰的尾巴）
  - World 世界空间（使用世界坐标系 泡泡枪）
- Max Particles 一个粒子系统最多多少个粒子（默认1000）

### 子模块

#### Emission 发射的频率

- 匀速发射
  - Rate over Time 时间匀速 以1s时间，发射N个粒子
  - Rate over Distance 距离匀速 每前进1m，发射N个粒子，针对运动的物体
- 爆发式发射
  - Bursts
    - Time 爆发发生的时间
    - Count 爆出多少个粒子
    - Cycles/Interval 爆炸次数、间隔
    - Probability 爆炸可能的概率，0表示不会爆炸

#### Shape 粒子发生器的形状

#### Renderer 粒子的显示

- Render Mode
  - Billboard 由粒子系统控制的小纸片，总是面向摄像机
  - Stretched Billboard 拉伸
  - Horizontal Billboard
  - Vertical Billboard
  - Mesh
  - None

#### Custom Data 模块

#### Velocity Over Lifetime

#### Limit Velocity Over Lifetime

#### Force Over Lifetime

#### Color Over Lifetime

#### Size Over Lifetime

#### Rotation Over Lifetime

#### Noise 噪声

#### Texture Sheet Animation

- Mode
  - Grid 将粒子材质分割成多张图片控制播放，比如下面示例的纹理图，通过Tiles属性控制XY轴方向分别切割几份
  - Sprites 将渐变效果的纹理图转为精灵图并分割成多份，然后添加到当前模块，粒子系统便会根据这些精灵图来控制播放动画效果

#### Light Trails

#### Force Filed & External Forces

## 参考文章

[详解Unity中的粒子系统Particle System](https://blog.csdn.net/weixin_43147385/article/details/127146742?spm=1001.2014.3001.5502)
