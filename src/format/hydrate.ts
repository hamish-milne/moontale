export const twine = {
    ['^2.4.0']: {
        codeMirror: {
            mode: (...args) => {
                const mode = require('../editor/mode');
                return mode.default(...args);
            }
        }
    }
}