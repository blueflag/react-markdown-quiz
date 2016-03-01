import React from 'react';
import {fromJS, Map} from 'immutable';
import checkHash from './checkHash';
import {SCORM} from 'pipwerks-scorm-api-wrapper';

var Quiz = React.createClass({
    displayName: 'Quiz',
    render() {
        return <div>
            {this.props.quiz.map(this.renderQuestion)}
        </div>
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
            })
        }
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
    renderAnswers(answers, questionNumber) {
        return answers.map((aa, key) => {
            return <label key={key} style={{display:'block'}}>
                <input name={questionNumber} type="radio" value={key} onChange={this.onChange.bind(this, aa, questionNumber)}/>
                <span dangerouslySetInnerHTML={{__html: aa}}/>
            </label>
        });
    },
    renderQuestion(question, key) {
        var [before, after] = question.html.split('{{ANSWERS}}');

        return <div key={key}>
            <h2>{key + 1}. <span dangerouslySetInnerHTML={{__html: question.title}}/></h2>
            <div className="Markdown" dangerouslySetInnerHTML={{__html: before}}/>
            {this.renderAnswers(question.answers, key)}
            <div className="Markdown" dangerouslySetInnerHTML={{__html: after}}/>
            <hr/>
        </div>
    }
});

export default Quiz;
