import 'codemirror/addon/mode/multiplex'
import 'codemirror/addon/mode/overlay'
import 'codemirror/addon/mode/simple'
import 'codemirror/addon/lint/lint'
import * as lintModule from 'codemirror/addon/lint/lint'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/lua/lua'
import editorCss from './editor.css'
import { makeLinter } from "./linter"
import lintCss from "codemirror/addon/lint/lint.css"
import { Editor, EditorConfiguration, Mode } from 'codemirror'
import moontaleLib from '../moontale-unity/Packages/com.hmilne.moontale/Runtime/moontale.lua'

function loadExtraCss(id: string, src: string) {
    let styleContainer = document.querySelector(`style#${id}`);
    if (!styleContainer) {
        styleContainer = document.createElement('style')
        styleContainer.setAttribute('id', id)
        document.head.appendChild(styleContainer)
    }
    styleContainer.innerHTML = src
}

loadExtraCss('cm-lint', lintCss)
loadExtraCss('cm-moontale', editorCss)

function modeFactory(config: EditorConfiguration): Mode<any> {
    let modeObj = window.CodeMirror.simpleMode(config, {
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
    let cm = (modeFactory as any).cm as Editor | undefined
    // This is a TwineJS hack that lets us access the CodeMirror Editor instance
    if (cm != undefined) {
        cm.setOption("lint", true)
        cm.setOption("lineNumbers", true);
        // HACK: Force a change to get it to lint for the first time
        for (let f of (cm as any)._handlers.change) {
            f(cm)
        }
    }
    return modeObj
}

window.CodeMirror.defineMode('moontale', modeFactory)

window.CodeMirror.registerHelper('lint', 'moontale', makeLinter(moontaleLib,
    () => (document.querySelector('div#storyEditView') as any)?.__vue__?.story?.passages ?? []    
))
