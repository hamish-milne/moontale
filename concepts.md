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

