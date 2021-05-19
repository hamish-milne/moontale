import 'codemirror/addon/mode/multiplex'
import 'codemirror/addon/mode/overlay'
import 'codemirror/addon/mode/simple'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/lua/lua'
import editorCss from './editor.css'

let styleContainer = document.querySelector('style#cm-moontale');
if (!styleContainer) {
    styleContainer = document.createElement('style')
    styleContainer.setAttribute('id', 'cm-moontale')
    document.head.appendChild(styleContainer)
}
styleContainer.innerHTML = editorCss

window.CodeMirror.defineMode('moontale', config => {
    let lua = window.CodeMirror.getMode(config, "lua")
    let markdown = window.CodeMirror.getMode(config, "markdown")

    let overlayMode = window.CodeMirror.simpleMode(config, {
        start: [
            {regex: /\[\[/, token: 'LinkMarker', push: "link"},
            {regex: /\$\w+/, token: 'variable', push: 'expression'}
        ],
        link: [
            {regex: /(<-)|(->)/, token: 'LinkArrow'},
            {regex: /\]\]/, token: 'LinkMarker', pop: true},
        ],
        expression: [
            {regex: /\{/, token: 'paren', push: 'braceExpression'},
            {regex: /\(/, token: 'paren', push: 'parenExpression'},
            {regex: /<<.*?>>/, token: 'callback', next: 'expression'},
            {regex: /\.\w+/, token: 'variable', next: 'expression'},
            {regex: /./, pop: true}
        ],
        parenExpression: [
            {regex: /\{/, token: 'paren', push: 'braceExpression'},
            {regex: /\(/, token: 'paren', push: 'parenExpression'},
            {regex: /\)/, token: 'paren', pop: true},
        ],
        braceExpression: [
            {regex: /\{/, token: 'paren', push: 'braceExpression'},
            {regex: /\(/, token: 'paren', push: 'parenExpression'},
            {regex: /\}/, token: 'paren', pop: true},
        ],
    })

    let baseMode = window.CodeMirror.multiplexingMode(
        markdown, {
            open: "{$",
            close: "$}",
            mode: lua,
            delimStyle: "ScriptMarker"
        }, {
            open: "<$",
            close: "$>",
            mode: lua,
            delimStyle: "ScriptMarker"
        }, {
            open: '[',
            close: ']',
            mode: markdown,
            delimStyle: "ContentMarker"
        }
    )
    return window.CodeMirror.overlayMode(baseMode, overlayMode, false)
})
