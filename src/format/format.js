window.storyFormat({
    name: "Moontale",
    version: "0.1.0",
    author: "Hamish Milne",
    description: "A Twine 2 story format that outputs Lua",
    proofing: false,
    url: "https://github.com/hamish-milne/moontale",
    license: "MIT",
    image: 'icon.svg',
    editorExtensions: {
        twine: {
            '^2.4.0': {
                codeMirror: {
                    mode: null
                }
            }
        }
    },
    hydrate: HYDRATE,
    setup: HYDRATE_LEGACY,
    source: SOURCE,
})