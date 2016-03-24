import React from 'react';
import {fromJS, Map} from 'immutable';
import checkHash from './checkHash';

var Quiz = React.createClass({
    displayName: 'Quiz',
    getDefaultProps() {
        return {
            classPrefix: "Quiz",
            renderQuestion: this.renderQuestionContent
        };
    },
    getInitialState() {
        return {
            answers: fromJS(this.props.quiz).map(question => {
                return Map({
                    title: question.get('title'),
                    hash: question.get('hash'),
                    answer: null,
                    correct: false
                })
            }),
            questionsWithShuffledAnswers: this.props.quiz.map(question => {
                question.answers = question.answers.sort(() => .5 - Math.random());
                return question;
            })
        }
    },
    getClassName(name) {
        return `${this.props.classPrefix}${name}`;
    },
    onChange(value, index) {
        this.setState({
            answers: this.state.answers
                .setIn([index, 'answer'], value)
                .setIn([index, 'correct'], this.state.answers.getIn([index, 'hash']) === checkHash(value))
        }, this.onUpdateParent);
    },
    onUpdateParent() {
        if (this.props.onChange) {
            this.props.onChange(this.state.answers.toJS());
        }
    },
    render() {
        return <div className={`${this.props.classPrefix} ${this.props.className}`}>
            {this.state.questionsWithShuffledAnswers.map(this.renderQuestion)}
        </div>
    },
    renderQuestion(question, key) {
        var [before, after] = question.html.split('{{ANSWERS}}');
        var questionData = question;
        questionData.renderAnswers = this.renderAnswers.bind(this, question.answers, key);
        questionData.content = <div>
            <div className="Markdown" dangerouslySetInnerHTML={{__html: before}}/>
            {this.renderAnswers(question.answers, key)}
            <div className="Markdown" dangerouslySetInnerHTML={{__html: after}}/>
        </div>;

        return <div key={key} className={`${this.getClassName('Question')}`}>
            {this.props.renderQuestion(questionData, key)}
        </div>

    },
    renderQuestionContent(question, key){
        return <div>
            <h2>{key + 1}. <span dangerouslySetInnerHTML={{__html: question.title}}/></h2>
            {question.content}
            <hr/>
        </div>;
    }
    renderAnswers(answers, questionNumber) {
        return answers.map((aa, key) => {
            return <label className={`${this.getClassName('Answer')}`} key={key} style={{display:'block'}}>
                <input className={`${this.getClassName('Answer_radio')}`} name={questionNumber} type="radio" value={key} onChange={this.onChange.bind(this, aa, questionNumber)}/>
                <span className={`${this.getClassName('Answer_text')}`} dangerouslySetInnerHTML={{__html: aa}}/>
            </label>
        });
    }
});

export default Quiz;
