export const twine = {
    [PACKAGE.runtimes.twine]: {
        codeMirror: {
            mode: (...args) => {
                const mode = require('../editor/mode');
                return mode.default(...args);
            }
        }
    }
}