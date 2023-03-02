<template>
  <div class="root">
    <div class="container clearfix">
      <div class="left">left</div>
      <div class="main">main</div>
      <div class="right">right</div>
    </div>

    <div class="position-fixed">
      <div class="position-absoulute"></div>
    </div>

    <div class="square"></div>
    <div class="sector"></div>
    <div class="square2">
      <ul class="square2-inner flex">
        <li>1</li>
        <li>1</li>
        <li>1</li>
      </ul>
    </div>
    <div class="box">
      <div class="middle">hehehe</div>
      <div class="left"></div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
.box {
  overflow: hidden;
  width: 100%;
  > div {
    text-align: center;
    float: left;
    min-height: 300px;
  }
  .middle {
    width: 100%;
    background: chartreuse;
    padding-left: 200px;
  }
  .left {
    width: 200px;
    background: chocolate;
    margin-left: -100%;
  }
  .right {
    width: 200px;
    background: chocolate;
    margin-left: -200px;
  }
}
.square2 {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%; /* padding百分比是相对父元素宽度计算的 */
  margin-bottom: 30px;
}
.square2-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.sector {
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  margin: 100px;
  background-color: red;
  border-radius: 100px 0 0;
}
.position-fixed {
  position: fixed;
  top: 100px;
  left: 100px;
  width: 100px;
  height: 100px;
  background: fuchsia;
  padding: 10px;
}
.position-absoulute {
  width: 90px;
  height: 90px;
  position: absolute;
  top: 0;
  left: 0;
  background: gold;
  z-index: 10;
}
.square {
  width: 100%;
  padding-bottom: 10%;
  height: 0;
  background: red;
}
.triangle {
  width: 30px;
  height: 30px;
  background: red;
  // clip-path: polygon(0px 0px, 0px 30px, 30px 0px);
  transform: rotate(225deg);
}
// .container {
//   display: flex;
// }

// .left {
//   flex-basis: 200px;
//   background: green;
// }
// .main {
//   flex: 1;
//   background: red;
// }
// .right {
//   flex-basis: 200px;
//   background: green;
// }
body,
html {
  padding: 0;
  margin: 0;
}
.left {
  float: left;
  width: 200px;
  background: red;
  overflow: hidden;
}
.right {
  float: right;
  width: 200px;
  background: blue;
}
.main {
  margin: 0 200px;
  background: green;
}
.clearfix::after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
