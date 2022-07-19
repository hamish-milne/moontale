export const twine = {
    [PACKAGE.runtimes.twine]: {
        codeMirror: {
            mode: (...args) => {
                const mode = require('../editor/mode');
                return mode.default(...args);
            },
            toolbar: require('../editor/toolbar').default,
            commands: require('../editor/commands'),
            references: require('../editor/references'),
        }
    }
}