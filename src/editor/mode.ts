import './twine24compat'
import 'codemirror/addon/mode/multiplex'
import 'codemirror/addon/mode/overlay'
import 'codemirror/addon/mode/simple'
import 'codemirror/mode/markdown/markdown'
// We need to use a custom modification of the default Lua mode which
// removes the case-insensitivity of the delimiter regexes.
// import 'codemirror/mode/lua/lua'
import './codemirror-mode-lua'

import type { EditorConfiguration, Mode } from 'codemirror'
import { setup } from './setup'

export default function(config: EditorConfiguration): Mode<any> {

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
    });
    setup();
    return modeObj
}