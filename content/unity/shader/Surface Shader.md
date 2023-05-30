# Surface Shader

## 表面着色器
表面着色器包含4个函数
- 顶点变换函数
- 表面着色函数
- 光照模型
- 最终颜色修改函数
表面着色器最终会被编译为一个复杂的顶点着色程序

### 定义入口函数
#pragma surface 入口函数名称 光照模型 [Options]
1. surface后面跟表面着色器的入口函数 surf(Input IN, inout SurfaceOutput o);
2. 光照模型 
  - 内置的lambert（漫反射光照） BlinnPhong（高光光照）
  - 自定义光照： 名字为Name
    - half4 Lighting<Name>(SurfaceOutput s, half3 lightDir, half aten);
    - half4 Lighting<Name>(SurfaceOutput s, half3 lightDir, half3 viewDir, half aten);
    - half4 Lighting<Name>(SurfaceOutput s, half4 light);
3. 可选参数 vertex: name 入口函数
  - void<Name>(inout appdata_full v) 只需要改顶点着色器中的输入顶点数据
  - half4<Name>(inout appdata_full v, out Input o) 修改输入顶点数据，以及为表面着色器传递数据
4. 可选参数 finalcolor: name 最终颜色修改函数
  - void<Name>(Input IN, SurfaceOutput o, inout fixed4 color)
5. 其他可选参数
  1: alpha: Alpha 混合模式，用户半透明着色器;
  2: alphatest:varirableName Alpha测试模式，用户透明镂空着色器
  3: exclude path:prepass 使用指定的渲染路径
  4: addshadow: 添加阴影投射器和集合通道;
  5: dualforward:将双重光照贴图用于正向渲染路径中;
  6: fullforwardshadows 在正想渲染路径中支持的所有的阴影类型
  7: decal: add 附加印花着色器:
  8: decal: blend 附加半透明印花着色器:9: softvegetation 使用表面着色器，仅在Soft Vegetation 开启时被渲染;10:noambient 不使用任何光照
  11: novertexlights 在正向渲染中不适用球面调和光照或逐点光照12: nolightmap 在这个着色器上禁用光照贴图:
  13: nodirlightmap 在这个着色器上禁用方向光照贴图
  14: noforwardadd 禁用正向渲染添加通道:
  15: approxview: 对于有需要的着色器，逐顶点而不是逐像素计算规范化视线方向
  16: halfasview: 将半方向传递到光照函数中。

#### 表面入口函数Input IN结构附加数据
Input 必须包含着色器所需要的纹理坐标 uv + 纹理名字；如果使用第二张纹理 uv2 + 纹理名字

附加数据
1. float3 viewDir 试图防线
2. float4 color   每个顶点的颜色插值
3. float4 screenPos 屏幕空间中的位置
4. float3 worldPos 世界坐标空间
5. float3 worldRef1 世界空间中的反射向量
6. float3 worldNormal 世界空间的法线向量
7. float3 worldRef1; INTERNAL_DATA 世界坐标反射向量，但必须表面着色写入o.Normal参数
8. float3 worldNormal; INTERNAL_DATA 世界坐标法线向量，但必须表面着色写入o.Normal参数

#### SurfaceOutput 结构体
SurfaceOutput
1. half3 Albedo 漫反射
2. half3 Normal 法线
3. half3 Emission 自发光
4. half Specular 镜面反射系数
5. half Gloss 关泽系数
6. half Alpha 透明度系数
SurfaceOutputStandard
7. half Smoothness 0-粗糙 1-光滑
8. half Metallic 0-非金属 1-金属

SurfaceOutputStandardSpecular
1. fixed3 Albedo
2. fixed3 Specular
3. fixed3 Normal
4. half3 Emission
5. half Smoothness
6. half Occlusion // 遮挡（默认1）
7. fixed Alpha

