"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _parseQuiz = require("./parseQuiz");

var _parseQuiz2 = _interopRequireDefault(_parseQuiz);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (source) {
    var value = (0, _parseQuiz2.default)(source);
    return "module.exports = " + (0, _stringify2.default)(value, undefined, "\t") + ";";
};