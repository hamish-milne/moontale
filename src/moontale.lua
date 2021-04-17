
local _events = {}
local _clear = clear
function clear()
    _clear()
    _events = {}
end

function makeEvent(fn)
    _events[#_events + 1] = fn
    return #_events
end

function raiseEvent(event, idx)
    local fn = _events[idx]
    if fn then fn(event) end
end

function asChanger(fn)
    if type(fn) == 'function' then
        return fn
    else
        log('Error: '..tostring(fn)..' cannot be used as a changer')
    end
end

function show(value)
    local t = type(value)
    if t == 'string' or t == 'number' or t == 'boolean' then
        text(tostring(value))
    elseif t == 'function' then
        value()
    else
        log('Error: '..tostring(value)..' cannot be displayed')
    end
end

function jump(target)
    clear()
    passageName = target
    display(target)
end

function reload()
    jump(passageName)
end

function display(passage)
    show(passages[passage].content)
end

function softReset()
    jump(startPassage)
end

local _ifTaken = false
local function _ifTrue(content)
    _ifTaken = true
    show(content)
end

local function _ifFalse(content)
    _ifTaken = false
end

local function _empty(content)
end

function If(condition)
    if condition then
        return _ifTrue
    else
        return _ifFalse
    end
end

function Else(content)
    if not _ifTaken then
        _ifTaken = true
        show(content)
    end
end

function ElseIf(condition)
    if condition then
        return _else
    else
        return _empty
    end
end

function EndIf()
    _ifTaken = false
end

function tagChanger(tag)
    return function(content)
        push(tag)
        show(content)
        pop()
    end
end

em = tagChanger('em')
strong = tagChanger('strong')
u = tagChanger('u')
s = tagChanger('s')
p = tagChanger('p')

function color(color)
    return function(content)
        push('color', color)
        show(content)
        pop()
    end
end

function a(id)
    return function(content)
        push('a', id)
        show(content)
        pop()
    end
end

function click(fn)
    return a(makeEvent(fn))
end

function link(target)
    return click(function() jump(target) end)
end

function Repeat(count)
    return function(content)
        for i=1,count do
            index = i
            show(content)
        end
    end
end

function forEach(iterable, ...)
    local vars = {...}
    return function(content)
        local frame = {next(iterable)}
        while frame[1] do
            for i=1,#vars do
                _G[vars[i]] = frame[i]
            end
        end
    end
end

function forEach(iterable)
    forEach(iterable, 'key', 'value')
end

function name(name)
    return function(content)
        _G[name] = content
    end
end

function combine(...)
    local agg = select(-1, ...)
    for i=2,select('#', ...) do
        local outer = select(-i, ...)
        local inner = agg
        agg = function(c) outer(function() inner(c) end) end 
    end
    return agg
end

