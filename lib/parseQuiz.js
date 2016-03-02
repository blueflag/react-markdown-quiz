'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (str) {
    var quiz = _yamlFrontMatter2.default.loadFront(str);
    return (0, _immutable.fromJS)(_markdown.markdown.parse(quiz.__content)).skip(1).reduce(function (reduction, value, key, iterable) {
        switch (value.get(0)) {
            case 'header':
                return reduction
                // Create an object for each header
                .update(function (vv) {
                    return vv.push((0, _immutable.fromJS)({
                        title: renderHTML(value.toJS()),
                        answers: [],
                        markdown: []
                    }));
                }).updateIn([reduction.size, 'markdown'], (0, _immutable.List)(), function (vv) {
                    return vv.push(value);
                });

            case 'numberlist':
                var currentQuestion = reduction.size - 1;
                var answers = value.skip(1).map(function (qq) {
                    return renderHTML(qq.toJS());
                });

                var randomAnswers = answers.reduce(function (rr, ii) {
                    return rr.splice(Math.floor(Math.random() * rr.size), 0, ii);
                }, (0, _immutable.List)());

                return reduction.updateIn([currentQuestion, 'markdown'], function (vv) {
                    return vv.push('{{ANSWERS}}');
                }).setIn([currentQuestion, 'hash'], (0, _checkHash2.default)(answers.get(0))).setIn([currentQuestion, 'answers'], randomAnswers);

            default:
                return reduction.updateIn([reduction.size - 1, 'markdown'], function (vv) {
                    return vv.push(value);
                });

        }
    }, initialState).map(function (question) {
        var markdownTree = question.get('markdown').toJS();
        return question.set('html', renderHTML(markdownTree));
    }).toJS();
};

var _immutable = require('immutable');

var _markdown = require('markdown');

var _yamlFrontMatter = require('yaml-front-matter');

var _yamlFrontMatter2 = _interopRequireDefault(_yamlFrontMatter);

var _checkHash = require('./checkHash.js');

var _checkHash2 = _interopRequireDefault(_checkHash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = (0, _immutable.fromJS)([]);

function renderHTML(tree) {
    return _markdown.markdown.renderJsonML(_markdown.markdown.toHTMLTree(tree));
}