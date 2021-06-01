import 'codemirror/addon/mode/multiplex'
import 'codemirror/addon/mode/overlay'
import 'codemirror/addon/mode/simple'
import 'codemirror/addon/lint/lint'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/lua/lua'
import editorCss from './editor.css'
import { lint } from "./linter"
import "codemirror/addon/lint/lint.css"

let styleContainer = document.querySelector('style#cm-moontale');
if (!styleContainer) {
    styleContainer = document.createElement('style')
    styleContainer.setAttribute('id', 'cm-moontale')
    document.head.appendChild(styleContainer)
}
styleContainer.innerHTML = editorCss

window.CodeMirror.defineSimpleMode('moontale', {
    start: [
        {regex: /\{\$/, token: 'tag', mode: {spec: 'lua', end: /\$\}/}},
        {regex: /\<\$/, token: 'tag', mode: {spec: 'lua', end: /\$\>/}},
        {regex: /\$[A-Za-z_]\w*/, token: 'variable-2', push: 'expression'},
        {regex: /(\[\[)(.*?)(<\-)/, token: ['bracket', 'link', 'special', 'bracket']},
        {regex: /(\[\[)((?:(?!->).)*?)(\]\])/, token: ['bracket', 'link', 'bracket']},
        {regex: /\[\[/, token: 'bracket'},
        {regex: /(->)(.*?)(]])/, token: ['special', 'link', 'bracket']},
        {regex: /(->)/, token: 'special'},
        {regex: /]]/, token: 'bracket'},
        {regex: /\[|]/, token: 'tag'},
        {regex: /-|\{|<|\[|]|\$/},
        {regex: /(?!\$)/, mode: {spec: 'markdown', end: /(?=-|\{|<|\[|]|\$)/, persistent: true}},
    ],
    expression: [
        {sol: true, pop: true},
        {regex: /<</, token: 'bracket', mode: {spec: 'lua', end: />>/}},
        {regex: /(\.)(\w+)/, token: ['punctuation', 'variable'], next: 'expression'},
        {regex: /\(/, token: 'bracket', mode: {spec: 'lua', end: /\)/}},
        {regex: /\{/, token: 'bracket', mode: {spec: 'lua', end: /\}/}},
        {regex: '', pop: true},
    ]
})

window.CodeMirror.registerHelper('lint', 'moontale', lint)
