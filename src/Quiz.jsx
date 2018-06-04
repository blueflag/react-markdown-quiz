import React from 'react';
import {fromJS, Map} from 'immutable';
import checkHash from './checkHash';

class Quiz extends React.Component {
    static defaultProps = {
        classPrefix: "Quiz",
        className: '',
        renderQuestion: (question, key) => {
            return <div>
                <h2>{key + 1}. <span dangerouslySetInnerHTML={{__html: question.title}}/></h2>
                {question.content}
                <hr/>
            </div>;
        }
    }
    constructor(props: Object) {
        super(props);
        this.state = {
            answers: null,
            questionsWithShuffledAnswers: null
        };
    }
    componentWillMount(){
        this.setState(this.generateState(this.props));
    }
    componentWillReceiveProps(nextProps: Object) {
        if(nextProps.quiz !== this.props.quiz) {
            this.setState(this.generateState(nextProps));
        }
    }
    generateState = (props) => ({
        answers: fromJS(props.quiz).map((question,key) => {
            var referText = null;
            if(question.get('refer')){
                var referTo = question.get('refer').split('Refer To: ');
                referText = referTo[1];
            }
            return Map({
                title: question.get('title'),
                hash: question.get('hash'),
                refer: referText,
                correct: false,
                correctAnswer: this.renderCorrectAnswer(question.get('hash'),question.get('answers')),
                answer: null
            })
        }),
        questionsWithShuffledAnswers: props.quiz.map(question => {
            question.answers = question.answers.sort(() => .5 - Math.random());
            return question;
        })
    });
    getClassName = (name) => {
        return `${this.props.classPrefix}${name}`;
    }
    renderCorrectAnswer = (hash,answers) => {
        var data = [];
        answers.map((item,key) => {
            var test = (checkHash(item) === hash) ? item : null;
            if(test){
                data.push(test);
            }
        })
        return data[0]
    }
    onChange = (value, index) => {
        this.setState({
            answers: this.state.answers
                .setIn([index, 'answer'], value)
                .setIn([index, 'correct'], this.state.answers.getIn([index, 'hash']) === checkHash(value))
        }, this.onUpdateParent);
    }
    onUpdateParent = () => {
        if (this.props.onChange) {
            this.props.onChange(this.state.answers.toJS());
        }
    }
    render() {
        if(!this.state.answers){
            return null
        }
        return <div className={`${this.props.classPrefix} ${this.props.className}`}>
            {this.state.questionsWithShuffledAnswers.map(this.renderQuestion)}
        </div>
    }
    renderQuestion = (question, key) => {
        var [before, after] = question.html.split('{{ANSWERS}}');
        var questionData = question;
        var keyAnswer = this.state.answers.getIn([key,"answer"]);
        questionData.renderAnswers = this.renderAnswers.bind(this, question.answers, key);
        questionData.content = <div>
            <div className="Markdown" dangerouslySetInnerHTML={{__html: before}}/>
            {this.renderAnswers(question.answers, key, keyAnswer)}
            <div className="Markdown" dangerouslySetInnerHTML={{__html: after}}/>
        </div>;

        return <div key={key} className={`${this.getClassName('Question')}`}>
            {this.props.renderQuestion(questionData, key)}
        </div>

    }
    renderAnswers = (answers, questionNumber, keyAnswer) => {
        return answers.map((aa, key) => {
            return <label className={`${this.getClassName('Answer')}`} key={key} style={{display:'block'}}>
                <input
                className={`${this.getClassName('Answer_radio')}`}
                name={questionNumber}
                checked={keyAnswer === aa}
                type="radio" value={key}
                onChange={this.onChange.bind(this, aa, questionNumber)}
                />
                <span className={`${this.getClassName('Answer_text')}`} dangerouslySetInnerHTML={{__html: aa}}/>
            </label>
        });
    }
}



export default Quiz;
