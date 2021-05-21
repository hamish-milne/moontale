window.CodeMirror = require("codemirror/lib/codemirror.js")
import "codemirror/lib/codemirror.css"
import "codemirror/theme/ambiance.css"
import "./setup"
import "./editor_test.html"

let textArea = document.getElementById("myTextArea") as HTMLTextAreaElement
window.CodeMirror.fromTextArea(textArea, {
    lineNumbers: true,
    mode: "moontale",
    theme: "ambiance"
});