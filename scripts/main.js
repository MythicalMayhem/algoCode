import { set, get, del } from './cookies.js'
import { generateTDO } from "./declaredObjects.js";
import { translateLines } from './convert.js'
import { predefined } from './predefined.js'
const print = console.log
const data = {
    text: '',
    tdnt: {},
    tdo: {},
    output: '',
}
const update = (e, selectedIndex) => {
    const names = []
    const options = [
        '<optgroup label="primitives">',
        '<option value="chaine">    chaine</option>',
        '<option value="booleen">   booleen</option>',
        '<option value="entier">    entier</option>',
        '<option value="reel">      reel</option>',
        '<option value="charactere">caractere</option>',
        '</optgroup><optgroup label="others">'
    ]
    $('#tdntkids').children().each((i, elem) => {
        const N = $(elem).children('.name').val()
        if ((N == '') || names.find((k) => k == N)) return

        $(elem).children('.desc').children('#tab').children('#typeSelect1').each((i, el) => {
            const k = $(elem).children('.desc').children('#tab').children('#typeSelect1')[0].selectedIndex
            $(el).empty()
            $(el).append(options.join('') + '</optgroup>')

            $(elem).children('.desc').children('#tab').children('#typeSelect1')[0].selectedIndex = selectedIndex || k
        })
        $(elem).children('.desc').children('#mat').children('#typeSelect2').each((i, el) => {
            const k = $(elem).children('.desc').children('#mat').children('#typeSelect2')[0].selectedIndex
            $(el).empty()
            $(el).append(options.join('') + '</optgroup>')
            $(elem).children('.desc').children('#mat').children('#typeSelect2')[0].selectedIndex = selectedIndex || k
        })



        options.push('<option value="' + N + '">' + N + '</option>')
        names.push(N)
    })
    $('#tdokids').children('.kid').each((i, elem) => {
        const k = $(elem).children('.typeSelect')[0].selectedIndex
        $(elem).children('.typeSelect').empty()
        $(elem).children('.typeSelect').append(options.join('') + '</optgroup>')


        $(elem).children('.typeSelect')[0].selectedIndex = selectedIndex || k


    })
}

const save = () => {
    getTDNT()
    getTDO()
    data.text = $('#input').val().split('\n')
    localStorage.setItem('data', JSON.stringify(data))
}




const addtdo = (e, N, T) => {
    const id = $(this).closest('fieldset').attr('id')
    const uid = Date.now()
    const str = `<div class="kid" id="${uid}"> <input type="text" value="${N || ''}" class="name"> <select id="typeSelect2" selectedIndex = "${T || 1}" class="typeSelect">   </select> </div>`
    $('#tdokids').append(str)
    $('#' + uid).append('<span class="delete" id="delete"><img src="../assets/clear.svg" alr="X" class="icon"></span>')
    $('#' + uid + ' .name').on('change', save)
    $('#' + uid + ' select').on('change', save)
    $('#' + uid + ' #delete').on('click', () => { $('#' + uid + ' .name').off('input'); $('#' + uid + ' #delete').off('click'); $('#' + uid).remove(); save() })
    $('#tdokids').show(150)
    update(null, T || 0)
}

const addtdnt = (e, N, T, O, S, R, C) => {
    const id = $(this).closest('fieldset').attr('id')
    const uid = Date.now()
    const str =
        `
        <div class="kid" id="${uid}" >  
            <input type="text" class="name" value="${N || ''}"> <span>=</span> 
            <span class="desc"> 
                <select  id="typeSelect0" style="margin-bottom: 0.3rem;" class="typeSelect"> 
                    <option value="">--</option> 
                    <option ${T == 'TAB' ? 'selected' : ''} value="TAB">tableau</option> 
                    <option ${T == 'MAT' ? 'selected' : ''} value="MAT">matrice</option> 
                </select> 
                <span style="display: ${T == 'TAB' ? 'unset' : 'none'};" id="tab" > 
                    <label for="">de <input class="intSelect" value="${S || ''}" type="number" min="0"></label> 
                    <select value="${O || ''}" id="typeSelect1" class="typeSelect">   </select> 
                </span> 
                <span style="display: ${T == 'MAT' ? 'unset' : 'none'};" id="mat">             
                    <label id='lab1' for=""> <input id="intSelect1" class="intSelect" value="${R || 0}" type="number" min="0">lignes</label> 
                    <label id='lab2' for=""> <input id="intSelect2" class="intSelect" value="${C || 0}" type="number" min="0">colonnes</label>
                    <select id="typeSelect2" class="typeSelect"  >   </select> 
                </span> 
            </span>  
        </div> 
        `
    const k = $('#tdntkids').append(str)

    $('#' + uid).append('<span class="delete" id="delete"><img src="../assets/clear.svg" alr="X" class="icon"></span>')
    $('#' + uid + ' .name').on('input', () => { update(e); save() })
    $('#' + uid + ' #delete').on('click', () => { $('#' + uid + ' .name').off('input'); $('#' + uid + ' #delete').off('click'); $('#' + uid).hide(2000).remove(); save() })
    $('#' + uid + ' .desc ').on('change', save)
    $('#' + uid + ' .desc #tab label input').on('change', save)
    $('#' + uid + ' .desc #tab select').on('change', save)

    $('#' + uid + ' .desc ').on('change', save)

    $('#' + uid + ' .desc #mat #lab1 #intSelect1').on('change', save)
    $('#' + uid + ' .desc #mat #lab2 #intSelect2').on('change', save)
    $('#' + uid + ' .desc #mat select').on('change', save)

    $('#tdntkids').show(150)
    $('#' + uid + ' #typeSelect0').on('change', (e) => {
        const type = $(e.target).val()
        if (type === 'TAB') {
            $($(e.target.parentNode).children('#tab')[0]).fadeIn(500)
            $($(e.target.parentNode).children('#mat')[0]).hide()
        } else if (type === 'MAT') {
            $($(e.target.parentNode).children('#mat')[0]).fadeIn(500)
            $($(e.target.parentNode).children('#tab')[0]).hide()
        } else {
            $($(e.target.parentNode).children('#mat')[0]).fadeOut(100)
            $($(e.target.parentNode).children('#tab')[0]).fadeOut(100)
        }
    })
    update(null, O || 0)
}

function getTDNT() {
    data.tdnt = {}
    $('#tdntkids').children('.kid').each(function (i, elem) {
        const name = $(elem).children('.name').val().trim()
        if (!name) { alert(`tdnt  ${i + 1} invalid name`); throw '' }
        const type = $(elem).children('.desc').children('#typeSelect0').val()

        if (type === 'TAB') {
            const tabletype = $(elem).children('.desc').children('#tab').children('#typeSelect1').val()
            const t = $(elem).children('.desc').children('#tab').children('#typeSelect1')[0].selectedIndex
            const size = parseInt($(elem).children('.desc').children('#tab').children('label').children('input').val())
            data.tdnt[name] = { form: 'TAB', size, content: tabletype, selectedIndex: t }
        } else if (type == 'MAT') {
            const mattype = $(elem).children('.desc').children('#mat').children('#typeSelect2').val()
            const t = $(elem).children('.desc').children('#mat').children('#typeSelect2')[0].selectedIndex
            const lines = parseInt($(elem).children('.desc').children('#mat').children('label').eq(0).children('input').val())
            const cols = parseInt($(elem).children('.desc').children('#mat').children('label').eq(1).children('input').val())
            data.tdnt[name] = { form: 'MAT', lines, cols, content: mattype, selectedIndex: t }
        }

    })
}

function getTDO() {
    data.tdo = {}
    $('#tdokids').children('.kid').each((i, el) => {
        const name = $(el).children('.name').val()
        const type = $(el).children('.typeSelect').val()
        const t = $(el).children('.typeSelect')[0].selectedIndex



        data.tdo[name] = { form: 'VAR', content: type, selectedIndex: t }
    })
}
$(window).on('load', (e) => {
    const d = JSON.parse(localStorage.getItem('data'))

    for (const [key, value] of Object.entries(d.tdnt)) {
        const type = value.form
        if (type == 'TAB') { addtdnt('', key, 'TAB', value.selectedIndex, value.size, 0, 0) }
        else if (type == 'MAT') { addtdnt('', key, 'MAT', value.selectedIndex, 0, value.lines, value.cols) }
    }
    for (const [key, value] of Object.entries(d.tdo)) {

        addtdo(null, key, value.selectedIndex)
    }
    $("#input").val(d.text.join('\n'))
});
$("#input").on('input', save);

const colpses = {
    'tdo': 180,
    'tdnt': 180
}

$('#collapseTDNT,#collapseTDO').on('click', function (e) {
    const id = $(this).closest('fieldset').attr('id')
    colpses[id] = (colpses[id] + 180) % 360
    const el = $('#' + id).children('.interact').children('.expand').children('.icon')
    el.css({ 'transform': `rotate(${colpses[id]}deg)` })
    $('#' + id + 'kids').toggle(250)
})
$('#clearTDNT,#clearTDO').on('click', function (e) {
    const id = $(this).closest('fieldset').attr('id')
    console.log(id);

    colpses[id] = 0
    const el = $('#' + id).children('.interact').children('.expand').children('.icon')
    el.css({ 'transform': `rotate(${colpses[id]}deg)` })
    $('#' + id + 'kids').hide(150)
    $('#' + id + 'kids').empty()
})
$('#addTDNT').on('click', (e) => {
    const id = 'tdnt'
    colpses[id] = 0
    const el = $('#' + id).children('.interact').children('.expand').children('.icon')
    el.css({ 'transform': `rotate(${colpses[id]}deg)` })
    addtdnt(e)
})
$('#addTDO').on('click', (e) => {
    const id = 'tdo'
    colpses[id] = 0
    const el = $('#' + id).children('.interact').children('.expand').children('.icon')
    el.css({ 'transform': `rotate(${colpses[id]}deg)` })
    addtdo(e)
})

$('#clear').on('click', () => { $('#innerTerminal').empty() })
$('#copy').on('click', () => {
    navigator.clipboard.writeText(data.output);
    alert("Copied raw javascript ");
})

$('#run').on('click', () => {
    getTDNT()
    getTDO()
    data.text = $('#input').val().split('\n')
    let parent = document.getElementById('innerTerminal')
    let node = document.createElement('div')
    node.innerText = '=============='
    parent.appendChild(node)
    try {
        const a = generateTDO(data.tdnt, data.tdo)
        const b = translateLines(data.text)
        data.output = predefined + '\n' + a + b.join(';')
        try {
            eval(data.output);
        } catch (error) {
            let parent = document.getElementById('innerTerminal')
            let node = document.createElement('div')
            node.innerText = error
            parent.appendChild(node)
            console.log(error);
        }
    } catch (error) {
        data.output = 'ecrire("syntax error:  ' + error + '  )'
        console.log(error);

    }


})