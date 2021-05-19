import 'codemirror/addon/mode/multiplex'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/lua/lua'

window.CodeMirror.defineMode('moontale', config => {
    let lua = window.CodeMirror.getMode(config, "lua")
    return window.CodeMirror.multiplexingMode(
        window.CodeMirror.getMode(config, "markdown"), {
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
            open: "[[",
            close: "]]",
            mode: window.CodeMirror.getMode(config, 'text/plain'),
            parseDelimiters: false,
            innerStyle: "Link",
            delimStyle: "LinkMarker"
        }
    )
})
