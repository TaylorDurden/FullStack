/**
 * Created by taylor on 11/12/16.
 */
import './main.scss';
import generateText from './sub';
import $ from 'jquery';
import moment from 'moment';

let app = document.createElement('div');
const myPromise = Promise.resolve(42);
myPromise.then((number) => {
    $('body').append('<p>promise result is ' + number + '. Now is ' + moment().format() + '</p>');
});
app.setAttribute('style', 'width:1800px;height:1800px;')
app.innerHTML = '<h1>Hello World App</h1>';
document.body.appendChild(app);
app.appendChild(generateText());
