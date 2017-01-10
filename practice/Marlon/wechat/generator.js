/**
 * Created by Marlon on 2017/1/10.
 * generator 生成器
 */
var gen = function *(n) {
    for (var i = 0; i < 3; i++) {
        n++;

        yield n;
    }
};

var genObj = gen(2);
console.log(genObj.next());
console.log(genObj.next());
console.log(genObj.next());
console.log(genObj.next());