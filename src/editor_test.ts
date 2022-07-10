// Simulate how Twine uses CodeMirror:
window.CodeMirror = require("codemirror/lib/codemirror.js").CodeMirror;
import "codemirror/lib/codemirror.css"
import "codemirror/theme/ambiance.css"
import "./setup"
import "./editor_test.html"

let textArea = document.getElementById("myTextArea") as HTMLTextAreaElement
let editor = window.CodeMirror.fromTextArea(textArea, {
    theme: "ambiance",
});
(window.CodeMirror.modes['moontale'] as any).cm = editor
editor.setOption('mode', 'moontale')
