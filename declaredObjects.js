function createTable(len, type) {
    let s = '['
    for (let i = 0; i < len; i++) { s += type + ',' }
    return s.slice(0, -1) + '] \n'
}

function createMatrix(row, col, type, templates) {
    let s = '['
    for (let i = 0; i < row; i++) { s += String(createTable(col, type, templates)) + ',' }
    return s.slice(0, -1) + ']'
}

function createVar(obj, tdnt) {
    switch (obj.content) {
        case 'entier': return '0'
        case 'chaine': return '""'
        case 'charactere': return '""'
        case "reel": return '0.0'
        case 'booleen': return 'false'
        default: break
    }
    if (tdnt[obj.content] && (tdnt[obj.content].form == 'MAT')) {
        return createMatrix(tdnt[obj.content].lines, tdnt[obj.content].cols, createVar(tdnt[obj.content], tdnt))
    }
    else if (tdnt[obj.content] && (tdnt[obj.content].form == 'TAB')) {
        return createTable(tdnt[obj.content].size, createVar(tdnt[obj.content], tdnt))
    }
}
function generateTDO(tdnt, tdo) {
    let lines = ''
    for (const [key, val] of Object.entries(tdo)) { lines += `let ${key} = ${createVar(val, tdnt)};` }
    return lines
}

module.exports = { generateTDO };