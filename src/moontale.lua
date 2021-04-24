
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

style = setmetatable({}, {
    __index = function(t, k)
        return function(content)
            push(k)
            show(content)
            pop()
        end
    end
})

align = setmetatable({}, {
    __index = function(t, k)
        return function(content)
            push('align', k)
            show(content)
            pop()
        end
    end
})

colors = {
    aliceblue = "#f0f8ff",
    antiquewhite = "#faebd7",
    aqua = "#00ffff",
    aquamarine = "#7fffd4",
    azure = "#f0ffff",
    beige = "#f5f5dc",
    bisque = "#ffe4c4",
    black = "#000000",
    blanchedalmond = "#ffebcd",
    blue = "#0000ff",
    blueviolet = "#8a2be2",
    brown = "#a52a2a",
    burlywood = "#deb887",
    cadetblue = "#5f9ea0",
    chartreuse = "#7fff00",
    chocolate = "#d2691e",
    coral = "#ff7f50",
    cornflowerblue = "#6495ed",
    cornsilk = "#fff8dc",
    crimson = "#dc143c",
    cyan = "#00ffff",
    darkblue = "#00008b",
    darkcyan = "#008b8b",
    darkgoldenrod = "#b8860b",
    darkgray = "#a9a9a9",
    darkgrey = "#a9a9a9",
    darkgreen = "#006400",
    darkkhaki = "#bdb76b",
    darkmagenta = "#8b008b",
    darkolivegreen = "#556b2f",
    darkorange = "#ff8c00",
    darkorchid = "#9932cc",
    darkred = "#8b0000",
    darksalmon = "#e9967a",
    darkseagreen = "#8fbc8f",
    darkslateblue = "#483d8b",
    darkslategray = "#2f4f4f",
    darkslategrey = "#2f4f4f",
    darkturquoise = "#00ced1",
    darkviolet = "#9400d3",
    deeppink = "#ff1493",
    deepskyblue = "#00bfff",
    dimgray = "#696969",
    dimgrey = "#696969",
    dodgerblue = "#1e90ff",
    firebrick = "#b22222",
    floralwhite = "#fffaf0",
    forestgreen = "#228b22",
    fuchsia = "#ff00ff",
    gainsboro = "#dcdcdc",
    ghostwhite = "#f8f8ff",
    gold = "#ffd700",
    goldenrod = "#daa520",
    gray = "#808080",
    grey = "#808080",
    green = "#008000",
    greenyellow = "#adff2f",
    honeydew = "#f0fff0",
    hotpink = "#ff69b4",
    indianred = "#cd5c5c",
    indigo = "#4b0082",
    ivory = "#fffff0",
    khaki = "#f0e68c",
    lavender = "#e6e6fa",
    lavenderblush = "#fff0f5",
    lawngreen = "#7cfc00",
    lemonchiffon = "#fffacd",
    lightblue = "#add8e6",
    lightcoral = "#f08080",
    lightcyan = "#e0ffff",
    lightgoldenrodyellow = "#fafad2",
    lightgray = "#d3d3d3",
    lightgrey = "#d3d3d3",
    lightgreen = "#90ee90",
    lightpink = "#ffb6c1",
    lightsalmon = "#ffa07a",
    lightseagreen = "#20b2aa",
    lightskyblue = "#87cefa",
    lightslategray = "#778899",
    lightslategrey = "#778899",
    lightsteelblue = "#b0c4de",
    lightyellow = "#ffffe0",
    lime = "#00ff00",
    limegreen = "#32cd32",
    linen = "#faf0e6",
    magenta = "#ff00ff",
    maroon = "#800000",
    mediumaquamarine = "#66cdaa",
    mediumblue = "#0000cd",
    mediumorchid = "#ba55d3",
    mediumpurple = "#9370d8",
    mediumseagreen = "#3cb371",
    mediumslateblue = "#7b68ee",
    mediumspringgreen = "#00fa9a",
    mediumturquoise = "#48d1cc",
    mediumvioletred = "#c71585",
    midnightblue = "#191970",
    mintcream = "#f5fffa",
    mistyrose = "#ffe4e1",
    moccasin = "#ffe4b5",
    navajowhite = "#ffdead",
    navy = "#000080",
    oldlace = "#fdf5e6",
    olive = "#808000",
    olivedrab = "#6b8e23",
    orange = "#ffa500",
    orangered = "#ff4500",
    orchid = "#da70d6",
    palegoldenrod = "#eee8aa",
    palegreen = "#98fb98",
    paleturquoise = "#afeeee",
    palevioletred = "#d87093",
    papayawhip = "#ffefd5",
    peachpuff = "#ffdab9",
    peru = "#cd853f",
    pink = "#ffc0cb",
    plum = "#dda0dd",
    powderblue = "#b0e0e6",
    purple = "#800080",
    red = "#ff0000",
    rosybrown = "#bc8f8f",
    royalblue = "#4169e1",
    saddlebrown = "#8b4513",
    salmon = "#fa8072",
    sandybrown = "#f4a460",
    seagreen = "#2e8b57",
    seashell = "#fff5ee",
    sienna = "#a0522d",
    silver = "#c0c0c0",
    skyblue = "#87ceeb",
    slateblue = "#6a5acd",
    slategray = "#708090",
    slategrey = "#708090",
    snow = "#fffafa",
    springgreen = "#00ff7f",
    steelblue = "#4682b4",
    tan = "#d2b48c",
    teal = "#008080",
    thistle = "#d8bfd8",
    tomato = "#ff6347",
    turquoise = "#40e0d0",
    violet = "#ee82ee",
    wheat = "#f5deb3",
    white = "#ffffff",
    whitesmoke = "#f5f5f5",
    yellow = "#ffff00",
    yellowgreen = "#9acd32",
}

color = setmetatable({}, {
    __index = function(t, k)
        local c = colors[string.lower(k)] or k
        return function(content)
            push('color', c)
            show(content)
            pop()
        end
    end
})

function img(src)
    object('img', src)
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

