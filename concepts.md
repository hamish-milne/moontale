---
description: Things you should know before beginning
---

# Concepts

{% hint style="info" %}
This guide assumes some familiarity with Lua! If you're new to Lua, I'd recommend skimming chapters 1 through 5 of [Programming in Lua](https://www.lua.org/pil/1.html)
{% endhint %}

## Markdown

Moontale's main language is a variant of [Markdown ](https://commonmark.org/help/)that allows mixing Lua code with regular text. We'll call this language 'Moontale-flavoured-Markdown' -  MFM for short. The [Syntax ](syntax.md)section has more details on the differences.

## Stories and Passages

In Twine, a Story is a collection of Passages that are \(typically\) joined together by Links.

A Passage is simply a block of code that gets transformed into text and formatting that the end user can see. The type of code that a Passage contains depends on the 'story format' selected - in the case of Moontale, that would be MFM.

A Story has a 'Start Passage' which the editor can change. When a story is 'run' or 'played', the host will display this passage as its entry point into the story.

## Render functions

The content of a passage \(as well as any inner Content Blocks\) is realised as a 'render function' - a function that, when called with no arguments, writes its content to the screen. Render functions, just like normal Lua functions, can be passed around, saved and copied like any other value.

```text
The following definitions are equivalent:
1. $name('foo')[Some text **with markup**]
2. {$ function foo() text('Some text ') em('with markup') end $}
```

## Overriding

Many of Moontale's standard functions can be overridden by simply replacing their definitions. This is especially useful because Moontale's markdown syntax will refer to Lua expressions instead of a hard-coded style. For example:

```lua
function link()
    show('Instead of a link, have some text!')
end
```

If a function is defined in a table, like `style`, you can override it by overwriting it:

```lua
style.em = color.blue -- *Text* will be blue instead of italicised
style.em = nil -- Revert to the default behaviour
```

You can use the 'base' definitions as well:

```lua
style.em = combine(style.em, color.blue) -- *Text* will be blue as well as italicised
```

For 'free' functions, if you want to access the 'base' definition you'll need to save it first:

```lua
local _link = link
function link(target)
    -- Make all links red (while keeping their normal behaviour)
    return combine(color.red, _link(target)
end
```

🚧 When defining overrides, you should put them in a `startup`-tagged passage if they're common to your story. If they're specific to a passage, you should use the `with` changer; if you put them in a code block, the overrides will be permanent!

