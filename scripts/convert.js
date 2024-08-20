
function isBoucleFor(el) {

    el = el.split(" ").slice(1, -1)
    let index, start, pas = 0
    for (let i = 0; i < el.length; i++) {
        if (el[i].trim() == "de") { index = i }
        if (el[i].trim() == "a") { start = i }
        if (el[i].trim() == "pas") { pas = i }
    }
    try {
        let test = el.slice(0, pas).match(/pas[ ]*=(?<amount>[0-9]+)/)
        pas = parseInt(test.groups.amount)
    } catch (error) {
        pas = 1
    }

    return `for (let ${el.slice(0, index)}=${el.slice(index + 1, start).join(" ")};${el.slice(0, index)}<(${el.slice(start + 1, el.length).join(" ")});${el.slice(0, index)}+=${pas}){`
}
function isSi(el) {
    let newel = el.match(/si[ ]+(?<arguments>.+)?[ ]+alors:?/i)
    if (newel) {
        return `if (${newel.groups.arguments}){`
    } else {
        return false
    }
}
function isSinonsi(el) {
    const newel = el.match(/sinonsi[ ]+(?<arguments>.+)?[ ]+alors:?/i)
    if (newel) { return `}else if (${newel.groups.arguments}){ ` }
    else { return false }
}
function isSinon(el) {
    const newel = el.match(/sinon[ ]*:?/i)
    if (newel) { return `}else{ ` }
    else { return false }
}

function isTantque(el) {
    const newel = el.match(/tantque[ ]+(?<arguments>.*)[ ]+faire/i)
    if (newel) { return `while (${newel.groups.arguments}){ ` }
    else { return false }
}
function isRepeter(el) { return "while (true) {" }

function isJusqua(el) {
    const newel = el.match(/Jusqu'?a[ ]+(?<arguments>.+)/i)
    if (newel) { return `if (${newel.groups.arguments}){ ` }
    else { return false }
}
function isLire(el) {
    const lire = el.match(/^(lire)\((?<stuff>.+)\)/i)
    if (lire && lire[2]) {
        return `if ((typeof ${lire[2]}) === 'boolean') {   ${lire[2]} = Boolean(input('${lire[2]}'))   }else if ( typeof ${lire[2]} === 'number' && !Number.isNaN(${lire[2]}) && !Number.isInteger(${lire[2]}) ){    ${lire[2]}= parseFloat(input('${lire[2]}'))    }else if (typeof ${lire[2]} === 'number' && !Number.isNaN(${lire[2]}) && Number.isInteger(${lire[2]})){    ${lire[2]}= parseInt(input('${lire[2]}'))    }else{    ${lire[2]}= input('${lire[2]}') }`
    } else {
        return false
    }
}
function getSpanTable(start, enD) {
    let begin = (start.charCodeAt(0))
    let ender = (enD.charCodeAt(0))
    let tab = '['
    for (let i = begin; i < ender + 1; i++) {
        tab = tab + '"' + (String.fromCharCode(i)) + '",'
    }
    return tab.slice(0, -1) + ']'
}
function replaceDoubleComparison(stringer) {
    let re1 = /(?<before>\w+){1}[ ]*((?<equal12>=)?(?<compare1>[\>\<]{1})(?<equal11>=)?)(?<inside>.*)((?<equal22>=)?(?<compare2>[\>\<])(?<equal21>=)?)[ ]*(?<after>\w+)/
    let item = stringer.match(re1)
    if (!item) { return stringer }
    let before = item.groups.before
    let inside = item.groups.inside
    let after = item.groups.after
    let compare1 = item.groups.compare1
    let compare2 = item.groups.compare2
    let equal1 = item.groups.equal11 || item.groups.equal12 || ''
    let equal2 = item.groups.equal21 || item.groups.equal22 || ''
    let result = '( ' + '( ' + before + compare1 + equal1 + inside + ' ) ' + '&&' + ' ( ' + inside + compare2 + equal2 + after + ' )' + ' )'
    return result
}
function replacement(el) {
    const L = el
        // .replaceAll(/\[A\.\.Z\]/g, `${getSpanTable('A', 'Z')}`)
        // .replaceAll(/\[a\.\.z\]/g, `${getSpanTable('a', 'z')}`)
        // .replaceAll(/\[0\.\.9\]/g, `${getSpanTable('0', '9')}`)
        .replaceAll(/[^a-z0-9_]non[^a-z0-9_]/ig, " ! ")
        .replaceAll(/[^a-z0-9_]et[^a-z0-9_]/ig, " && ")
        .replaceAll(/[^a-z0-9_]ou[^a-z0-9_]/ig, " || ")
        .replaceAll(/=/g, "===")
        .replaceAll(/(>===)|(===>)/g, ">=")
        .replaceAll(/(<===)|(===<)/g, "<=")
        .replaceAll(/ div /ig, " // ")
        .replaceAll(/ mod /ig, " % ")
        .replaceAll(/\)div\(/ig, ") // (")
        .replaceAll(/ div\(/ig, " // (")
        .replaceAll(/\)div /ig, ") // ")
        .replaceAll(/\)mod\(/ig, ") %  (")
        .replaceAll(/ mod\(/ig, " % (")
        .replaceAll(/\)mod /ig, ") % ")
        .replaceAll(/<--/g, '=')
        
    return replaceDoubleComparison(L)
}
function replaceInString(el) {
    let opened = null
    let start = 0
    let end = el.length
    let quoted = []
    let legit = []
    let full = ''
    for (let i = 0; i < el.length; i++) {
        const item = el[i].trim();
        let before; if (i > 0) { before = i - 1 }
        if ((item == '"' || item == "'") && el[before] != '\\') {
            if (opened == null) {
                opened = i, end = i - 1
                full += replacement(el.substring(start, end + 1))
            } else if (el[opened] == item) {
                quoted.push([opened, i])
                legit.push([start, end])
                full += el.substring(opened, i + 1)
                start = i + 1, end = el.length - 1, opened = null
            }
        }
    }
    full += replacement(el.substring(start, end + 1))
    if (opened != null) { throw ('unformatted String ') }
    return full
}

function translateLines(r) {
    let res = r
    let newres = new Array(Object.keys(res).length)
    let k = 0

    for (const [i, v] of Object.entries(res)) {
        k = k + 1
        if (res[i] == undefined) { throw (`line ${i} malformed`) }
        let key = Object.keys(res[i])[0]
        let line = res[i].trim()
        let starter = line.split(' ')[0] + ' '
        line = replaceInString(line.replaceAll(/ +/g, " "))
        //.replace(/([^:]*)(:+)$/, /$1/).replace(/([^;]*)(;+)$/, /$1/)

        if (starter.trim().match(/(fin[\-\_ ]?si)|(fin[\-\_ ]?tant[\-\_ ]?que)|(fin[\-\_ ]?si)|(fin[\-\_ ]?pour)/i)) {
            newres[k] =  '}'
        }
        else if (starter.match(/^(pour)[ ]+/i)) {
            let test = isBoucleFor(line)
            if (!test) { throw `error line ${k} : ${v} `; }
            newres[k] = test  
        } else if (starter.match(/^(si)[ ]+/i)) {
            let test = isSi(line)
            if (!test) { throw `error line ${k} : ${v} `; }
            newres[k] = test  
        } else if (starter.match(/^(sinonsi)[ ]/i)) {
            let test = isSinonsi(line)
            if (!test) { throw `error line ${k} : ${v} `; }
            newres[k] = test  
        } else if (starter.match(/^(sinon)[ ]*:?/i)) {
            let test = isSinon(line)
            if (!test) { throw `error line ${k} : ${v} `; }
            newres[k] = test  
        } else if (starter.match(/^tant[ ]?que/i)) {
            let test = isTantque(line)
            if (!test) { throw `error line ${k} : ${v} `; }
            newres[k] = test  
        } else if (starter.match(/^jusqu'?(a|à)/i)) {
            let test = isJusqua(line)
            if (!test) { throw `error line ${k} : ${v} `; }
            newres[k] = test + '\nbreak}}'  

        } else if (starter.match(/^R(e|é)p(e|é)ter[ ]*/i)) {
            let test = isRepeter(line)
            if (!test) { throw `error line ${k} : ${v} `; }
            newres[k] = test  
        } else if (starter.match(/^lire\(.+\)/i)) {
            let test = isLire(line, String(key))
            if (!test) { throw `error line ${k} : ${v} `; }
            newres[k] = test  
        }
        else { newres[k] = line   }

    }
    return newres
}

export  { translateLines };

/*
 ! RESERVED KEYWORDS :  
 ! Operations
 * pour 
 * tant que 
 * si, sinonsi, sinon
 * tantque 
 * repeter jusqu'à
 ! keywords
 * non ou
 * div mod et  
 */