'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Quiz = require('./Quiz');

Object.defineProperty(exports, 'Quiz', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Quiz).default;
  }
});

var _checkHash = require('./checkHash');

Object.defineProperty(exports, 'checkHash', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_checkHash).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }