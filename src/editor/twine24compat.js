// For Twine >=2.4, we need to hoist the CodeMirror class object into the global scope.
// This is the only sensible way to allow importing CodeMirror add-ons.
// We need to do this as soon as possible, before any import statements can run.
window.CodeMirror ??= Object.getPrototypeOf(document.getElementsByClassName('CodeMirror')[0].CodeMirror).constructor;
