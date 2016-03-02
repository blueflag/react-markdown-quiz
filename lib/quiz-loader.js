"use strict";

var _parseQuiz = require("./parseQuiz");

var _parseQuiz2 = _interopRequireDefault(_parseQuiz);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (source) {
    var value = (0, _parseQuiz2.default)(source);
    return "module.exports = " + JSON.stringify(value, undefined, "\t") + ";";
};