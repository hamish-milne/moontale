---
description: Things to watch out for!
---

# Conventions and caveats

Moontale attempts to make most of its internal operations straightforward and predictable, even if this is on the surface less convenient. The benefit is that as your game grows in complexity, there should \(hopefully!\) be much less scope for bugs and edge-cases.

## 🚧 Error handling

Expressions, script blocks, and `show()` calls are 'protected'. If any of these throws an error part-way through execution, any output that was emitted so far is preserved, the error is logged, and the current expression/script terminates early. The rest of the passage \(or content block\) will continue to be rendered.

Errors are never shown 'inline' to the end user.

## Block repetition

When a block or passage is executed, it is always _actually_ executed - any code within will run, even if it has been run before. To stop this from happening, you can use the `freeze` function.

## Immutability

Once content is emitted to the host \(with `push()`, `pop()`, `object()`, and `text()`\), it stays there 'forever' and cannot be changed by any subsequent code. Think of the host as a typewriter: it can add letters, switch fonts and styles, but can't change what's on the page without tearing it up and starting over - in other words, calling `clear()`.

{% hint style="info" %}
It's possible to add custom emission functions to deal with modification if you _really_ need it, but that's out of scope for this guide!
{% endhint %}

The advantage here is that the implementation of these 'emission' functions is _much_ easier than if modification was allowed. Let's make a basic HTML emitter now:

```lua
tags = {}

function push(tag)
    tags[#tags+1] = tag
    print('<'..tag..'>')
end

function pop()
    print('</'..tags[#tags]..'>')
    tags[#tags] = nil
end

function text(text)
    print(text)
end

function object(tag)
    print('<'..tag..' />')
end

function clear()
    print('<hr />')
end
```

That's it! The upshot is that whether you're targeting HTML, Rich Text, or direct API calls, integration into your engine of choice should be 'stupid simple'.

Note that in this example, `clear()` doesn't actually clear the screen; if our output is plain HTML, this is of course impossible. In your application you can use the appropriate APIs to clear any existing text - perhaps saving it first to a 'conversation history' system, if desired.

## Text output is not re-parsed

When emitting text through code, e.g. `<$ '*foo*$bar' $>`, it is emitted 'verbatim', without any additional parsing. In the example shown, the literal string `*foo*$bar` will be printed.

The reason for this is that a second parsing step, in addition to placing a lot of implementation burden on the Lua runtime, host, and/or exporter, introduces some subtle and complex edge-cases relating to _when_ exactly this parsing takes place \(What does `'$'..'foo'` print? What about `'$f'..'oo'`? Or `x = '$y'; show('$x')`?\).

Fortunately, there are a number of options to achieve a very similar effect:

* Use Lua directly, which is almost as terse as Markdown, e.g. `<$ em('foo'),bar $>`
* Wrap the content in a `name()` changer, and refer to it later, e.g. `$name('x')[ *foo*$bar ] ... $x`
* Use the content directly in the passage, and add any code before/after, e.g. `<$ code() $> *foo*$bar <$ moreCode() $>`

## The parser is dumb

The tokens `<$`, `$>`, `{$`, and `$}` were chosen because they are always invalid sequences in Lua and \(probably\) invalid in Markdown, so the parser just needs to scan for the matching end token and treat the whole match as the Lua code to execute.

However, if you have a Lua string literal that actually contains `$}` or `$>`, you'll run into problems! If for **some reason** you need to operate on these sequences or include them in your text, you'll have to elaborate the expression a bit: `'$'..'}'`. There are no 'escape sequences' or suchlike.

In a similar vein, the Twine editor will see any 'link-like' structure and assume it's a real passage link, even if it's within a Lua code block. We can use this to our advantage, for example `${--[[Label->Passage]]$}` will create a 'fake' link: Twine will draw a link line, but nothing will be visible in the output.

## Variable scope

Moontale uses Lua's scoping rules for variables. A reference to `$x` will look for local variables in the current render function, then captured variables \('upvalues', in Lua terminology\), then globals.

You can define a local variable using a script block: `{$ local x = x $}` will 'capture' the parent scope's value of `x` , for example. Note that such a variable is scoped to the render function \(the current content block, or passage root\) - not the passage as a whole. This means that local variables in nested content blocks will 'shadow' those in their parent.

Moontale has no special syntax to differentiate between local and global variables.

## Infinite loops

Moontale does not guard against infinite loops \(because of the [Halting Problem](https://en.wikipedia.org/wiki/Halting_problem) this isn't possible to do without severe restrictions\). If you call `jump` or `display` unconditionally, and it ends up back at the same passage you called it from, your app will lock up.

If this is a concern, a host implementation may deliberately limit the number of instructions executed as a result of any user interaction - perhaps using `debug.sethook`.



