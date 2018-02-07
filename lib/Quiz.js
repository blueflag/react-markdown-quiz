'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _checkHash = require('./checkHash');

var _checkHash2 = _interopRequireDefault(_checkHash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Quiz = function (_React$Component) {
    (0, _inherits3.default)(Quiz, _React$Component);

    function Quiz(props) {
        (0, _classCallCheck3.default)(this, Quiz);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Quiz.__proto__ || (0, _getPrototypeOf2.default)(Quiz)).call(this, props));

        _initialiseProps.call(_this);

        _this.state = {
            answers: null,
            questionsWithShuffledAnswers: null
        };
        return _this;
    }

    (0, _createClass3.default)(Quiz, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.setState(this.generateState(this.props));
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.quiz !== this.props.quiz) {
                this.setState(this.generateState(nextProps));
            }
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.state.answers) {
                return null;
            }
            return _react2.default.createElement(
                'div',
                { className: this.props.classPrefix + ' ' + this.props.className },
                this.state.questionsWithShuffledAnswers.map(this.renderQuestion)
            );
        }
    }]);
    return Quiz;
}(_react2.default.Component);

Quiz.defaultProps = {
    classPrefix: "Quiz",
    className: '',
    renderQuestion: function renderQuestion(question, key) {
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
    }
};

var _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.generateState = function (props) {
        return {
            answers: (0, _immutable.fromJS)(props.quiz).map(function (question, key) {
                return (0, _immutable.Map)({
                    title: question.get('title'),
                    hash: question.get('hash'),
                    correct: false,
                    correctAnswer: _this2.renderCorrectAnswer(question.get('hash'), question.get('answers')),
                    answer: null
                });
            }),
            questionsWithShuffledAnswers: props.quiz.map(function (question) {
                question.answers = question.answers.sort(function () {
                    return .5 - Math.random();
                });
                return question;
            })
        };
    };

    this.getClassName = function (name) {
        return '' + _this2.props.classPrefix + name;
    };

    this.renderCorrectAnswer = function (hash, answers) {
        var data = [];
        answers.map(function (item, key) {
            var test = (0, _checkHash2.default)(item) === hash ? item : null;
            if (test) {
                data.push(test);
            }
        });
        return data[0];
    };

    this.onChange = function (value, index) {
        _this2.setState({
            answers: _this2.state.answers.setIn([index, 'answer'], value).setIn([index, 'correct'], _this2.state.answers.getIn([index, 'hash']) === (0, _checkHash2.default)(value))
        }, _this2.onUpdateParent);
    };

    this.onUpdateParent = function () {
        if (_this2.props.onChange) {
            _this2.props.onChange(_this2.state.answers.toJS());
        }
    };

    this.renderQuestion = function (question, key) {
        var _question$html$split = question.html.split('{{ANSWERS}}'),
            _question$html$split2 = (0, _slicedToArray3.default)(_question$html$split, 2),
            before = _question$html$split2[0],
            after = _question$html$split2[1];

        var questionData = question;
        var keyAnswer = _this2.state.answers.getIn([key, "answer"]);
        questionData.renderAnswers = _this2.renderAnswers.bind(_this2, question.answers, key);
        questionData.content = _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement('div', { className: 'Markdown', dangerouslySetInnerHTML: { __html: before } }),
            _this2.renderAnswers(question.answers, key, keyAnswer),
            _react2.default.createElement('div', { className: 'Markdown', dangerouslySetInnerHTML: { __html: after } })
        );

        return _react2.default.createElement(
            'div',
            { key: key, className: '' + _this2.getClassName('Question') },
            _this2.props.renderQuestion(questionData, key)
        );
    };

    this.renderAnswers = function (answers, questionNumber, keyAnswer) {
        return answers.map(function (aa, key) {
            return _react2.default.createElement(
                'label',
                { className: '' + _this2.getClassName('Answer'), key: key, style: { display: 'block' } },
                _react2.default.createElement('input', {
                    className: '' + _this2.getClassName('Answer_radio'),
                    name: questionNumber,
                    checked: keyAnswer === aa,
                    type: 'radio', value: key,
                    onChange: _this2.onChange.bind(_this2, aa, questionNumber)
                }),
                _react2.default.createElement('span', { className: '' + _this2.getClassName('Answer_text'), dangerouslySetInnerHTML: { __html: aa } })
            );
        });
    };
};

exports.default = Quiz;