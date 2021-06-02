
import { Annotation, Linter } from 'codemirror/addon/lint/lint'
import { parse, markdownToLua } from "./convert"
import Token from 'markdown-it/lib/token'
import { lua, lauxlib, lualib, lua_State } from 'fengari'

const enc = new TextEncoder()
const errorPattern = /]:(\d+): (.*)/

function doLua(L: lua_State, src: string, output: Annotation[], pos: [number, number]) {
    if (lauxlib.luaL_dostring(L, enc.encode(src))) {
        let errorStr = lua.lua_tojsstring(L, lua.lua_gettop(L))
        let [_, line, msg] = errorStr.match(errorPattern)
        output.push({
            // TODO: Limit line position
            from: {ch: 0, line: pos[0] + Number(line) - 1},
            to: {ch: 0, line: pos[0] + Number(line)},
            severity: 'error',
            message: msg
        })
    }
}

function countChars(src: string, charCode: number) {
    let count = 0
    for (let i = 0; i < src.length; i++) {
        if (src.charCodeAt(i) == charCode) {
            count++
        }
    }
    return count
}

function lintOne(token: Token, output: Annotation[], L: lua_State, parent: Token | null,
    state: {extraLines: number, pendingExtraLines: number}
) {

    function getLineAndChar(): [number, number] {
        if (parent == null) {
            return [0, 0]
        }
        let src = parent.content
        let line = 0;
        let lastLineAt = 0;
        let pos = token.meta as number
        for (let i = 0; i < pos; i++) {
            if (src.charCodeAt(i) == 0xA) /* \n */ {
                line++
                lastLineAt = i
            }
        }
        return [line + parent.map!![0] + state.extraLines, pos - lastLineAt]
    }

    function undoPreprocess() {
        // Ensure that the script-replaced lines get added to token.map when figuring out the line number
        state.pendingExtraLines += countChars(token.content ?? "", 0xC) /* \f */
        return token.content?.replace(/\f/g, '\n')
    }

    switch (token.type) {
    case 'inline':
        for (const child of token.children) {
            lintOne(child, output, L, token, state)
        }
        break
    case 'code_block':
        doLua(L, undoPreprocess(), output, getLineAndChar())
        break
    case 'code_variable':
    case 'code_expression':
        doLua(L, `Show(${undoPreprocess()})`, output, getLineAndChar())
        break
    case 'content_open':
        doLua(L, `AsChanger(${undoPreprocess()})(function() end)`, output, getLineAndChar())
        break
    }
    state.extraLines += state.pendingExtraLines
    state.pendingExtraLines = 0
    
}

function getLintingContext(passages: {text: string, tags: string[]}[]): string {
    if (passages) {
        return [].concat(
            passages.filter(x => x.tags.includes('startup'))
                .concat(passages.filter(x => x.tags.includes('header')))
            .map(x => {
                let outbuf = []
                markdownToLua(x.text, outbuf, {level: 0, links: []})
                return outbuf.join('\n')
            })).join('\n')
    } else {
        return ''
    }
}

export function makeLinter(lib: string, passages: () => {text: string, tags: string[]}[]): Linter<unknown> {
    return content => {
        // TODO: This isn't super performant. Is it possible to copy the Lua state? Or run the linted code in a sandbox?
        let L = lauxlib.luaL_newstate()
        lualib.luaL_openlibs(L)
        for (let fname of ["Log", "Push", "Pop", "Text", "Object", "Clear", "Invalidate"]) {
            lua.lua_register(L, fname, L => 0)
        }
        let output: Annotation[] = []
        doLua(L, lib, output, [0, 0])
        // TODO: Cache the lint context
        doLua(L, getLintingContext(passages()), output, [0, 0])

        // Put any errors from the context at 0,0
        for (let a of output) {
            a.from = {ch: 0, line: 0}
            a.to = {ch: 1, line: 0}
        }

        let state = {extraLines: 0, pendingExtraLines: 0}
        for(let token of parse(content)) {
            lintOne(token, output, L, null, state)
        }
        return output
    }
}