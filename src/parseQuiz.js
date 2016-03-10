import {Map, List, fromJS} from 'immutable';
import {markdown} from "markdown";
import yamlFront from 'yaml-front-matter';

import checkHash from './checkHash.js';
const initialState = fromJS([]);

function renderHTML(tree) {
    return markdown.renderJsonML(markdown.toHTMLTree(tree))
}

export default function (str) {
    console.log('\n=================\n');
    var quiz = (!str.__content) ? yamlFront.loadFront(str) : str;
    return fromJS(markdown.parse(quiz.__content))
        .skip(1)
        .reduce((reduction, value, key, iterable) => {
            switch (value.get(0)) {
                case 'header':
                    console.log('header')
                    return reduction
                        // Create an object for each header
                        .update(vv => vv.push(fromJS({
                            title: renderHTML(value.toJS()),
                            answers: [],
                            markdown: []
                        })))

                        .updateIn([reduction.size, 'markdown'], List(), vv => vv.push(value))

                case 'numberlist':
                    var currentQuestion = reduction.size - 1;
                    var answers = value
                        .skip(1)
                        .map(qq => renderHTML(qq.toJS()));

                    var randomAnswers = answers.reduce((rr, ii) => rr.splice(Math.floor(Math.random() * rr.size),0,ii), List());
                    return reduction
                        .updateIn([currentQuestion, 'markdown'], vv => vv.push('{{ANSWERS}}'))
                        .setIn([currentQuestion, 'hash'], checkHash(answers.get(0)))
                        .setIn([currentQuestion, 'answers'], randomAnswers);

                default:
                    console.log('defualt', value);
                    return reduction
                        .updateIn([reduction.size - 1 , 'markdown'], List(), vv => vv.push(value));

            }
        }, initialState)
        .map(question => {
            var markdownTree = question.get('markdown').toJS();
            return question.set('html', renderHTML(markdownTree));
        })
        .toJS()
}
