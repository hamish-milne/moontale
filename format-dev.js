window.storyFormat({
    name: "Moontale",
    version: "0.0.0",
    author: "Hamish Milne",
    description: "A Twine 2 story format that outputs Lua",
    proofing: false,
    url: "https://github.com/hamish-milne/moontale",
    license: "MIT",
    image: 'icon.svg',
    source: "<!doctype html><html><head><meta charset=\"utf-8\"/><title>{{STORY_NAME}}</title><style type=\"text/css\">*{transition:all .2s ease}#wrapper{margin:0 auto;max-width:600px;padding:50px 20px;position:relative}#lua,#outputContainer{position:absolute}pre{white-space:pre-wrap}#lua,#output{opacity:0}#lua,#storyData{display:none}#outputToggle{align-items:center;bottom:20px;display:flex;margin:10px;position:fixed}.toggleIcon{height:1.5em;margin:10px;vertical-align:-.225em}html{background:beige}#download{bottom:20px;margin:10px;position:fixed;right:20px}#download>svg{height:3em;transition:none}#download>svg:hover{fill:#6a5acd}li::marker{font-size:x-large}p{font-family:Garamond;font-size:x-large}a{color:auto;text-decoration:none}.switch{display:inline-block;height:34px;position:relative;width:60px}.switch input{height:0;opacity:0;width:0}.slider{background-color:#ccc;bottom:0;cursor:pointer;left:0;right:0;top:0}.slider,.slider:before{position:absolute;-webkit-transition:.4s;transition:.4s}.slider:before{background-color:#fff;bottom:4px;content:\"\";height:26px;left:4px;width:26px}input:checked+.slider{background-color:#2196f3}input:focus+.slider{box-shadow:0 0 1px #2196f3}input:checked+.slider:before{-webkit-transform:translateX(26px);-ms-transform:translateX(26px);transform:translateX(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}\n/*# sourceMappingURL=bundle.css.map*/</style></head><body><div id=\"wrapper\"><div id=\"outputContainer\"><div id=\"output\"></div></div><pre id=\"lua\"></pre></div><span id=\"outputToggle\"><svg class=\"toggleIcon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 576 512\"><path d=\"M542.22 32.05c-54.8 3.11-163.72 14.43-230.96 55.59-4.64 2.84-7.27 7.89-7.27 13.17v363.87c0 11.55 12.63 18.85 23.28 13.49 69.18-34.82 169.23-44.32 218.7-46.92 16.89-.89 30.02-14.43 30.02-30.66V62.75c.01-17.71-15.35-31.74-33.77-30.7zM264.73 87.64C197.5 46.48 88.58 35.17 33.78 32.05 15.36 31.01 0 45.04 0 62.75V400.6c0 16.24 13.13 29.78 30.02 30.66 49.49 2.6 149.59 12.11 218.77 46.95 10.62 5.35 23.21-1.94 23.21-13.46V100.63c0-5.29-2.62-10.14-7.27-12.99z\"/></svg> <label class=\"switch\"><input id=\"outputToggleInput\" type=\"checkbox\"> <span class=\"slider round\"></span></label> <svg class=\"toggleIcon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 512\"><path d=\"M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z\"/></svg> </span><a id=\"download\" href=\"#\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 384 512\"><path d=\"M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm76.45 211.36l-96.42 95.7c-6.65 6.61-17.39 6.61-24.04 0l-96.42-95.7C73.42 337.29 80.54 320 94.82 320H160v-80c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v80h65.18c14.28 0 21.4 17.29 11.27 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z\"/></svg></a><div id=\"storyData\">{{STORY_DATA}}</div><script defer=\"defer\" src=\"http://localhost:9000/bundle.js\"></script></body></html>",
    setup: function(){(()=>{var e={7093:()=>{!function(e){"use strict";e.multiplexingMode=function(t){var n=Array.prototype.slice.call(arguments,1);function i(e,t,n,i){if("string"==typeof t){var r=e.indexOf(t,n);return i&&r>-1?r+t.length:r}var a=t.exec(n?e.slice(n):e);return a?a.index+n+(i?a[0].length:0):-1}return{startState:function(){return{outer:e.startState(t),innerActive:null,inner:null,startingInner:!1}},copyState:function(n){return{outer:e.copyState(t,n.outer),innerActive:n.innerActive,inner:n.innerActive&&e.copyState(n.innerActive.mode,n.inner),startingInner:n.startingInner}},token:function(r,a){if(a.innerActive){var o=a.innerActive;if(s=r.string,!o.close&&r.sol())return a.innerActive=a.inner=null,this.token(r,a);if((d=o.close&&!a.startingInner?i(s,o.close,r.pos,o.parseDelimiters):-1)==r.pos&&!o.parseDelimiters)return r.match(o.close),a.innerActive=a.inner=null,o.delimStyle&&o.delimStyle+" "+o.delimStyle+"-close";d>-1&&(r.string=s.slice(0,d));var l=o.mode.token(r,a.inner);return d>-1?r.string=s:r.pos>r.start&&(a.startingInner=!1),d==r.pos&&o.parseDelimiters&&(a.innerActive=a.inner=null),o.innerStyle&&(l=l?l+" "+o.innerStyle:o.innerStyle),l}for(var u=1/0,s=r.string,c=0;c<n.length;++c){var d,g=n[c];if((d=i(s,g.open,r.pos))==r.pos){g.parseDelimiters||r.match(g.open),a.startingInner=!!g.parseDelimiters,a.innerActive=g;var h=0;if(t.indent){var m=t.indent(a.outer,"","");m!==e.Pass&&(h=m)}return a.inner=e.startState(g.mode,h),g.delimStyle&&g.delimStyle+" "+g.delimStyle+"-open"}-1!=d&&d<u&&(u=d)}u!=1/0&&(r.string=s.slice(0,u));var f=t.token(r,a.outer);return u!=1/0&&(r.string=s),f},indent:function(n,i,r){var a=n.innerActive?n.innerActive.mode:t;return a.indent?a.indent(n.innerActive?n.inner:n.outer,i,r):e.Pass},blankLine:function(i){var r=i.innerActive?i.innerActive.mode:t;if(r.blankLine&&r.blankLine(i.innerActive?i.inner:i.outer),i.innerActive)"\n"===i.innerActive.close&&(i.innerActive=i.inner=null);else for(var a=0;a<n.length;++a){var o=n[a];"\n"===o.open&&(i.innerActive=o,i.inner=e.startState(o.mode,r.indent?r.indent(i.outer,"",""):0))}},electricChars:t.electricChars,innerMode:function(e){return e.inner?{state:e.inner,mode:e.innerActive.mode}:{state:e.outer,mode:t}}}}}(CodeMirror)},4146:()=>{!function(e){"use strict";e.overlayMode=function(t,n,i){return{startState:function(){return{base:e.startState(t),overlay:e.startState(n),basePos:0,baseCur:null,overlayPos:0,overlayCur:null,streamSeen:null}},copyState:function(i){return{base:e.copyState(t,i.base),overlay:e.copyState(n,i.overlay),basePos:i.basePos,baseCur:null,overlayPos:i.overlayPos,overlayCur:null}},token:function(e,r){return(e!=r.streamSeen||Math.min(r.basePos,r.overlayPos)<e.start)&&(r.streamSeen=e,r.basePos=r.overlayPos=e.start),e.start==r.basePos&&(r.baseCur=t.token(e,r.base),r.basePos=e.pos),e.start==r.overlayPos&&(e.pos=e.start,r.overlayCur=n.token(e,r.overlay),r.overlayPos=e.pos),e.pos=Math.min(r.basePos,r.overlayPos),null==r.overlayCur?r.baseCur:null!=r.baseCur&&r.overlay.combineTokens||i&&null==r.overlay.combineTokens?r.baseCur+" "+r.overlayCur:r.overlayCur},indent:t.indent&&function(e,n,i){return t.indent(e.base,n,i)},electricChars:t.electricChars,innerMode:function(e){return{state:e.base,mode:t}},blankLine:function(e){var r,a;return t.blankLine&&(r=t.blankLine(e.base)),n.blankLine&&(a=n.blankLine(e.overlay)),null==a?r:i&&null!=r?r+" "+a:a}}}}(CodeMirror)},790:()=>{!function(e){"use strict";function t(e,t){if(!e.hasOwnProperty(t))throw new Error("Undefined state "+t+" in simple mode")}function n(e,t){if(!e)return/(?:)/;var n="";return e instanceof RegExp?(e.ignoreCase&&(n="i"),e=e.source):e=String(e),new RegExp((!1===t?"":"^")+"(?:"+e+")",n)}function i(e,i){(e.next||e.push)&&t(i,e.next||e.push),this.regex=n(e.regex),this.token=function(e){if(!e)return null;if(e.apply)return e;if("string"==typeof e)return e.replace(/\./g," ");for(var t=[],n=0;n<e.length;n++)t.push(e[n]&&e[n].replace(/\./g," "));return t}(e.token),this.data=e}function r(e,t){return function(n,i){if(i.pending){var r=i.pending.shift();return 0==i.pending.length&&(i.pending=null),n.pos+=r.text.length,r.token}if(i.local){if(i.local.end&&n.match(i.local.end)){var a=i.local.endToken||null;return i.local=i.localState=null,a}var l;return a=i.local.mode.token(n,i.localState),i.local.endScan&&(l=i.local.endScan.exec(n.current()))&&(n.pos=n.start+l.index),a}for(var u=e[i.state],s=0;s<u.length;s++){var c=u[s],d=(!c.data.sol||n.sol())&&n.match(c.regex);if(d){c.data.next?i.state=c.data.next:c.data.push?((i.stack||(i.stack=[])).push(i.state),i.state=c.data.push):c.data.pop&&i.stack&&i.stack.length&&(i.state=i.stack.pop()),c.data.mode&&o(t,i,c.data.mode,c.token),c.data.indent&&i.indent.push(n.indentation()+t.indentUnit),c.data.dedent&&i.indent.pop();var g=c.token;if(g&&g.apply&&(g=g(d)),d.length>2&&c.token&&"string"!=typeof c.token){for(var h=2;h<d.length;h++)d[h]&&(i.pending||(i.pending=[])).push({text:d[h],token:c.token[h-1]});return n.backUp(d[0].length-(d[1]?d[1].length:0)),g[0]}return g&&g.join?g[0]:g}}return n.next(),null}}function a(e,t){if(e===t)return!0;if(!e||"object"!=typeof e||!t||"object"!=typeof t)return!1;var n=0;for(var i in e)if(e.hasOwnProperty(i)){if(!t.hasOwnProperty(i)||!a(e[i],t[i]))return!1;n++}for(var i in t)t.hasOwnProperty(i)&&n--;return 0==n}function o(t,i,r,o){var l;if(r.persistent)for(var u=i.persistentStates;u&&!l;u=u.next)(r.spec?a(r.spec,u.spec):r.mode==u.mode)&&(l=u);var s=l?l.mode:r.mode||e.getMode(t,r.spec),c=l?l.state:e.startState(s);r.persistent&&!l&&(i.persistentStates={mode:s,spec:r.spec,state:c,next:i.persistentStates}),i.localState=c,i.local={mode:s,end:r.end&&n(r.end),endScan:r.end&&!1!==r.forceEnd&&n(r.end,!1),endToken:o&&o.join?o[o.length-1]:o}}function l(t,n){return function(i,r,a){if(i.local&&i.local.mode.indent)return i.local.mode.indent(i.localState,r,a);if(null==i.indent||i.local||n.dontIndentStates&&function(e,t){for(var n=0;n<t.length;n++)if(t[n]===e)return!0}(i.state,n.dontIndentStates)>-1)return e.Pass;var o=i.indent.length-1,l=t[i.state];e:for(;;){for(var u=0;u<l.length;u++){var s=l[u];if(s.data.dedent&&!1!==s.data.dedentIfLineStart){var c=s.regex.exec(r);if(c&&c[0]){o--,(s.next||s.push)&&(l=t[s.next||s.push]),r=r.slice(c[0].length);continue e}}}break}return o<0?0:i.indent[o]}}e.defineSimpleMode=function(t,n){e.defineMode(t,(function(t){return e.simpleMode(t,n)}))},e.simpleMode=function(n,a){t(a,"start");var o={},u=a.meta||{},s=!1;for(var c in a)if(c!=u&&a.hasOwnProperty(c))for(var d=o[c]=[],g=a[c],h=0;h<g.length;h++){var m=g[h];d.push(new i(m,a)),(m.indent||m.dedent)&&(s=!0)}var f={startState:function(){return{state:"start",pending:null,local:null,localState:null,indent:s?[]:null}},copyState:function(t){var n={state:t.state,pending:t.pending,local:t.local,localState:null,indent:t.indent&&t.indent.slice(0)};t.localState&&(n.localState=e.copyState(t.local.mode,t.localState)),t.stack&&(n.stack=t.stack.slice(0));for(var i=t.persistentStates;i;i=i.next)n.persistentStates={mode:i.mode,spec:i.spec,state:i.state==t.localState?n.localState:e.copyState(i.mode,i.state),next:n.persistentStates};return n},token:r(o,n),innerMode:function(e){return e.local&&{mode:e.local.mode,state:e.localState}},indent:l(o,u)};if(u)for(var p in u)u.hasOwnProperty(p)&&(f[p]=u[p]);return f}}(CodeMirror)},7745:()=>{!function(e){"use strict";e.defineMode("lua",(function(e,t){var n=e.indentUnit;function i(e){return new RegExp("^(?:"+e.join("|")+")$","i")}var r=i(t.specials||[]),a=i(["_G","_VERSION","assert","collectgarbage","dofile","error","getfenv","getmetatable","ipairs","load","loadfile","loadstring","module","next","pairs","pcall","print","rawequal","rawget","rawset","require","select","setfenv","setmetatable","tonumber","tostring","type","unpack","xpcall","coroutine.create","coroutine.resume","coroutine.running","coroutine.status","coroutine.wrap","coroutine.yield","debug.debug","debug.getfenv","debug.gethook","debug.getinfo","debug.getlocal","debug.getmetatable","debug.getregistry","debug.getupvalue","debug.setfenv","debug.sethook","debug.setlocal","debug.setmetatable","debug.setupvalue","debug.traceback","close","flush","lines","read","seek","setvbuf","write","io.close","io.flush","io.input","io.lines","io.open","io.output","io.popen","io.read","io.stderr","io.stdin","io.stdout","io.tmpfile","io.type","io.write","math.abs","math.acos","math.asin","math.atan","math.atan2","math.ceil","math.cos","math.cosh","math.deg","math.exp","math.floor","math.fmod","math.frexp","math.huge","math.ldexp","math.log","math.log10","math.max","math.min","math.modf","math.pi","math.pow","math.rad","math.random","math.randomseed","math.sin","math.sinh","math.sqrt","math.tan","math.tanh","os.clock","os.date","os.difftime","os.execute","os.exit","os.getenv","os.remove","os.rename","os.setlocale","os.time","os.tmpname","package.cpath","package.loaded","package.loaders","package.loadlib","package.path","package.preload","package.seeall","string.byte","string.char","string.dump","string.find","string.format","string.gmatch","string.gsub","string.len","string.lower","string.match","string.rep","string.reverse","string.sub","string.upper","table.concat","table.insert","table.maxn","table.remove","table.sort"]),o=i(["and","break","elseif","false","nil","not","or","return","true","function","end","if","then","else","do","while","repeat","until","for","in","local"]),l=i(["function","if","repeat","do","\\(","{"]),u=i(["end","until","\\)","}"]),s=new RegExp("^(?:"+["end","until","\\)","}","else","elseif"].join("|")+")","i");function c(e){for(var t=0;e.eat("=");)++t;return e.eat("["),t}function d(e,t){var n,i=e.next();return"-"==i&&e.eat("-")?e.eat("[")&&e.eat("[")?(t.cur=g(c(e),"comment"))(e,t):(e.skipToEnd(),"comment"):'"'==i||"'"==i?(t.cur=(n=i,function(e,t){for(var i,r=!1;null!=(i=e.next())&&(i!=n||r);)r=!r&&"\\"==i;return r||(t.cur=d),"string"}))(e,t):"["==i&&/[\[=]/.test(e.peek())?(t.cur=g(c(e),"string"))(e,t):/\d/.test(i)?(e.eatWhile(/[\w.%]/),"number"):/[\w_]/.test(i)?(e.eatWhile(/[\w\\\-_.]/),"variable"):null}function g(e,t){return function(n,i){for(var r,a=null;null!=(r=n.next());)if(null==a)"]"==r&&(a=0);else if("="==r)++a;else{if("]"==r&&a==e){i.cur=d;break}a=null}return t}}return{startState:function(e){return{basecol:e||0,indentDepth:0,cur:d}},token:function(e,t){if(e.eatSpace())return null;var n=t.cur(e,t),i=e.current();return"variable"==n&&(o.test(i)?n="keyword":a.test(i)?n="builtin":r.test(i)&&(n="variable-2")),"comment"!=n&&"string"!=n&&(l.test(i)?++t.indentDepth:u.test(i)&&--t.indentDepth),n},indent:function(e,t){var i=s.test(t);return e.basecol+n*(e.indentDepth-(i?1:0))},electricInput:/^\s*(?:end|until|else|\)|\})$/,lineComment:"--",blockCommentStart:"--[[",blockCommentEnd:"]]"}})),e.defineMIME("text/x-lua","lua")}(CodeMirror)},9047:()=>{!function(e){"use strict";e.defineMode("markdown",(function(t,n){var i=e.getMode(t,"text/html"),r="null"==i.name;void 0===n.highlightFormatting&&(n.highlightFormatting=!1),void 0===n.maxBlockquoteDepth&&(n.maxBlockquoteDepth=0),void 0===n.taskLists&&(n.taskLists=!1),void 0===n.strikethrough&&(n.strikethrough=!1),void 0===n.emoji&&(n.emoji=!1),void 0===n.fencedCodeBlockHighlighting&&(n.fencedCodeBlockHighlighting=!0),void 0===n.fencedCodeBlockDefaultMode&&(n.fencedCodeBlockDefaultMode="text/plain"),void 0===n.xml&&(n.xml=!0),void 0===n.tokenTypeOverrides&&(n.tokenTypeOverrides={});var a={header:"header",code:"comment",quote:"quote",list1:"variable-2",list2:"variable-3",list3:"keyword",hr:"hr",image:"image",imageAltText:"image-alt-text",imageMarker:"image-marker",formatting:"formatting",linkInline:"link",linkEmail:"link",linkText:"link",linkHref:"string",em:"em",strong:"strong",strikethrough:"strikethrough",emoji:"builtin"};for(var o in a)a.hasOwnProperty(o)&&n.tokenTypeOverrides[o]&&(a[o]=n.tokenTypeOverrides[o]);var l=/^([*\-_])(?:\s*\1){2,}\s*$/,u=/^(?:[*\-+]|^[0-9]+([.)]))\s+/,s=/^\[(x| )\](?=\s)/i,c=n.allowAtxHeaderWithoutSpace?/^(#+)/:/^(#+)(?: |$)/,d=/^ {0,3}(?:\={1,}|-{2,})\s*$/,g=/^[^#!\[\]*_\\<>` "'(~:]+/,h=/^(~~~+|```+)[ \t]*([\w\/+#-]*)[^\n`]*$/,m=/^\s*\[[^\]]+?\]:.*$/,f=/[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]/;function p(e,t,n){return t.f=t.inline=n,n(e,t)}function k(e,t,n){return t.f=t.block=n,n(e,t)}function v(t){if(t.linkTitle=!1,t.linkHref=!1,t.linkText=!1,t.em=!1,t.strong=!1,t.strikethrough=!1,t.quote=0,t.indentedCode=!1,t.f==D){var n=r;if(!n){var a=e.innerMode(i,t.htmlState);n="xml"==a.mode.name&&null===a.state.tagStart&&!a.state.context&&a.state.tokenize.isInText}n&&(t.f=A,t.block=F,t.htmlState=null)}return t.trailingSpace=0,t.trailingSpaceNewLine=!1,t.prevLine=t.thisLine,t.thisLine={stream:null},null}function F(i,r){var o,g=i.column()===r.indentation,f=!(o=r.prevLine.stream)||!/\S/.test(o.string),k=r.indentedCode,v=r.prevLine.hr,F=!1!==r.list,D=(r.listStack[r.listStack.length-1]||0)+3;r.indentedCode=!1;var b=r.indentation;if(null===r.indentationDiff&&(r.indentationDiff=r.indentation,F)){for(r.list=null;b<r.listStack[r.listStack.length-1];)r.listStack.pop(),r.listStack.length?r.indentation=r.listStack[r.listStack.length-1]:r.list=!1;!1!==r.list&&(r.indentationDiff=b-r.listStack[r.listStack.length-1])}var A=!(f||v||r.prevLine.header||F&&k||r.prevLine.fencedCodeEnd),C=(!1===r.list||v||f)&&r.indentation<=D&&i.match(l),E=null;if(r.indentationDiff>=4&&(k||r.prevLine.fencedCodeEnd||r.prevLine.header||f))return i.skipToEnd(),r.indentedCode=!0,a.code;if(i.eatSpace())return null;if(g&&r.indentation<=D&&(E=i.match(c))&&E[1].length<=6)return r.quote=0,r.header=E[1].length,r.thisLine.header=!0,n.highlightFormatting&&(r.formatting="header"),r.f=r.inline,S(r);if(r.indentation<=D&&i.eat(">"))return r.quote=g?1:r.quote+1,n.highlightFormatting&&(r.formatting="quote"),i.eatSpace(),S(r);if(!C&&!r.setext&&g&&r.indentation<=D&&(E=i.match(u))){var y=E[1]?"ol":"ul";return r.indentation=b+i.current().length,r.list=!0,r.quote=0,r.listStack.push(r.indentation),r.em=!1,r.strong=!1,r.code=!1,r.strikethrough=!1,n.taskLists&&i.match(s,!1)&&(r.taskList=!0),r.f=r.inline,n.highlightFormatting&&(r.formatting=["list","list-"+y]),S(r)}return g&&r.indentation<=D&&(E=i.match(h,!0))?(r.quote=0,r.fencedEndRE=new RegExp(E[1]+"+ *$"),r.localMode=n.fencedCodeBlockHighlighting&&function(n){if(e.findModeByName){var i=e.findModeByName(n);i&&(n=i.mime||i.mimes[0])}var r=e.getMode(t,n);return"null"==r.name?null:r}(E[2]||n.fencedCodeBlockDefaultMode),r.localMode&&(r.localState=e.startState(r.localMode)),r.f=r.block=x,n.highlightFormatting&&(r.formatting="code-block"),r.code=-1,S(r)):r.setext||!(A&&F||r.quote||!1!==r.list||r.code||C||m.test(i.string))&&(E=i.lookAhead(1))&&(E=E.match(d))?(r.setext?(r.header=r.setext,r.setext=0,i.skipToEnd(),n.highlightFormatting&&(r.formatting="header")):(r.header="="==E[0].charAt(0)?1:2,r.setext=r.header),r.thisLine.header=!0,r.f=r.inline,S(r)):C?(i.skipToEnd(),r.hr=!0,r.thisLine.hr=!0,a.hr):"["===i.peek()?p(i,r,M):p(i,r,r.inline)}function D(t,n){var a=i.token(t,n.htmlState);if(!r){var o=e.innerMode(i,n.htmlState);("xml"==o.mode.name&&null===o.state.tagStart&&!o.state.context&&o.state.tokenize.isInText||n.md_inside&&t.current().indexOf(">")>-1)&&(n.f=A,n.block=F,n.htmlState=null)}return a}function x(e,t){var i,r=t.listStack[t.listStack.length-1]||0,o=t.indentation<r,l=r+3;return t.fencedEndRE&&t.indentation<=l&&(o||e.match(t.fencedEndRE))?(n.highlightFormatting&&(t.formatting="code-block"),o||(i=S(t)),t.localMode=t.localState=null,t.block=F,t.f=A,t.fencedEndRE=null,t.code=0,t.thisLine.fencedCodeEnd=!0,o?k(e,t,t.block):i):t.localMode?t.localMode.token(e,t.localState):(e.skipToEnd(),a.code)}function S(e){var t=[];if(e.formatting){t.push(a.formatting),"string"==typeof e.formatting&&(e.formatting=[e.formatting]);for(var i=0;i<e.formatting.length;i++)t.push(a.formatting+"-"+e.formatting[i]),"header"===e.formatting[i]&&t.push(a.formatting+"-"+e.formatting[i]+"-"+e.header),"quote"===e.formatting[i]&&(!n.maxBlockquoteDepth||n.maxBlockquoteDepth>=e.quote?t.push(a.formatting+"-"+e.formatting[i]+"-"+e.quote):t.push("error"))}if(e.taskOpen)return t.push("meta"),t.length?t.join(" "):null;if(e.taskClosed)return t.push("property"),t.length?t.join(" "):null;if(e.linkHref?t.push(a.linkHref,"url"):(e.strong&&t.push(a.strong),e.em&&t.push(a.em),e.strikethrough&&t.push(a.strikethrough),e.emoji&&t.push(a.emoji),e.linkText&&t.push(a.linkText),e.code&&t.push(a.code),e.image&&t.push(a.image),e.imageAltText&&t.push(a.imageAltText,"link"),e.imageMarker&&t.push(a.imageMarker)),e.header&&t.push(a.header,a.header+"-"+e.header),e.quote&&(t.push(a.quote),!n.maxBlockquoteDepth||n.maxBlockquoteDepth>=e.quote?t.push(a.quote+"-"+e.quote):t.push(a.quote+"-"+n.maxBlockquoteDepth)),!1!==e.list){var r=(e.listStack.length-1)%3;r?1===r?t.push(a.list2):t.push(a.list3):t.push(a.list1)}return e.trailingSpaceNewLine?t.push("trailing-space-new-line"):e.trailingSpace&&t.push("trailing-space-"+(e.trailingSpace%2?"a":"b")),t.length?t.join(" "):null}function b(e,t){if(e.match(g,!0))return S(t)}function A(t,r){var o=r.text(t,r);if(void 0!==o)return o;if(r.list)return r.list=null,S(r);if(r.taskList)return" "===t.match(s,!0)[1]?r.taskOpen=!0:r.taskClosed=!0,n.highlightFormatting&&(r.formatting="task"),r.taskList=!1,S(r);if(r.taskOpen=!1,r.taskClosed=!1,r.header&&t.match(/^#+$/,!0))return n.highlightFormatting&&(r.formatting="header"),S(r);var l=t.next();if(r.linkTitle){r.linkTitle=!1;var u=l;"("===l&&(u=")");var c="^\\s*(?:[^"+(u=(u+"").replace(/([.?*+^\[\]\\(){}|-])/g,"\\$1"))+"\\\\]+|\\\\\\\\|\\\\.)"+u;if(t.match(new RegExp(c),!0))return a.linkHref}if("`"===l){var d=r.formatting;n.highlightFormatting&&(r.formatting="code"),t.eatWhile("`");var g=t.current().length;if(0!=r.code||r.quote&&1!=g){if(g==r.code){var h=S(r);return r.code=0,h}return r.formatting=d,S(r)}return r.code=g,S(r)}if(r.code)return S(r);if("\\"===l&&(t.next(),n.highlightFormatting)){var m=S(r),p=a.formatting+"-escape";return m?m+" "+p:p}if("!"===l&&t.match(/\[[^\]]*\] ?(?:\(|\[)/,!1))return r.imageMarker=!0,r.image=!0,n.highlightFormatting&&(r.formatting="image"),S(r);if("["===l&&r.imageMarker&&t.match(/[^\]]*\](\(.*?\)| ?\[.*?\])/,!1))return r.imageMarker=!1,r.imageAltText=!0,n.highlightFormatting&&(r.formatting="image"),S(r);if("]"===l&&r.imageAltText){n.highlightFormatting&&(r.formatting="image");m=S(r);return r.imageAltText=!1,r.image=!1,r.inline=r.f=E,m}if("["===l&&!r.image)return r.linkText&&t.match(/^.*?\]/)||(r.linkText=!0,n.highlightFormatting&&(r.formatting="link")),S(r);if("]"===l&&r.linkText){n.highlightFormatting&&(r.formatting="link");m=S(r);return r.linkText=!1,r.inline=r.f=t.match(/\(.*?\)| ?\[.*?\]/,!1)?E:A,m}if("<"===l&&t.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/,!1))return r.f=r.inline=C,n.highlightFormatting&&(r.formatting="link"),(m=S(r))?m+=" ":m="",m+a.linkInline;if("<"===l&&t.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/,!1))return r.f=r.inline=C,n.highlightFormatting&&(r.formatting="link"),(m=S(r))?m+=" ":m="",m+a.linkEmail;if(n.xml&&"<"===l&&t.match(/^(!--|\?|!\[CDATA\[|[a-z][a-z0-9-]*(?:\s+[a-z_:.\-]+(?:\s*=\s*[^>]+)?)*\s*(?:>|$))/i,!1)){var v=t.string.indexOf(">",t.pos);if(-1!=v){var F=t.string.substring(t.start,v);/markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(F)&&(r.md_inside=!0)}return t.backUp(1),r.htmlState=e.startState(i),k(t,r,D)}if(n.xml&&"<"===l&&t.match(/^\/\w*?>/))return r.md_inside=!1,"tag";if("*"===l||"_"===l){for(var x=1,b=1==t.pos?" ":t.string.charAt(t.pos-2);x<3&&t.eat(l);)x++;var y=t.peek()||" ",M=!/\s/.test(y)&&(!f.test(y)||/\s/.test(b)||f.test(b)),w=!/\s/.test(b)&&(!f.test(b)||/\s/.test(y)||f.test(y)),L=null,B=null;if(x%2&&(r.em||!M||"*"!==l&&w&&!f.test(b)?r.em!=l||!w||"*"!==l&&M&&!f.test(y)||(L=!1):L=!0),x>1&&(r.strong||!M||"*"!==l&&w&&!f.test(b)?r.strong!=l||!w||"*"!==l&&M&&!f.test(y)||(B=!1):B=!0),null!=B||null!=L)return n.highlightFormatting&&(r.formatting=null==L?"strong":null==B?"em":"strong em"),!0===L&&(r.em=l),!0===B&&(r.strong=l),h=S(r),!1===L&&(r.em=!1),!1===B&&(r.strong=!1),h}else if(" "===l&&(t.eat("*")||t.eat("_"))){if(" "===t.peek())return S(r);t.backUp(1)}if(n.strikethrough)if("~"===l&&t.eatWhile(l)){if(r.strikethrough)return n.highlightFormatting&&(r.formatting="strikethrough"),h=S(r),r.strikethrough=!1,h;if(t.match(/^[^\s]/,!1))return r.strikethrough=!0,n.highlightFormatting&&(r.formatting="strikethrough"),S(r)}else if(" "===l&&t.match("~~",!0)){if(" "===t.peek())return S(r);t.backUp(2)}if(n.emoji&&":"===l&&t.match(/^(?:[a-z_\d+][a-z_\d+-]*|\-[a-z_\d+][a-z_\d+-]*):/)){r.emoji=!0,n.highlightFormatting&&(r.formatting="emoji");var T=S(r);return r.emoji=!1,T}return" "===l&&(t.match(/^ +$/,!1)?r.trailingSpace++:r.trailingSpace&&(r.trailingSpaceNewLine=!0)),S(r)}function C(e,t){if(">"===e.next()){t.f=t.inline=A,n.highlightFormatting&&(t.formatting="link");var i=S(t);return i?i+=" ":i="",i+a.linkInline}return e.match(/^[^>]+/,!0),a.linkInline}function E(e,t){if(e.eatSpace())return null;var i,r=e.next();return"("===r||"["===r?(t.f=t.inline=(i="("===r?")":"]",function(e,t){if(e.next()===i){t.f=t.inline=A,n.highlightFormatting&&(t.formatting="link-string");var r=S(t);return t.linkHref=!1,r}return e.match(y[i]),t.linkHref=!0,S(t)}),n.highlightFormatting&&(t.formatting="link-string"),t.linkHref=!0,S(t)):"error"}var y={")":/^(?:[^\\\(\)]|\\.|\((?:[^\\\(\)]|\\.)*\))*?(?=\))/,"]":/^(?:[^\\\[\]]|\\.|\[(?:[^\\\[\]]|\\.)*\])*?(?=\])/};function M(e,t){return e.match(/^([^\]\\]|\\.)*\]:/,!1)?(t.f=w,e.next(),n.highlightFormatting&&(t.formatting="link"),t.linkText=!0,S(t)):p(e,t,A)}function w(e,t){if(e.match("]:",!0)){t.f=t.inline=L,n.highlightFormatting&&(t.formatting="link");var i=S(t);return t.linkText=!1,i}return e.match(/^([^\]\\]|\\.)+/,!0),a.linkText}function L(e,t){return e.eatSpace()?null:(e.match(/^[^\s]+/,!0),void 0===e.peek()?t.linkTitle=!0:e.match(/^(?:\s+(?:"(?:[^"\\]|\\.)+"|'(?:[^'\\]|\\.)+'|\((?:[^)\\]|\\.)+\)))?/,!0),t.f=t.inline=A,a.linkHref+" url")}var B={startState:function(){return{f:F,prevLine:{stream:null},thisLine:{stream:null},block:F,htmlState:null,indentation:0,inline:A,text:b,formatting:!1,linkText:!1,linkHref:!1,linkTitle:!1,code:0,em:!1,strong:!1,header:0,setext:0,hr:!1,taskList:!1,list:!1,listStack:[],quote:0,trailingSpace:0,trailingSpaceNewLine:!1,strikethrough:!1,emoji:!1,fencedEndRE:null}},copyState:function(t){return{f:t.f,prevLine:t.prevLine,thisLine:t.thisLine,block:t.block,htmlState:t.htmlState&&e.copyState(i,t.htmlState),indentation:t.indentation,localMode:t.localMode,localState:t.localMode?e.copyState(t.localMode,t.localState):null,inline:t.inline,text:t.text,formatting:!1,linkText:t.linkText,linkTitle:t.linkTitle,linkHref:t.linkHref,code:t.code,em:t.em,strong:t.strong,strikethrough:t.strikethrough,emoji:t.emoji,header:t.header,setext:t.setext,hr:t.hr,taskList:t.taskList,list:t.list,listStack:t.listStack.slice(0),quote:t.quote,indentedCode:t.indentedCode,trailingSpace:t.trailingSpace,trailingSpaceNewLine:t.trailingSpaceNewLine,md_inside:t.md_inside,fencedEndRE:t.fencedEndRE}},token:function(e,t){if(t.formatting=!1,e!=t.thisLine.stream){if(t.header=0,t.hr=!1,e.match(/^\s*$/,!0))return v(t),null;if(t.prevLine=t.thisLine,t.thisLine={stream:e},t.taskList=!1,t.trailingSpace=0,t.trailingSpaceNewLine=!1,!t.localState&&(t.f=t.block,t.f!=D)){var n=e.match(/^\s*/,!0)[0].replace(/\t/g,"    ").length;if(t.indentation=n,t.indentationDiff=null,n>0)return null}}return t.f(e,t)},innerMode:function(e){return e.block==D?{state:e.htmlState,mode:i}:e.localState?{state:e.localState,mode:e.localMode}:{state:e,mode:B}},indent:function(t,n,r){return t.block==D&&i.indent?i.indent(t.htmlState,n,r):t.localState&&t.localMode.indent?t.localMode.indent(t.localState,n,r):e.Pass},blankLine:v,getType:S,blockCommentStart:"\x3c!--",blockCommentEnd:"--\x3e",closeBrackets:"()[]{}''\"\"``",fold:"markdown"};return B}),"xml"),e.defineMIME("text/markdown","markdown"),e.defineMIME("text/x-markdown","markdown")}(CodeMirror)},5056:function(e,t,n){"use strict";var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),n(7093),n(4146),n(790),n(9047),n(7745);var r=i(n(4337)),a=document.querySelector("style#cm-moontale");a||((a=document.createElement("style")).setAttribute("id","cm-moontale"),document.head.appendChild(a)),a.innerHTML=r.default,window.CodeMirror.defineSimpleMode("moontale",{start:[{regex:/\{\$/,token:"tag",mode:{spec:"lua",end:/\$\}/}},{regex:/\<\$/,token:"tag",mode:{spec:"lua",end:/\$\>/}},{regex:/\$[A-Za-z_]\w*/,token:"variable-2",push:"expression"},{regex:/(\[\[)(.*?)(<\-)/,token:["bracket","link","special","bracket"]},{regex:/(\[\[)((?:(?!->).)*?)(\]\])/,token:["bracket","link","bracket"]},{regex:/\[\[/,token:"bracket"},{regex:/(->)(.*?)(]])/,token:["special","link","bracket"]},{regex:/(->)/,token:"special"},{regex:/]]/,token:"bracket"},{regex:/\[|]/,token:"tag"},{regex:/-|\{|<|\[|]|\$/},{regex:/(?!\$)/,mode:{spec:"markdown",end:/(?=-|\{|<|\[|]|\$)/,persistent:!0}}],expression:[{sol:!0,pop:!0},{regex:/<</,token:"bracket",mode:{spec:"lua",end:/>>/}},{regex:/(\.)(\w+)/,token:["punctuation","variable"],next:"expression"},{regex:/\(/,token:"bracket",mode:{spec:"lua",end:/\)/}},{regex:/\{/,token:"bracket",mode:{spec:"lua",end:/\}/}},{regex:"",pop:!0}]})},4337:e=>{"use strict";e.exports=".cm-ScriptMarker, .cm-ContentMarker {\n    font-weight: bold;\n    color: coral;\n}\n\n.cm-header {\n    color: aquamarine !important;\n}\n"}},t={};!function n(i){var r=t[i];if(void 0!==r)return r.exports;var a=t[i]={exports:{}};return e[i].call(a.exports,a,a.exports,n),a.exports}(5056)})();
//# sourceMappingURL=https://hamish-milne.github.io/moontale/editor.js.map
}
});