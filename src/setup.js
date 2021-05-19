require('codemirror/addon/mode/multiplex')
require('codemirror/mode/markdown/markdown')
require('codemirror/mode/lua/lua')

window.CodeMirror.defineMode('moontale', config => CodeMirror.multiplexingMode(
    CodeMirror.getMode(config, "markdown"), {
        open: "{$",
        close: "$}",
        mode: CodeMirror.getMode(config, 'lua'),
        delimStyle: "ScriptMarker"
    }, {
        open: "<$",
        close: "$>",
        mode: CodeMirror.getMode(config, 'lua'),
        delimStyle: "ScriptMarker"
    }, {
        open: "[[",
        close: "]]",
        mode: CodeMirror.getMode(config, 'text/plain'),
        parseDelimiters: false,
        innerStyle: "Link",
        delimStyle: "LinkMarker"
    }, {
        open: "[",
        close: "]",
        mode: CodeMirror.getMode(config, 'markdown'),
        delimStyle: "ContentBlockMarker",
        innerStyle: "ContentBlock"
    }
))
