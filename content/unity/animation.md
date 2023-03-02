### 创建动画片段
- 为物体添加Animation组件
- 在动画视图中创建片段

### 旧版动画API
- bool isPlay = animation.isPlaying;
- bool isPlay = animation.isPlaying("动画名);
- animation.Play("动画名");
- animation.PlayQueued("动画名");
- animation.CrossFade("动画名");
- animation["动画名"].speed = -1;
- animation["动画名"].wrapMode = WrapMode.Pingpong;
- animation["动画名"].length;
- animation["动画名"].time;

### 新版动画

// 当前片段的播放进度[0,1] 0为起点 1为终点
// 判断动画是否播放完
if ((animatorInfo.normalizedTime > 0.99f) && (animatorInfo.IsName("动画片段名")))
