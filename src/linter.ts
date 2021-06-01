
import { Annotation, Linter } from 'codemirror/addon/lint/lint'
import { parse } from "./convert"
import Token from 'markdown-it/lib/token'
import { lua, lauxlib, lualib, lua_State } from 'fengari'

const enc = new TextEncoder()
const errorPattern = /]:(\d+): (.*)/

function doLua(L: lua_State, src: string, output: Annotation[], ln: number, char: number) {
    if (lauxlib.luaL_dostring(L, enc.encode(src))) {
        let errorStr = lua.lua_tojsstring(L, lua.lua_gettop(L))
        let [_, line, msg] = errorStr.match(errorPattern)
        output.push({
            from: {ch: char, line: ln + Number(line)},
            to: {ch: char, line: ln + Number(line) + 1},
            severity: 'error',
            message: msg
        })
    }
}

function lintOne(token: Token, output: Annotation[], L: lua_State) {
    // Undo the placeholder character added in preprocess()
    token.content = token.content?.replace(/\f/g, '\n')
    switch (token.type) {
    case 'inline':
        for (const child of token.children) {
            lintOne(child, output, L)
        }
        break
    case 'code_block':
        doLua(L, token.content, output, 0, 0)
        break
    case 'code_variable':
    case 'code_expression':
        doLua(L, `Show(${token.content})`, output, 0, 0)
        break
    case 'content_open':
        doLua(L, `AsChanger(${token.content})`, output, 0, 0)
        break
    }
}

export const lint: Linter<unknown> = content => {
    let L = lua.lua_newstate()
    let output: Annotation[] = []
    for(let token of parse(content)) {
        lintOne(token, output, L)
    }
    return output
}