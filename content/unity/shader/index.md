# Shader

## 概述

1. Shader是给GPU执行的程序，着色器
2. 着色器是运行在图形处理单元上，让开发人员直接操作图形硬件渲染功能
3. UV动画，水，雾等特效，用着色器开发出来性能和效果好
4. 渲染流水线，模型投影，定点着色
5. shader一般有：固定管线着色器，顶点片元着色器， 表面着色器

## GPU管道流水线

顶点初始化 - 顶点shader - Tellellation曲面化 - 几何shader - 裁剪、投影 - 三角形遍历 - 片元着色shader - 输出

## 分类

1. HLSL语言，通过Direct3D编写的着色器程序，只能在Direct3D里面使用
2. Cg语言 NVIDIA和微软合作的语言，Direct3D和Opengl都支持
3. GLSL语言。支持OpenGL上编写Shader程序

unity使用shaderlab来进行着色程序的编写，对不同平台进行编译，重点支持Cg语言；

## 语法基础

Shader "name" { // shader的名字
  [Properties] // 定义一些属性，定义在这里的属性都会在属性查看器里面显示
  Subshaders: {...} // 子着色器列表，一个shader必须有一个子着色器
  [Fallback] // 如果子着色器显卡都不支持，降级处理即Fallback操作
}

### Properties

1. name{"display name", type} = value;
name 指的是属性的名字
display name 是在属性检查器的名字
type 这个属性的类型
value 这个属性的默认值
2. 类型
Float，Int，Color(num, num, num, num), Vector(4维向量)，Range(start, end)
2D: 2D纹理属性
Rect： 矩形纹理属性
Cube：立方体纹理属性
3D：3D纹理属性
例如： name{"display name", 2D} = "name" {options}
3. Options: 纹理属性选项
TextGen：纹理生成模式，纹理自动生成纹理坐标的模式，顶点shader会忽略这个选项
ObjectLinear，EyeLinear，SphereMap，CubeReflect CubeNormal
LightmapMod：光照贴图模式，如果设置这个选项，纹理会被渲染器的光线贴图影响
举例：_Range("range value", Range(0, 1)) = 0.3;
_Color("color", Color) = (1, 1, 1, 1);
_MainTex("Albedo", Cube) = "skybox" {TextGen CubeReflect}; // 定义一个立方体贴图纹理属性

### SubShader

1. Subshader{[Tags], [CommonState], Pass{} } 由标签Tags、通用状态、通道泪飙组成
2. Subshader渲染的时候，将优先渲染一个被每个通道所定义的对象
3. 通道的类型： RegularPass，UsePass，GrabPass
4. 在通道中定义状态同时对整个子着色器可见，那么所有的通道可以共享状态

SubShader {
    Tags {"Queue", "Transparent"}
    Pass {
        Lighting Off // 关闭光照
        ...
    }
}

#### Tags

标签类型

- Queue 队列标签
- RenderType 渲染类型
- DisableBatching 禁用批处理
- ForceNoShadowCasting 强制不投阴影
- IgnoreProjecttor 忽略投影
- CanUseSpriteAtlas 使用精灵图集
- PreviewType  预览类型

#### Pass通道

基础语法
Pass {[Name and Tags] [RenderSetup] [Texture Setup]}

##### RegularPass

- Lighting 光照
- Material（材质块） 定义一个使用定点光照管线的材质
- ColorMaterial 颜色集 计算定点光照时使用顶点颜色
- SeparateSpecular 开光状态 开启或关闭顶点光照相关的镜面高光颜色 On/Off
- Color 设置定点关照关闭时所使用的颜色
- Fog 雾
- AlphaTest Alpha测试
- ZTest 深度测试模式
- ZWrite 深度写模式
- Blend 混合模式 SourceBlendMode DestBlendMode AlphaSourcesBlendMode AlphaDstBlendMode
- ColorMask 颜色遮罩 设置颜色遮罩，颜色值可以由RGB或A或0或R,G,B,A的组合，设置0关闭所有的颜色通道渲染
- Offset 偏移因子，设置深度偏移

##### 特殊通道

- UsePass 插入所有来自其他着色器的给定名字的通道； UsePass "Shader/Name"; UsePass "Specular/BASE" 插入Specular中为BASE的通道
- GrabPass 一种特殊的通道，捕获物体所在的位置的屏幕的内容，并写入一个纹理中，这个纹理能被用于后续通道中完成一些高级图像特效，后续通道可以使用 _GrabTexture进行访问

#### Fallback 降级

定义在所有着色器之后，如果没有任何子着色器能运行，则降级
Fallback "NAME"
Fallback Off;

### 基本类型表达式

- 浮点类型 float half double
- 整数类型 int
- 定点数 fixed来高效处理小数
- bool 逻辑类型
- sampler* 纹理对象句柄 sampler/1D/2D/3D/CUBE/RECT
- 内置向量数据类型 float4
- 内置矩阵数据类型 float1×1 float2×3 float4×3 float4×4
- 数组类型 float a[10]
- 语义绑定 float4 a : POSITION

#### 结构体

struct name {}

### 标准内置函数

- abs(num) 绝对值
- 三角函数
- cross(a, b) 两个向量求叉积
- determinant(M) 矩阵得行列式
- dot(a, b) 点积
- floor 向下取整
- lerp(a, b, f) 线性插值
- log2 基于2为底的x的对数
- mul(m, n) 矩阵×矩阵 矩阵×向量
- power(x, y) x的y次方
- radians(x) 角度转弧度
- reflect(v, n) v关于法线n的反射向量
- round(x) 靠近取整
- tex2D(smaple, x) 二维纹理查找
- tex3Dproj(sample, x) 投影三维纹理查找
- texCUBE 立方体贴图纹理查找

### Unity自带函数

1. #include "UnityCG.cginc"
2. TRANSFORM_TEX：根据定点的纹理坐标，计算出对应的纹理的真正的UV坐标
3. 使用属性的变量：在shader里面需要使用属性变量还需要在shader中定义一下这个变量的类型和名字，名字要保持一致
4. 外部修改shader的编辑器上的参数值
