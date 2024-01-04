# nrm nvm 使用

## nrm npm源管理器，快速的切换npm源间切换

### nrm命令

- nrm ls 查看可选的源
- nrm use taobao 切换源
- nrm add registry <http://192.168.10.127:8081/repository/npm-public/>  其中reigstry为源名，url为源的路径
- nrm del registry 删除对应的源，reigstry为源名
- nrm test 测试相应源的响应时间

## nvm node管理工具

### nvm命令

- nvm list available 显示所有可以安装的node版本
- nvm install 16.13.1 安装16.13.1版本的node
- nvm list 查看自己安装的node
- nvm use X.X.X 切换到指定的node版本
