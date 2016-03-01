import parseQuiz from './parseQuiz';

export default function(source) {
    var value = parseQuiz(source);
    return "module.exports = " + JSON.stringify(value, undefined, "\t") + ";";
}
