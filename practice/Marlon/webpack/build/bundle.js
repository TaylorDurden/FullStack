/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	(function webpackMissingModule() { throw new Error("Cannot find module \".bundle\""); }());


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/12/11.
	 * touch .gitignore   命令生成.gitignore 文件  不要让git提交一些node依赖的模块
	 */
	//require('./main.scss');
	__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./main.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var sub = __webpack_require__(2);
	var app = document.createElement('div');
	app.innerHTML = "<h1>Hello1 Worlwd!</h1>";
	app.appendChild(sub());
	document.body.appendChild(app);

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ }
/******/ ]);