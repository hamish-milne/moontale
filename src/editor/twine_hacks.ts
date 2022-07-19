import type {Editor} from "codemirror";

export function getPassages(): { text: string, tags: string[] }[] {
    try {
        let root24 = document.getElementsByClassName('passage-map')[0];
        if (root24) {
            let obj = root24[Object.keys(root24).find(x => x.startsWith('__reactInternalInstance$'))!];
            return obj.child.memoizedProps.passages ?? [];
        }
        let root23 = document.getElementById('storyEditView');
        if (root23) {
            return (root23 as any).__vue__.story.passages ?? [];
        }
    } catch {
        // Ignore
    }
    return [];
}

export function getEditorInstances(): Editor[] {
    return Array.from(document.getElementsByClassName('CodeMirror')).map(x => (x as any).CodeMirror as Editor).filter(x => x);
}

export function getNamespace(): string {
    return document.getElementsByClassName('passage-map').length == 0 ? PACKAGE.name : `${PACKAGE.name}-${PACKAGE.version}`;
}

export function init() {
    // For Twine >=2.4, we need to hoist the CodeMirror class object into the global scope.
    // This is the only sensible way to allow importing CodeMirror add-ons.
    // We need to do this as soon as possible, before any import statements can run.
    window.CodeMirror ??= Object.getPrototypeOf((document.getElementsByClassName('CodeMirror')[0] as any).CodeMirror).constructor;
}
