window.storyFormat({"name":"Moontale","version":"0.0.0","author":"Hamish Milne","description":"A Twine 2 story format that outputs Lua","proofing":false,"url":"https://github.com/hamish-milne/moontale","license":"MIT","image":"icon.svg","source":"<!doctype html><html><head><meta charset=\"utf-8\"/><title>{{STORY_NAME}}</title><style type=\"text/css\">*{transition:all .2s ease}#wrapper{margin:0 auto;max-width:600px;padding:50px 20px;position:relative}#lua,#outputContainer{position:absolute}pre{white-space:pre-wrap}#lua,#output{opacity:0}#lua{visibility:hidden}#storyData{display:none}#outputToggle{align-items:center;bottom:20px;display:flex;margin:10px;position:fixed}.toggleIcon{height:1.5em;margin:10px;vertical-align:-.225em}html{background:beige}#download{bottom:20px;margin:10px;position:fixed;right:20px}#download>svg{height:3em;transition:none}#download>svg:hover{fill:#6a5acd}li::marker{font-size:x-large}p{font-family:Garamond;font-size:x-large}a{color:#8b0000;text-decoration:none}a:hover{color:red}.switch{display:inline-block;height:34px;position:relative;width:60px}.switch input{height:0;opacity:0;width:0}.slider{background-color:#ccc;bottom:0;cursor:pointer;left:0;right:0;top:0}.slider,.slider:before{position:absolute;-webkit-transition:.4s;transition:.4s}.slider:before{background-color:#fff;bottom:4px;content:\"\";height:26px;left:4px;width:26px}input:checked+.slider{background-color:#2196f3}input:focus+.slider{box-shadow:0 0 1px #2196f3}input:checked+.slider:before{-webkit-transform:translateX(26px);-ms-transform:translateX(26px);transform:translateX(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}\n/*# sourceMappingURL=main.css.map*/</style></head><body><span id=\"outputToggle\"><img inline class=\"toggleIcon\" src=\"dist/icons/book-open.svg\"> <label class=\"switch\"><input id=\"outputToggleInput\" type=\"checkbox\"> <span class=\"slider round\"></span></label> <img class=\"toggleIcon\" inline src=\"dist/icons/code.svg\"> </span><a id=\"download\" href=\"#\"><img inline src=\"dist/icons/file-download.svg\"></a><div id=\"wrapper\"><div id=\"outputContainer\"><div id=\"output\"></div></div><pre id=\"lua\"></pre></div><div id=\"storyData\">{{STORY_DATA}}</div><script defer=\"defer\" src=\"http://localhost:9000/bundle.js\"></script></body></html>"});