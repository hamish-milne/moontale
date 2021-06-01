
import { Annotation, Linter } from 'codemirror/addon/lint/lint'
import { parse } from "./convert"
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
            if (src.charCodeAt(i) == 0xA) {
                line++
                lastLineAt = i
            }
        }
        return [line + parent.map!![0] + state.extraLines, pos - lastLineAt]
    }

    function undoPreprocess() {
        // Ensure that the script-replaced lines get added to token.map when figuring out the line number
        state.pendingExtraLines += countChars(token.content ?? "", 0xC)
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
        doLua(L, `AsChanger(${undoPreprocess()})`, output, getLineAndChar())
        break
    }
    state.extraLines += state.pendingExtraLines
    state.pendingExtraLines = 0
    
}

export const lint: Linter<unknown> = content => {
    let L = lauxlib.luaL_newstate()
    lualib.luaL_openlibs(L)
    let output: Annotation[] = []
    let state = {extraLines: 0, pendingExtraLines: 0}
    for(let token of parse(content)) {
        lintOne(token, output, L, null, state)
    }
    return output
}