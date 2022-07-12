window.storyFormat({
    name: "Moontale",
    version: "0.1.0",
    author: "Hamish Milne",
    description: "A Twine 2 story format that outputs Lua",
    proofing: false,
    url: "https://github.com/hamish-milne/moontale",
    license: "MIT",
    image: 'icon.svg',
    hydrate: HYDRATE,
    source: SOURCE,
    // Legacy support for Twine <=2.3
    setup() {
        const out = {};
        const f = new Function(this.properties.hydrate);
        f.call(out);
        window.CodeMirror.defineMode('moontale', out.editorExtensions.twine['^2.4.0'].codeMirror.mode);
    },
})