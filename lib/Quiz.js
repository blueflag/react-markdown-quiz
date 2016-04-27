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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Quiz = _react2.default.createClass({
    displayName: 'Quiz',
    getDefaultProps: function getDefaultProps() {
        return {
            classPrefix: "Quiz",
            className: '',
            renderQuestion: this.renderQuestionContent
        };
    },
    getInitialState: function getInitialState() {
        var _this = this;

        return {
            answers: (0, _immutable.fromJS)(this.props.quiz).map(function (question, key) {
                return (0, _immutable.Map)({
                    title: question.get('title'),
                    hash: question.get('hash'),
                    answer: _this.props.answers[key],
                    correct: false
                });
            }),
            questionsWithShuffledAnswers: this.props.quiz.map(function (question) {
                question.answers = question.answers.sort(function () {
                    return .5 - Math.random();
                });
                return question;
            })
        };
    },
    getClassName: function getClassName(name) {
        return '' + this.props.classPrefix + name;
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
    render: function render() {
        return _react2.default.createElement(
            'div',
            { className: this.props.classPrefix + ' ' + this.props.className },
            this.state.questionsWithShuffledAnswers.map(this.renderQuestion)
        );
    },
    renderQuestion: function renderQuestion(question, key) {
        var _question$html$split = question.html.split('{{ANSWERS}}');

        var _question$html$split2 = _slicedToArray(_question$html$split, 2);

        var before = _question$html$split2[0];
        var after = _question$html$split2[1];

        var questionData = question;
        questionData.renderAnswers = this.renderAnswers.bind(this, question.answers, key);
        questionData.content = _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement('div', { className: 'Markdown', dangerouslySetInnerHTML: { __html: before } }),
            this.renderAnswers(question.answers, key),
            _react2.default.createElement('div', { className: 'Markdown', dangerouslySetInnerHTML: { __html: after } })
        );

        return _react2.default.createElement(
            'div',
            { key: key, className: '' + this.getClassName('Question') },
            this.props.renderQuestion(questionData, key)
        );
    },
    renderQuestionContent: function renderQuestionContent(question, key) {
        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'h2',
                null,
                key + 1,
                '. ',
                _react2.default.createElement('span', { dangerouslySetInnerHTML: { __html: question.title } })
            ),
            question.content,
            _react2.default.createElement('hr', null)
        );
    },
    renderAnswers: function renderAnswers(answers, questionNumber) {
        var _this2 = this;

        return answers.map(function (aa, key) {
            var checked = _this2.props.answers[questionNumber] === aa ? "checked" : null;
            return _react2.default.createElement(
                'label',
                { className: '' + _this2.getClassName('Answer'), key: key, style: { display: 'block' } },
                _react2.default.createElement('input', { className: '' + _this2.getClassName('Answer_radio'), name: questionNumber, type: 'radio', value: key, checked: checked, onChange: _this2.onChange.bind(_this2, aa, questionNumber) }),
                _react2.default.createElement('span', { className: '' + _this2.getClassName('Answer_text'), dangerouslySetInnerHTML: { __html: aa } })
            );
        });
    }
});

exports.default = Quiz;