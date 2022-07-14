// This file converts the 'mode' ESM into a function that returns its default export (the mode object).
// We need to do this separately from hydrate.js, because the latter is compiled without bundling.
return require("../editor/mode").default;
