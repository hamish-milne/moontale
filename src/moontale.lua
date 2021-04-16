
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

function raiseEvent(idx)
    local fn = _events[idx]
    if fn then fn() end
end

function jump(target)
    clear()
    passages[target].content()
end

function link(target)
    return function(content)
        push('a', makeEvent(function() jump(target) end))
        content()
        pop()
    end
end

function start()
    jump('Untitled Passage')
end
