### Only textures with width/height being multiple of 4 can be compressed to DXT5 format
错误其实很简单：“纹理的长宽都是4的倍数，才能被压缩成DXT5 格式”。看着这个提示，想到了unity的一次大会上，说纹理贴图推荐大小是256、512、1024等。当然，只要是4的倍数就行

核心关键词：压缩的DXT5格式，使用较少的内存。

在DirectX中，使用一种叫做DXT的纹理压缩技术，目前这种技术被大部分显卡所支持。 DXT是一种DirectDraw表面，它以压缩形式存储图形数据，该表面可以节省大量的系统带宽和内存。即使不直接使用DXT表面渲染，也可以通过 DXT格式创建纹理的方法节省磁盘空间

#### DXT4、DXT5 
&ensp;&ensp;DXT4、DXT5也是用于表示具有复杂的透明信息的贴图，与2和3不同的是4和5的Alpha信息是通过线性插值计算所得，类似于DXT1的颜色信息。同样的，每4×4的像素块的透明信息占用64位，所不同的是，64位中采用了2个8位的alpha值和16个3位的索引值，既然每个像素的索引占3位，那么可以表示8种不同的透明状态。 
&ensp;&ensp;在这里插值的方法有两种，一种用于表示具有完全透明和完全不透明的状态，另一种则是仅在给出的极端值alpha_0和alpha_1中进行插值。区分的方法也是通过比较alpha_0和alpha_1的大小来实现的，如果alpha_0大于alpha_1，则通过插值计算剩下的6个中间alpha值；否则，只通过插值计算4个中间alpha值，alpha_6直接赋值0，alpha_7直接赋值255。 
&ensp;&ensp;DXT4和DXT5的区别同DXT2和DXT3的区别相同，DXT4的颜色值是理解为已经完成Premultiplied by alpha操作的。 
&ensp;&ensp;另外需要注意的是，所有的压缩纹理格式都是2的幂，因为纹理压缩的单位是4×4像素，所以如果贴图的大小位16×2或者8×1这样的比例，系统会同样采用4×4的单位进行压缩，会造成一定的空间浪费，同样的大小会被占用，只是不会参与使用而已。
