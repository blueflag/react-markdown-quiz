'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _checkHash = require('./checkHash');

var _checkHash2 = _interopRequireDefault(_checkHash);

var _pipwerksScormApiWrapper = require('pipwerks-scorm-api-wrapper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Quiz = _react2.default.createClass({
    displayName: 'Quiz',
    render: function render() {
        return _react2.default.createElement(
            'div',
            null,
            this.props.quiz.map(this.renderQuestion)
        );
    },
    getInitialState: function getInitialState() {
        return {
            answers: (0, _immutable.fromJS)(this.props.quiz).map(function (question) {
                return (0, _immutable.Map)({
                    title: question.get('title'),
                    hash: question.get('hash'),
                    answer: null,
                    correct: false
                });
            })
        };
    },
    onChange: function onChange(value, index) {
        this.setState({
            answers: this.state.answers.setIn([index, 'answer'], value).setIn([index, 'correct'], this.state.answers.getIn([index, 'hash']) === (0, _checkHash2.default)(value))
        }, this.onUpdateParent);
    },
    onUpdateParent: function onUpdateParent() {
        if (this.props.onChange) {
            this.props.onChange(this.state.answers.toJS());
        }
    },
    renderAnswers: function renderAnswers(answers, questionNumber) {
        var _this = this;

        return answers.map(function (aa, key) {
            return _react2.default.createElement(
                'label',
                { key: key, style: { display: 'block' } },
                _react2.default.createElement('input', { name: questionNumber, type: 'radio', value: key, onChange: _this.onChange.bind(_this, aa, questionNumber) }),
                _react2.default.createElement('span', { dangerouslySetInnerHTML: { __html: aa } })
            );
        });
    },
    renderQuestion: function renderQuestion(question, key) {
        var _question$html$split = question.html.split('{{ANSWERS}}');

        var _question$html$split2 = _slicedToArray(_question$html$split, 2);

        var before = _question$html$split2[0];
        var after = _question$html$split2[1];


        return _react2.default.createElement(
            'div',
            { key: key },
            _react2.default.createElement(
                'h2',
                null,
                key + 1,
                '. ',
                _react2.default.createElement('span', { dangerouslySetInnerHTML: { __html: question.title } })
            ),
            _react2.default.createElement('div', { className: 'Markdown', dangerouslySetInnerHTML: { __html: before } }),
            this.renderAnswers(question.answers, key),
            _react2.default.createElement('div', { className: 'Markdown', dangerouslySetInnerHTML: { __html: after } }),
            _react2.default.createElement('hr', null)
        );
    }
});

exports.default = Quiz;