function stringWithArrows(text, startpos, endpos) {
    var result = ''

    var posStart = startpos.idx
    var between = endpos - posStart
    var start = ''
    var end = '^'
    for (i=0;i < posStart;i++) {
        start+=' '
    }
    for (i=0;i < between;i++) {
        end+='^'
    }
    result = text + '\n' + start + end
    return result
}

module.exports = {
    stringWithArrows
}