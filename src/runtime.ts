import { lua, lauxlib, lualib, lua_State } from 'fengari'

const enc = new TextEncoder()
let L: lua_State | null = null
let tags: string[] = []
let buf: string[] = []
let emit: (html: string)=>void | undefined
let wasChanged = false

export function loadStory(src: string[], emitFn: (html: string)=>void, logFn: (error: string, trace: string)=>void) {
    emit = emitFn
    L = lauxlib.luaL_newstate()

    lua.lua_atpanic(L, _ => {
        logFn(lua.lua_tojsstring(L, 1), "TODO")
        return 0
    })

    lualib.luaL_openlibs(L)

    lua.lua_register(L, "log", _ => {
        logFn(lua.lua_tojsstring(L, 1), lua.lua_tojsstring(L, 2))
        return 0
    })

    lua.lua_register(L, "push", _ => {
        let str = lua.lua_tojsstring(L, 1)
        tags.push(str)
        if (str == 'a') {
            buf.push(`<${str} href="#" id="${lua.lua_tonumber(L, 2)}">`)
            lua.lua_pop(L, 1)
        } else {
            buf.push(`<${str}>`)
        }
        wasChanged = true
        return 0
    })
    lua.lua_register(L, "pop", _ => {
        let str = tags.splice(tags.length - 1, 1)
        if (str) {
            buf.push(`</${str}>`)
        }
        wasChanged = true
        return 0
    })
    lua.lua_register(L, "text", _ => {
        let str = lua.lua_tojsstring(L, 1)
        buf.push(str)
        wasChanged = true
        return 0
    })
    lua.lua_register(L, "object", _ => {
        let str = lua.lua_tojsstring(L, 1)
        buf.push(`<${str}>`)
        wasChanged = true
        return 0
    })
    lua.lua_register(L, "clear", _ => {
        buf = []
        wasChanged = true
        return 0
    })

    src.map(x => lauxlib.luaL_dostring(L, enc.encode(x)))
}

export function raiseEvent(event: string, id: string) {
    lua.lua_getglobal(L, 'raiseEvent')
    lua.lua_pushstring(L, event)
    lua.lua_pushstring(L, id)
    lua.lua_call(L, 2, 0)
    if (wasChanged) {
        wasChanged = false
        emit?.(buf.join(''))
    }
}

export function start() {
    lua.lua_getglobal(L, 'softReset')
    lua.lua_call(L, 0, 0)
    emit?.(buf.join(''))
    wasChanged = false
}
