import parseQuiz from './parseQuiz';

module.exports =  function(source) {
    var value = parseQuiz(source);
    return "module.exports = " + JSON.stringify(value, undefined, "\t") + ";";
}
