/**
 * Created by taylor on 11/12/16.
 */
//我们这里使用CommonJS的风格
export default function() {
    var element = document.createElement('h2');
    element.innerHTML = "Hello h2 world";
    return element;
}
