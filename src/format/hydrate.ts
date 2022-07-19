import { getEditorInstances, init } from "../editor/twine_hacks";

export const twine = {
    [PACKAGE.runtimes.twine]: {
        codeMirror: {
            mode: (...args) => {
                init();
                // NB: We *must* use 'require' here to ensure that the module doesn't get loaded
                // before we have a chance to set up the global scope.
                const setup = require('../editor/setup');
                setup.globalSetup();
                for (const editor of getEditorInstances()) {
                    setup.localSetup(editor);
                }
                const mode = require('../editor/mode');
                return mode.default(...args);
            },
            toolbar: require('../editor/toolbar').default,
            commands: require('../editor/commands'),
            references: require('../editor/references'),
        }
    }
}
