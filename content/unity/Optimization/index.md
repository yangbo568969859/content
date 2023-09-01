# 优化理论篇

## Culling/Simplization/Batching

### Culling 剔除

从广义上讲

- 看不见的像素，网格和对象
- 重复的，用不到的资源
- 不需要，不执行的代码

从狭义上讲

- 像素剔除： 摄像机平截头体剔除，Back-face Culling，Early-Z，Pre-Z Pass
- 网格剔除： Layer Mask， 可见距离剔除， Occlusion
- 灯光剔除： Tile-Based Deferred Rendering， Forward+
- 场景剔除： Additive Scene

### Simplization 简化

从广义上讲

- 运行效率较重的资源
- 低效，不合适的资源

unity中有的简化手段

- Quality Settings
- 通过烘焙光照简化实时光照
- 通过BoundingBox或替代碰撞代替Mesh碰撞
- 通过Local Volume代替Global Volume
- RayCast 代替 SphereCast、CapsuleCast
- 纹理文字代替系统文字
- Mesh LOD
- Shader LOD
- [HOLD](https://github.com/Unity-Technologies/HLODSystem)
- 通过Camer override代替URP管线中的一些通用设置
- 通过OnDemand更新或分级设置接口

用户扩展简化

- 场景简化数据结构
- 第三方LOD方案
- Mesh Impostor
- Animation LOD
- 2D寻路代替Navigation Mesh
- 扩展类似OnDemand接口

### Batching 合批

从广义上讲

- 资源Batching(Mesh, Texture, Shader参数,材质属性)
- Draw call Batching(Static Batching, Dynamic Batching)
- GPU Instancing(直接渲染，间接渲染，程序化简接渲染)
- Set Pass call Batching(SRP Batching)

#### 资源Batching

- Mesh
  - Mesh.CombineMesh 合并静态网格对象
  - Submeshes -> Single Mesh 合并材质和贴图，不同材质通过通道图标记
- Texture
  - AltasTextue 通过纹理坐标映射多张贴图
  - TxtureArray 纹理数组
- Shader变量与材质属性
  - Material Property Block（Build In管线）
  - Const buffer（SRP管线）

#### Draw call Batching

- Static Batching
- Dynamic Batching

#### GPU Instancing

- DrawMeshInstanced
- DrawMeshInstancedIndirect
- DrawMeshInstancedProcedural

#### Set Pass call Batching

- SRP Batcher
- Const Buffer
  - UnityPerCamera
  - UnityPerFrame
  - UnityPerPass
  - UnityPerDraw
  - UnityPerDrawRare
  - <font color=Red>UnityPerMaterial</font>

#### 资源优化顺序

资源Batching > SRP Batching = Static Batching > GPU Instancing > Dynamic Batching

#### Bacthing的使用限制

- Static Batching 限制
  - 额外内存开销
  - 64000个顶点限制
  - 影响Culling剔除

- Dynamic Batching 限制
  - 合批不超过900个顶点属性（注意不是900个顶点）
  - 除了渲染阴影对象外，相同材质，不同材质实例也不能合并
  - 具有光照贴图的游戏对象如果有附加渲染器参数时，如果需要动态合批这些对象，他们必须指向相同的光照贴图位置
  - 有多shader pass的游戏对象无法做动态合批
  - 受多个光照影响的游戏对象，满足动态合批条件合批后，只会受一个光源的影响
  - 延迟渲染下不支持动态合批
  - CPU开销可能会增大，需要测试开启使用

- GPU Instancing限制
  - 图形API版本要求
  - 与SRPBatcher不兼容
  - 不同绘制API的参数和绘制个数不同
  - 渲染顶点数较少的网格时，效率可能会很差

- SRP Batching 限制
  - 图形API版本要求
  - 必须是SRP渲染管线
  - 粒子对象不能合批
  - 使用MaterialPropertyBlocks的游戏对象不能合批
  - Shader必须时compatible的

#### 合批失败原因汇总

- An object is affected by multiple forward lights
- Objects have different materials
- An object is using a multi-pass shader
- An object has odd negative scaling 此物体Transform的Scale使用了负数
- Either object have different Receive Shadows settings, or some objects are within the shadow distance, while some other objects are not 此物体接收阴影的设置不同，或者物体有不同的阴影距离设置
- Objects are affected by different forward lights
- Objects are different lighting layers
- Objects have different Cast Shadows settings
- Object either have different shadow caster shaders, or have different shader properties or keywords that affect the output of the shadow caster pass 此物体有不同的投影设置或者有不同的着色器属性或者关键字影响Shadow Caster pass 的输出
- The Shader ecplicity disbales batching with the DisableBatching tag 着色器中显示设置了DisabledBatching的标记
- Objects have different MaterialPropertyBlock set
- Non-instanced properties set for instanced shader
- Objects are lightmapped 物体使用了不同的LightMap或者虽然使用相同的LightMap但使用的UV不同
- Obiects are affected by different light probes.
- Objects are shadowed by baked occlusions and have different occlusion factors
- Obiects are affected by different reflection probes
- Rendering different meshes or submeshes with GPU instancing 使用GPU实例化渲染不同的网格或子网格
- Objects have different batching-static settings
- Obiects belong to different static batches
- Dynamic Batching is turned off in the Player Settings or is disabled temporarily in the current context toavoid z-fighting. 在Player Settings中关闭了动态合批，或者在当前的环境中为了避免深度冲突而临时关闭了合批
- There are too many indices (more than 32k) in a dynamic batch. 动态合批中有太多的索引(大于32k )
- “A mesh renderer has additional vertex streams. Dynamic batching doesn 'tsupportsuchmesh renderers/  Mesh Renderer具有其他顶点流。动态批处理不支持此类网格渲染器
- A submesh we are trying to dynamic-batch has more than 300 vertices 动态合批超过300个顶点
- A submesh we are trying to dynamic-batch has more than 900 vertex attributes 动态合批超过900个顶点属性
- This is the first draw call of a new shadow cascade 新阴影级联的第一次绘制调用
- The material doesn 't have GPUinstancing enabled 材质未启用GPUInstancing功能
- Objects are rendered using different rendering functions. This can happen if the type of renderer is different (eg Mesh/Skinned Mesh) or when using different settings within the same renderersuchas SpriteMasking 使用不同的渲染。如果渲染器的类型不同(例如网格/蒙皮网格)，或者在同一染器中使用不同的设置(例如精灵遮罩)，则可能会发生这种情况
- Objects have different batching keys. This is usually caused by using different vertex streams on Particle Svstems,or by mixing Lines and Trails, or by mixing lit and unit aeometry "此对象具有不同的Batching Keys 这通常是由于在粒子系统上使用不同的顶点流，或混合线和轨迹，或混合Lit和Unlit的几何体造成的。
- Meshuses32 bitindex buffer Mesh使用了32位的索引缓冲
- Submeshhas non-zero base vertex  子网格对象有非0的基础顶点，submesh.BaseVertexLocation != 0
- The previous instanced draw call has reached its maximum instance count 先前的InstanceDrawCall已经达到了Instance的最大数量
- Motion Vector rendering doesn't support batching    Motion Vector的渲染不支持Batching
- When using late latching, children of an XR late latched GameObject do not usebatching. 使用latelatching时，XR latelatched GameObiect的子级不能合批
- Objects have different bounds and bounds instancing is disabled 对象具有不同的包裹体，那么包裹体实例化被禁用
- SRP
- SRP:Node have different shaders.  节点具有不同的着色器
- SRP:Node use multi-pass shader 节点使用了多Pass着色器
- SRP:Node use different shader keywords 节点使用了不同的着色器关键字
- SRP:End of the batch flush Batch Flush结束
- SRP:Node is not compatible with SRP batcher 节点与SRP Batcher不兼容
- SRP:Node material requires device state change 节点材质需要改变渲染设备状态
- SRP:First call from ScriptableRenderLoopJob ScriptableRenderLoopJob第一次调用
- SRP.This material has custom buffer override 材质有自定义重写的Buffer
