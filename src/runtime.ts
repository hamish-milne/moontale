import { lua, lauxlib, lualib, lua_State } from 'fengari'

const enc = new TextEncoder()
let L: lua_State | null = null
let tags: string[] = []
let buf: string[] = []
let emit: (html: string, invalidate: boolean)=>void | undefined
let wasChanged = false
let invalidated = false

export function loadStory(src: string[], emitFn: (html: string, invalidate: boolean)=>void, logFn: (error: string, trace: string)=>void) {
    emit = emitFn
    L = lauxlib.luaL_newstate()

    lua.lua_atpanic(L, L => {
        logFn(lua.lua_tojsstring(L, lua.lua_gettop(L)), "Panic")
        return 0
    })

    lualib.luaL_openlibs(L)

    lua.lua_register(L, "print", L => {
        let l = lua.lua_gettop(L)
        let args = []
        for (let i = 1; i <= l; i++) {
            args.push(lua.lua_tojsstring(L, i))
        }
        console.log(...args)
        return 0
    })

    lua.lua_register(L, "Log", L => {
        let top = lua.lua_gettop(L)
        logFn(lua.lua_tojsstring(L, 1), lua.lua_tojsstring(L, 2))
        return 0
    })

    lua.lua_register(L, "Push", L => {
        let str = lua.lua_tojsstring(L, 1)
        tags.push(str)
        if (str == 'a') {
            buf.push(`<a href="#" id="${lua.lua_tonumber(L, 2)}">`)
            lua.lua_pop(L, 1)
        } else if (str == 'color') {
            buf.push(`<span style="color: ${lua.lua_tojsstring(L, 2)};">`)
        } else {
            buf.push(`<${str}>`)
        }
        wasChanged = true
        return 0
    })
    lua.lua_register(L, "Pop", L => {
        let str = tags.splice(tags.length - 1, 1)[0]
        if (str) {
            if (str === "color") {
                buf.push(`</span>`)
            } else {
                buf.push(`</${str}>`)
            }
        }
        wasChanged = true
        return 0
    })
    lua.lua_register(L, "Text", L => {
        let str = lua.lua_tojsstring(L, 1)
        buf.push(str)
        wasChanged = true
        return 0
    })
    lua.lua_register(L, "Object", L => {
        let str = lua.lua_tojsstring(L, 1)
        buf.push(`<${str}>`)
        wasChanged = true
        return 0
    })
    lua.lua_register(L, "Clear", L => {
        buf = []
        wasChanged = true
        return 0
    })
    lua.lua_register(L, "Invalidate", L => {
        invalidated = true
        wasChanged = true
        return 0
    })

    src.map(x => lauxlib.luaL_dostring(L, enc.encode(x)))
}

export function raiseEvent(event: string, id: string) {
    lua.lua_getglobal(L, 'RaiseEvent')
    lua.lua_pushstring(L, event)
    lua.lua_pushstring(L, id)
    lua.lua_call(L, 2, 0)
    if (wasChanged) {
        wasChanged = false
        emit?.(buf.join(''), invalidated)
        invalidated = false;
    }
}

export function start() {
    lua.lua_getglobal(L, 'SoftReset')
    lua.lua_call(L, 0, 0)
    emit?.(buf.join(''), invalidated)
    invalidated = false
    wasChanged = false
}

export function update(deltaTime: number) {
    lua.lua_getglobal(L, 'Update')
    lua.lua_pushnumber(L, deltaTime)
    lua.lua_call(L, 1, 0)
    if (wasChanged) {
        wasChanged = false
        emit?.(buf.join(''), invalidated)
        invalidated = false;
    }
}