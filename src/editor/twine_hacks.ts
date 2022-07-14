import type CodeMirror from "codemirror";
import type {Editor} from "codemirror";

export function getPassages(): { text: string, tags: string[] }[] {
    let root24 = document.getElementsByClassName('passage-map')[0];
    if (root24) {
        try {
            let obj = root24[Object.keys(root24).find(x => x.startsWith('__reactInternalInstance$'))];
            return obj.child.memoizedProps.passages ?? [];
        } catch {
            return [];
        }
    }
    let root23 = document.getElementById('storyEditView');
    if (root23) {
        try {
            return (root23 as any).__vue__.story.passages ?? [];
        } catch {
            return [];
        }
    }
    return [];
}

export function getCodeMirror(): Editor {
    return (document.getElementsByClassName('CodeMirror')[0] as any).CodeMirror;
}

export function getNamespace(): string {
    return window.CodeMirror ? 'moontale' : 'moontale-0.1.0';
}