import 'codemirror/addon/lint/lint'
import { makeLinter } from "./linter"
import { getCodeMirror, getNamespace, getPassages } from './twine_hacks'

import editorCss from './editor.css'
import lintCss from "codemirror/addon/lint/lint.css"
import moontaleLib from '../../moontale-unity/Packages/com.hmilne.moontale/Runtime/moontale.lua'

function loadExtraCss(id: string, src: string) {
    let styleContainer = document.querySelector(`style#${id}`);
    if (!styleContainer) {
        styleContainer = document.createElement('style')
        styleContainer.setAttribute('id', id)
        document.head.appendChild(styleContainer)
    }
    styleContainer.innerHTML = src
}

export function setup() {
    loadExtraCss('cm-lint', lintCss)
    loadExtraCss('cm-moontale', editorCss)
    let cm = getCodeMirror();
    if (cm != undefined) {
        window.CodeMirror.registerHelper('lint', getNamespace(), makeLinter(moontaleLib, getPassages));
        cm.setOption("lint", true)
        cm.setOption("lineNumbers", true);
        cm.setOption("indentWithTabs", true);
        cm.setOption("indentUnit", 4);
        // HACK: Force a change to get it to lint for the first time
        for (let f of (cm as any)._handlers.change) {
            f(cm)
        }
    }
}
