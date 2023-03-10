## 图集

#### 图片精灵打包
- 做界面时使用的小图，在项目发布时引擎会根据精灵Packing Tag自动将小图合并在一张大图集里，从而减少Draw Calls，减少GPU渲染物体次数
- 设置打包方式 Edit --> Project Settings --> Editor --> Sprite Packer 
  - Disabled 禁用
  - Enabled For Builds 表示打包时启用
  - Always Enabled 表示永远启用
- 打包策略
  - 图片类型相同，属于同一个界面的，设置相同的Package Tag
  - 一张图片在多个界面使用，尽量不打包成精灵
#### 图集
- 尽量将需要在同一个界面显示的小图做到一张大图中
- 在Unity中切割精灵
  - 选中图集，在Inspector面板中奖Sprite Mode设置为Multiple
  - 编辑精灵 Sprite Editor
- 制作流程
#### Draw Call与Batches概念
- [Unity 渲染流水线：CPU与GPU合作创造的艺术](https://blog.csdn.net/xinzhilinger/article/details/115371447?spm=1001.2014.3001.5501)
- 关于Batches（批处理），即使你不了解，通过名字也可以理解，这是一种通过成批来处理的技术，总的来说，这个数值越小，对于硬件设备性能越友好
#### SpriteAtlas

#### 打包图集思路
- 设计UI时要考虑重用性，如一些边框、按钮等，这些作为共享资源，放在1~3张大图集中，称为重用图集
- 其它非重用UI按照功能模块进行划分，每个模块使用1~2张图集，为功能图集
- 对于一些UI，如果同时用到功能图集与重用图集，但是其功能图集剩下的“空位”较多，则可以考虑将用到的重用图集中的元素单独拎出来，合入功能图集中，从而做到让UI只依赖于功能图集。也就是通过一定的冗余，来达到性能的提升
- 有了层级号之后，就要合并批次了，此时，Unity会将每一层的所有元素进行一个排序（按照材质、纹理等信息），合并掉可以Batch的元素成为一个批次，目前已知的排序规则是，Text组件会排在Image组件之前渲染，而同一类组件的情况下排序规则未知（好像并没什么规则）。经过以上排序，就可以得到一个有序的批次序列了。这时，Unity会再做一个优化，即如果相邻间的两个批次正好可以Batch的话就会进行Batch。
- 举个栗子，一个层级为0的ImageA，一个层级为1的ImageB（2个Image可Batch）和一个层级为0的TextC，Unity排序后的批次为TextC->ImageA->ImageB，后两个批次可以合并，所以是2个Drawcall
- 再举个栗子，一个层级为0的TextD，一个层级为1的TextE（2个Text可Batch）和一个层级为0的ImageF，Unity排序后的批次为TextD->ImageF->TextE，这时就需要3个Drawcall了！（是不是有点晕，再回顾下黑体字）
- 少用Mask
  - Mask对于uGUI性能来说是噩梦一般的存在，因为很可能因为这个东西，导致Drawcall数量成倍增长。
  - Mask实现的具体原理是一个Drawcall来创建Stencil
  - mask(来做像素剔除)，然后画所有子UI，再在最后一个Drawcall移掉Stencil mask。
  - 这头尾两个Drawcall无法跟其他UI操作进行Batch，所以表面上看加个Mask就会多2个Drawcall，但是，因为Mask这种类似“汉堡包式”的渲染顺序，所有Mask的子节点与其他UI其实已经处在两个世界了，上面提到的层级合并规则只能分别作用于这两个世界了，所以很多原本可以合并的UI就无法合并了。

#### 在使用UGUI时，有一些建议：
- 应该尽量避免使用Mask，其实Mask的功能有些时候可以变通实现，比如设计一个边框，让这个边框叠在最上面，底下的UI移动时，就会被这个边框遮住；
- 如果要使用Mask时，需要评估下Mask会带来的性能损耗，并尽量将其降到最低。比如Mask内的UI是动态生成的话（比如List组件），那么需要注意UI之间是否有重叠的现象。

#### 总结
UGUI的性能其实涉及到的方面很多，这里列出来的只是目前能想到的，因为个人能力有限，可能出些纰漏。对于文中的一些建议，这里整理一下得出一些最佳实践
- 设计UI时要考虑重用性，如一些边框、按钮等，这些作为共享资源，放在1~3张大图集中，称为重用图集
- 其它非重用UI按照功能模块进行划分，每个模块使用1~2张图集，为功能图集；
- 对于一些UI，如果同时用到功能图集与重用图集，但是其功能图集剩下的“空位”较多，则可以考虑将用到的重用图集中的元素单独拎出来，合入功能图集中，从而做到让UI只依赖于功能图集。也就是通过一定的冗余，来达到性能的提升。
- 有相同材质和纹理的UI元素是可以Batch的，可以Batch的UI上下叠在一块不会影响性能，但是如果不能Batch的UI元素叠在一块，就会增加Drawcall开销。
- 要注意UI元素间的层叠关系，建议用“T”工具查看其矩形大小，因为有些图片透明，但是却叠在其它UI上面了，然后又无法Batch的话，就会无故多许多Drawcall；
- UI中出现最多的就是Image与Text组件，当Text叠在Image上面（如Button)，然后Text上又叠了一个图片时，就会至少多2个Drawcall，可以考虑将字体直接印在下面的图片上；
- 有些情况可以考虑人为增加层级从而减少Drawcall，比如一个Text的层级为0，另一个可Batch的Text叠在一个图片A上，层级为1，那此时2个Text因为层级不同会安排2个Drawcall，但如果在第一个Text下放一个透明的图片（与图片A可Batch），那两个Text的层级就一致了，Drawcall就可以减少一个。
- 应该尽量避免使用Mask，其实Mask的功能有些时候可以变通实现，比如设计一个边框，让这个边框叠在最上面，底下的UI移动时，就会被这个边框遮住；
- 如果要使用Mask时，需要评估下Mask会带来的性能损耗，并尽量将其降到最低。比如Mask内的UI是动态生成的话（像List组件），那么需要注意生成的UI之间是否有重叠的现象；

[参考](https://blog.csdn.net/weixin_38531633/article/details/104433999)
