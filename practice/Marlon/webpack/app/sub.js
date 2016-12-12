/**
 * Created by Administrator on 2016/12/11.
 */
// 我们这里使用cmmonJS 的风格
function generateText() {
    var element = document.createElement('h2');
    element.innerHTML = "Hellol。 h2 world!";
    return element;
}

module.exports = generateText;