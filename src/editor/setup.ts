import 'codemirror/addon/lint/lint'
import 'codemirror/addon/comment/comment'
import { makeLinter } from "./linter"
import { getNamespace, getPassages } from './twine_hacks'

import editorCss from './editor.css'
import lintCss from "codemirror/addon/lint/lint.css"
import moontaleLib from '../../moontale-unity/Packages/com.hmilne.moontale/Runtime/moontale.lua'
import type { Editor, KeyMap } from 'codemirror'

function loadExtraCss(id: string, src: string) {
    let styleContainer = document.querySelector(`style#${id}`);
    if (!styleContainer) {
        styleContainer = document.createElement('style')
        styleContainer.setAttribute('id', id)
        document.head.appendChild(styleContainer)
    }
    styleContainer.innerHTML = src
}

export function globalSetup() {
    loadExtraCss('cm-lint', lintCss)
    loadExtraCss('cm-moontale', editorCss)
    window.CodeMirror.registerHelper('lint', getNamespace(), makeLinter(moontaleLib, getPassages));
    // The 'extraKeys' option is overwritten in 2.4, so we need to change the default keymap instead
    const keymaps = (window.CodeMirror as any).keyMap;
    (keymaps.default as KeyMap)['Ctrl-/'] = 'toggleComment';
    (keymaps.macDefault as KeyMap)['Cmd-/'] = 'toggleComment';
}

export function localSetup(cm: Editor) {
    cm.setOption("lint", true)
    cm.setOption("lineNumbers", true);
    cm.setOption("indentWithTabs", true);
    cm.setOption("indentUnit", 4);
    cm.setOption("lineComment", "//");
    cm.setOption("blockCommentStart", "--[[");
    cm.setOption("blockCommentEnd", "]]");
    // HACK: Force a change to get it to lint for the first time
    for (let f of (cm as any)._handlers.change) {
        f(cm)
    }
}
