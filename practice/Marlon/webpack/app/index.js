/**
 * Created by Administrator on 2016/12/11.
 * touch .gitignore   命令生成.gitignore 文件  不要让git提交一些node依赖的模块
 */
var sub = require('./sub');
var app = document.createElement('div');
app.innerHTML = "<h1>Hello1 Worlwd!</h1>";
app.appendChild(sub());
document.body.appendChild(app);