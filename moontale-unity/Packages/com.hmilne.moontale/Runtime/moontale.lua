--[[
    Moontale standard library
    https://moontale.hmilne.cc
]]

---@alias renderFn fun()
---@alias content renderFn|string|boolean|number|nil
---@alias changer fun(content:content):nil

---Saved output functions
---@type fun()
local _clear = Clear

---@type fun()
local _invalidate = Invalidate

---Array of event registrations
---@type fun(event:string)[]
local _events = {}

---Set of hovered-over elements
---@type table<string, boolean>
local _hovering = {}

---If true, call reload() whenever the hover state changes
local _reloadOnHover = false

---If true, an 'a' tag has been pushed, and we shouldn't push another one until 'pop' is called
local _linkPushed = false

---If true, we're rendering as a result of a jump() call rather than any subsequent reload()
local _firstRender = false

---If true, one of the branches in an If()/ElseIf() chain has been taken
local _ifTaken = false

---The current/last executed passage coroutine, so we can resume it with an Update
local _waiting = nil

---The set of LinkReplace targets that are now visible
local _visible = {}

---An auto-incrementing number used as a default identifier for LinkReplace targets
local _idSequence = 0

---Typewriter internal state
local _typedCharsThisFrame = 0
local _typedCharsTotal = 0

---Dummy render function to avoid dealing with 'nil' values
---@param content function
local function _empty(content)
end

---Used by If()
local function _ifTrue(content)
    _ifTaken = true
    Show(content)
end

---Used by If()
local function _ifFalse(content)
    _ifTaken = false
end

---The top-level passage currently being rendered
---@type string
PassageName = "(No passage)"

---The name of the global start passage
---@type string
StartPassage = "(No start passage)"

---@class Passage
---@field public content renderFn  The passage's content as a function
---@field public tags table<string, boolean>  The set of passage tags
---@field public position number[]  The passage's position in the editor as a pixel coordinate

---The table of all passages in the story, keyed by their name
---@type table<string, Passage>
Passages = setmetatable({}, {
    __index = function (t, k)
        error("Passage `"..tostring(k).."` does not exist")
    end
})

---Override of the host function; clears out any internal state
function Clear()
    _clear()
    _events = {}
    _linkPushed = false
    _reloadOnHover = false
    _idSequence = 0
    _typedCharsThisFrame = 0
end

---Override of the host function; invalidates any event IDs
function Invalidate()
    _invalidate()
    _hovering = {}
    _waiting = nil
    _visible = {}
    _typedCharsTotal = 0
end

---Generates a Changer that registers a callback for its content
---@param fn fun(event:string):nil
---@return changer
function Event(fn)
    return function(content)
        if _linkPushed then
            local old = _events[#_events]
            _events[#_events] = function(...) old(...); fn(...) end
            Show(content)
        else
            _events[#_events + 1] = fn or _empty
            Push('a', tostring(#_events))
            _linkPushed = true
            Show(content)
            Pop()
            _linkPushed = false
        end
    end
end

---Applies the hovering changer when the cursor is over the content, and the normal one when it is not.
---@param hovering changer
---@param normal changer|nil
---@return changer
function Hover(hovering, normal)
    return function(content)
        _reloadOnHover = true
        local doPush = not _linkPushed
        local eid = #_events
        if doPush then
            eid = #_events + 1
            _events[eid] = _empty
            Push('a', tostring(eid))
        end
        if _hovering[eid] then
            (hovering or Show)(content)
        else
            (normal or Show)(content)
        end
        if doPush then
            Pop()
        end
    end
end

---Called when the named event occurs on the content with the given ID
---@param event string
---@param idx string
function RaiseEvent(event, idx)
    idx = tonumber(idx)
    if idx == nil then return end
    if event == 'mouseover' then
        _hovering[idx] = true
        if _reloadOnHover then
            Reload()
        end
    elseif event == 'mouseout' then
        _hovering[idx] = nil
        if _reloadOnHover then
            Reload()
        end
    else
        local fn = _events[idx]
        if fn then fn(event) end
    end
end

---Called regularly by the host as time passes
---@param deltaTime number  The time since Update was last called, in seconds
function Update(deltaTime)
    if _waiting then
        coroutine.resume(_waiting, deltaTime)
    end
end

---Pauses execution for the given time period
---@param duration number
function Delay(duration)
    _waiting = coroutine.running()
    repeat
        duration = duration - coroutine.yield()
    until duration <= 0
    _waiting = nil
end

---Causes all Text within the content to be emitted one character at a time, with a delay in between
---@type changer
function Typewriter(content)
    local _text = Text
    Text = function(str)
        local prefix = _typedCharsTotal - _typedCharsThisFrame
        if #str <= prefix then
            _text(str)
            _typedCharsThisFrame = _typedCharsThisFrame + #str
        else
            if prefix > 0 then
                _text(str:sub(1, prefix))
                _typedCharsThisFrame = _typedCharsThisFrame + prefix
            end
            local i = prefix + 1
            while i <= #str do
                -- Handle UTF-8 sequences
                local start = i
                while str:byte(i) >= 0x80 do
                    i = i + 1
                end
                _text(str:sub(start, i))
                Delay(0.01)
                i = i + 1
                local charsTyped = (i - start) + 1
                _typedCharsTotal = _typedCharsTotal + charsTyped
                _typedCharsThisFrame = _typedCharsThisFrame + charsTyped
            end
        end
    end
    Show(content)
    Text = _text
end

---Checks that its argument can be used as a changer
---@param fn changer
---@return changer
function AsChanger(fn)
    if type(fn) == 'function' then
        return fn
    else
        Log('Error: '..tostring(fn)..' cannot be used as a changer')
        return Show
    end
end

---Displays its argument
---@param value content
function Show(value)
    if value == nil then return end
    local t = type(value)
    if t == 'string' or t == 'number' or t == 'boolean' then
        Text(tostring(value))
    elseif t == 'function' or t == 'table' then
        Show(value())
    else
        Log('Error: '..tostring(value)..' cannot be displayed')
    end
end

---Clears the screen and renders the passage with the given name.
---@param target string
function Jump(target)
    Clear()
    Invalidate()
    PassageName = target
    local routine = coroutine.create(function ()
        _firstRender = true
        Display(target)
        _firstRender = false
    end)
    coroutine.resume(routine)
end

---Causes the current passage to be re-rendered.
function Reload()
    Clear()
    local routine = coroutine.create(function ()
        Display(PassageName)
    end)
    coroutine.resume(routine)
end

---Renders the passage with the given name in-line with the text.
---@param passage string
function Display(passage)
    Show(Passages[passage].content)
end

---Jumps back to the start, without resetting any variables.
function SoftReset()
    Jump(StartPassage)
end

---Renders its content if the condition is truthy
---@param condition boolean
---@return changer
function If(condition)
    if condition then
        return _ifTrue
    else
        return _ifFalse
    end
end

---Ensures that the given function is executed when the passage is reached,
---and not on any subsequent reloads. If a Table is passed, it treats each
---key-value pair as an instruction to set a variable.
---@param content table|content
function Once(content)
    if _firstRender then
        if type(content) == 'table' then
            for k,v in next, content do
                _G[k] = v
            end
        else
            Show(content)
        end
    end
end

---Renders its content if neither the previous If or any of the ElseIf calls following it were entered
---@type changer
function Else(content)
    if not _ifTaken then
        _ifTaken = true
        Show(content)
    end
end

---Renders its content if condition is truthy and neither the previous If or any of the ElseIf calls following it were entered
---@param condition boolean
---@return changer
function ElseIf(condition)
    if condition then
        return Else
    else
        return _empty
    end
end

---Wraps the content in the named tag
---@type table<string, changer>
Style = setmetatable({}, {
    __index = function(t, k)
        return function(content)
            Push(k)
            Show(content)
            Pop()
        end
    end
})

---Sets the named text alignment for the content.
---@type table<string, changer>
Align = setmetatable({}, {
    __index = function(t, k)
        return function(content)
            Push('align', k)
            Show(content)
            Pop()
        end
    end
})

---A table of the named colours in CSS3
---@type table<string, string>
Colors = {
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

---Colours the text with the given colour name (not case sensitive).
---@type table<string, changer>
Color = setmetatable({}, {
    __index = function(t, k)
        local c = Colors[string.lower(k)] or k
        return function(content)
            Push('color', c)
            Show(content)
            Pop()
        end
    end
})

---Draws an image ('img' entity) with the given path
---@param src string
function Image(src)
    Object('img', src)
end

---Executes a function when the named event occurs
---@type table<string, fun(callback:function):changer>
On = setmetatable({}, {
    __index = function(t, k)
        return function(callback)
            return Event(function(e)
                if e == k then callback() end
            end)
        end
    end
})

---Renders the content multiple times in a row, with the number of the current iteration (1 indexed) assigned to index
---@param count number
---@return changer
function Repeat(count)
    return function(content)
        for i=1,count do
            _G.index = i
            Show(content)
        end
    end
end

---Renders the content for each item in iterable, mapping each entry to variables with the names given in the subsequent arguments.
---The default variable names are 'key' and 'value'
---@param iterable table
---@vararg string
---@return changer
function ForEach(iterable, ...)
    local vars = {...}
    if #vars == 0 then
        vars = {'key', 'value'}
    end
    return function(content)
        local frame = {next(iterable)}
        while frame[1] do
            for i=1,#vars do
                _G[vars[i]] = frame[i]
            end
            Show(content)
            frame = {next(iterable, frame[1])}
        end
    end
end

---Hides the block, and assigns it to a variable with the given name.
---@type table<string, changer>
Name = setmetatable({}, {
    __index = function(t, k)
        return function(content)
            _G[k] = content
        end
    end
})

---Creates a Changer that combines each of its Changer arguments in order of outer-most to inner-most.
---@vararg changer
---@return changer
function Combine(...)
    local agg = select(-1, ...)
    for i=2,select('#', ...) do
        local outer = select(-i, ...)
        local inner = agg
        agg = function(c) outer(function() inner(c) end) end
    end
    return agg
end

LinkStyle = Hover(Color.red, Color.darkred)

---Jumps to a passage when the content is clicked
---@param target string
---@return changer
function Link(target)
    return Combine(On.click(function() Jump(target) end), LinkStyle)
end

---Shows the first argument until it's clicked, then shows the content body
---@param text content
---@param id any  A unique ID for this link; the default is an auto-incremented number
function LinkReplace(text, id)
    if id == nil then
        _idSequence = _idSequence + 1
        id = _idSequence
    end
    return function(content)
        if _visible[id] then
            Show(content)
        else
            Combine(On.click(function()
                if not _visible[id] then
                    _visible[id] = true
                    Reload()
                end
            end), LinkStyle)(text)
        end
    end
end