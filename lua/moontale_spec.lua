---@diagnostic disable: lowercase-global, undefined-global

package.path = '../moontale-unity/Packages/com.hmilne.moontale/Runtime/?.lua;' .. package.path

before_each(function()
    _G.Log = print
    _text = spy.new(function() end)
    _clear = spy.new(function() end)
    _push = spy.new(function() end)
    _pop = spy.new(function() end)
    _invalidate = spy.new(function() end)
    _object = spy.new(function() end)
    _G.Invalidate = _invalidate
    _G.Clear = _clear
    _G.Text = _text
    _G.Push = _push
    _G.Pop = _pop
    _G.Object = _object
    require('moontale')
end)

after_each(function()
    package.loaded['moontale'] = nil
    setmetatable(_G, nil)
end)

describe("Clear()", function()
    it("calls parent", function()
        Clear()
        assert.spy(_clear).was.called(1)
    end)
end)

describe("Event()", function()
    it("pushes a link tag", function()
        Event(function() end)("Foo")
        assert.spy(_push).was.called_with('a', '1')
        assert.spy(_text).was.called_with('Foo')
        assert.spy(_pop).was.called(1)
    end)

    it("responds to raised event", function()
        local s = spy.new(function() end)
        Event(s)("Foo")
        RaiseEvent("eventType", "1")
        assert.spy(s).was.called_with("eventType")
    end)

    it("merges nested events into one tag", function()
        Event(function() end)(function()
            Event(function() end)("Foo")
        end)
        assert.spy(_push).was.called(1)
        assert.spy(_pop).was.called(1)
    end)
end)

describe("Show()", function()
    it("can accept strings", function()
        Show("Foo")
        assert.spy(_text).was.called_with("Foo")
    end)

    it("can accept numbers", function()
        Show(123)
        assert.spy(_text).was.called_with("123")
    end)

    it("can accept render functions", function()
        Show(function() Text("Foo") end)
        assert.spy(_text).was.called_with("Foo")
    end)
end)

describe("Display()", function()
    it("shows passage content", function()
        _G.Passages = {foo = {content = function() Text("Bar") end}}
        Display("foo")
        assert.spy(_text).was.called_with("Bar")
    end)
end)

describe("Hover()", function()
    it("switches changers on mouseover", function()
        _G.Passages = {p = {content = function() Hover(Style.foo, Style.bar)("Foo") end}}
        Jump('p')
        assert.spy(_clear).was.called(1)
        assert.spy(_push).was.called_with("bar")
        assert.spy(_push).was.called_with("a", "1")
        RaiseEvent("mouseover", "1")
        assert.spy(_clear).was.called(2)
        assert.spy(_push).was.called_with("foo")
    end)
end)

describe("Once()", function()
    it("executes only the first time", function()
        local s = spy.new(function() end)
        _G.Passages = {p = { content = function() Once(function() s() end) end } }
        Jump('p')
        assert.spy(s).was.called(1)
        Reload()
        assert.spy(s).was.called(1)
    end)

    it("accepts a table value to set variables", function()
        _G.x = nil
        _G.y = nil
        _G.Passages = {p = { content = function() Once { x = 1, y = 2 } end } }
        Jump('p')
        assert.is_equal(_G.x, 1)
        assert.is_equal(_G.y, 2)
    end)
end)

describe("If()", function()
    it("shows the content if the condition is true", function()
        If(true)("Foo")
        assert.spy(_text).was.called_with("Foo")
    end)

    it("hides the content if the condition is false", function ()
        If(false)("Foo")
        assert.spy(_text).was_not.called()
    end)
end)

describe("ElseIf()", function ()
    it("shows the content if the condition is true", function ()
        If(false)("Foo")
        ElseIf(false)("Bar")
        ElseIf(true)("Baz")
        assert.spy(_text).was.called(1)
        assert.spy(_text).was.called_with("Baz")
    end)

    it("hides the content if the condition is false", function ()
        If(false)("Foo")
        ElseIf(false)("Bar")
        assert.spy(_text).was_not.called()
    end)

    it("hides the content if the previous If() was taken", function ()
        If(true)("Foo")
        ElseIf(true)("Bar")
        assert.spy(_text).was.called(1)
        assert.spy(_text).was.called_with("Foo")
    end)

    it("hides the content if the previous ElseIf() was taken", function ()
        If(false)("Foo")
        ElseIf(true)("Bar")
        ElseIf(true)("Baz")
        assert.spy(_text).was.called(1)
        assert.spy(_text).was.called_with("Bar")
    end)
end)

describe("Else()", function ()
    it("shows the content if the previous branch was not taken", function ()
        If(false)("Foo")
        Else("Bar")
        assert.spy(_text).was.called(1)
        assert.spy(_text).was.called_with("Bar")
    end)

    it("hides the content if the previous branch was taken", function ()
        If(true)("Foo")
        Else("Bar")
        assert.spy(_text).was.called(1)
        assert.spy(_text).was.called_with("Foo")
    end)
end)

describe("Style", function ()
    it("pushes the named tag", function ()
        Style.foo("Bar")
        assert.spy(_push).was.called_with("foo")
        assert.spy(_text).was.called_with("Bar")
        assert.spy(_pop).was.called_with()
    end)

    it("can be overridden", function ()
        local s = spy.new(function() end)
        Style.foo = s
        Style.foo("Bar")
        Style.foo = nil
        assert.spy(s).was.called(1)
    end)
end)

describe("Align", function ()
    it("pushes the named alignment", function ()
        Align.foo("Bar")
        assert.spy(_push).was.called_with("align", "foo")
        assert.spy(_text).was.called_with("Bar")
        assert.spy(_pop).was.called_with()
    end)
end)

describe("Color", function ()
    it("pushes the named colour", function ()
        Color.lightgrey("Bar")
        assert.spy(_push).was.called_with("color", "#d3d3d3")
        assert.spy(_text).was.called_with("Bar")
        assert.spy(_pop).was.called_with()
    end)

    it("pushes the given hex colour", function ()
        Color["#123456"]("Bar")
        assert.spy(_push).was.called_with("color", "#123456")
        assert.spy(_text).was.called_with("Bar")
        assert.spy(_pop).was.called_with()
    end)
end)

describe("Click()", function()
    it("only responds to click events", function ()
        local s = spy.new(function() end)
        On.click(s)("Foo")
        RaiseEvent("not-click", "1")
        assert.spy(s).was_not.called()
        RaiseEvent("click", "1")
        assert.spy(s).was.called(1)
    end)
end)

describe("Link()", function ()
    it("jumps to the given passage on click", function ()
        local s = spy.new(function() end)
        _G.Passages = {q = { content = s}}
        Link('q')("Foo")
        RaiseEvent("click", "1")
        assert.spy(s).was.called(1)
    end)
end)

describe("Repeat()", function ()
    it("repeats the content N times", function ()
        Repeat(12)("Foo")
        assert.spy(_text).was.called(12)
        assert.spy(_text).was.called_with("Foo")
    end)
end)

describe("ForEach()", function ()
    it("iterates over table literal", function ()
        ForEach {a = 1, b = 2, c = 3}(function() Text(key..value) end)
        assert.spy(_text).was.called_with('a1')
        assert.spy(_text).was.called_with('b2')
        assert.spy(_text).was.called_with('c3')
    end)

    it("accepts names for iteration variables", function ()
        ForEach({a = 1, b = 2, c = 3}, 'x', 'y')(function() Text(x..y) end)
        assert.spy(_text).was.called_with('a1')
        assert.spy(_text).was.called_with('b2')
        assert.spy(_text).was.called_with('c3')
    end)
end)

describe("Name", function ()
    it("can be used to store and retrieve content", function ()
        Name.foo("Bar")
        Show(foo)
        assert.spy(_text).was.called_with("Bar")
    end)
end)

describe("Combine()", function ()
    it("combines multiple changers into one", function ()
        Combine(Style.foo, Style.bar)("Baz")
        assert.spy(_push).was.called_with('foo')
        assert.spy(_push).was.called_with('bar')
        assert.spy(_text).was.called_with('Baz')
        assert.spy(_pop).was.called(2)
    end)

    it("accepts a single argument", function ()
        Combine(Style.foo)("Baz")
        assert.spy(_push).was.called_with('foo')
        assert.spy(_text).was.called_with('Baz')
        assert.spy(_pop).was.called(1)
    end)
end)

describe("Delay()", function ()
    it("pauses execution until enough time has passed", function ()
        _G.Passages = {a = {content = function ()
            Text("Foo")
            Delay(2)
            Text("Bar")
        end}}
        Jump("a")
        assert.spy(_text).was.called(1)
        assert.spy(_text).was.called_with("Foo")
        Update(1)
        assert.spy(_text).was.called(1)
        Update(1)
        assert.spy(_text).was.called(2)
    end)
end)

describe("Typewriter()", function ()
    it("displays letters one at a time", function ()
        _G.Passages = {a = {content = function() Typewriter("ABCDEF") end}}
        Jump("a")
        for i=1,6 do
            assert.spy(_text).was.called(i)
            Update(0.01)
        end
    end)
end)

describe("LinkReplace()", function ()
    it("shows the first argument normally", function ()
        _G.Passages = {a = {content = function() LinkReplace("Foo")("Bar") end}}
        Jump("a")
        assert.spy(_text).was.called_with("Foo")
    end)

    it("shows the second argument after clicking", function ()
        _G.Passages = {a = {content = function() LinkReplace("Foo")("Bar") end}}
        Jump("a")
        RaiseEvent("click", 1)
        assert.spy(_clear).was.called(2)
        assert.spy(_text).was.called_with("Bar")
    end)
end)

describe("special passage tags", function ()
    it("displays 'startup' passages on a SoftReset", function ()
        _G.Passages = {
            a = {tags = {startup = true}, content = function () Text('Foo') end},
            b = {tags = { }, content = function () Text('Bar') end},
        }
        _G.StartPassage = 'b'
        SoftReset()
        assert.spy(_text).was.called(2)
        assert.spy(_text).was.called_with('Foo')
        assert.spy(_text).was.called_with('Bar')
    end)

    it("displays 'header' passages at the start of every passage", function ()
        _G.Passages = {
            a = {tags = {header = true}, content = function () Text('Foo') end},
            b = {tags = { }, content = function () Text('Bar') end},
        }
        CollectSpecialPassages()
        Jump('b')
        assert.spy(_text).was.called(2)
        assert.spy(_text).was.called_with('Foo')
        assert.spy(_text).was.called_with('Bar')
    end)

    it("dispays 'footer' passages at the end of every passage", function ()
        _G.Passages = {
            a = {tags = {footer = true}, content = function () Text('Foo') end},
            b = {tags = { }, content = function () Text('Bar') end},
        }
        CollectSpecialPassages()
        Jump('b')
        assert.spy(_text).was.called(2)
        assert.spy(_text).was.called_with('Foo')
        assert.spy(_text).was.called_with('Bar')
    end)
end)