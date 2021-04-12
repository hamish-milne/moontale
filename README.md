# Luatwine
A Twine 2 story format that outputs Lua

## Overview

With Luatwine, you can write Twine 2 stories with Lua scripts embedded directly into your Passages. The Story can then be exported as a plain Lua file, which can be played in the browser like any other Twine format, or be embedded into any engine that supports Lua - for example, the Luatwine Unity plugin.

### Who is this for?

* Twine 'power users' using the platform to develop games or complex mechanics, who will benefit from Lua's programmer-friendly syntax and structures.
* Developers interested in using their creations in unconventional ways, who will benefit from Lua's embeddability and extensibility.

### Who is this not for?

* Developers focused on linear storytelling, CYOA, and other projects with minimal logic (and are only targeting the browser). Harlowe should have everything you need.
* Developers indending to take advantage of complex browser-based features: media playback, CSS and so on. For any feature, if it's not in [TextMeshPro's Rich Text](http://digitalnativestudios.com/textmeshpro/docs/rich-text/) then Luatwine probably won't support it in the browser.
* Developers who like the 'mutable' model used by Harlowe: hiding/showing parts of a passage, changing words from one to another when the user clicks something and so on. This isn't impossible with Luatwine of course, but by default the output is 'immutable': text and formatting instructions are emitted one-by-one to the host, and cannot be changed after the fact without clearing the screen. (This makes implementing your own 'rendering' code much, much easier!)

### In a nutshell

Luatwine supports the following:
* All CommonMark Markdown syntax, excluding standard hyperlinks and HTML
* Links in the form `[[Passage]]`, `[[Text->Passage]]`, and `[[Passage<-Text]]`
* Plain variables, in the form `$myVariable`
* Complex expressions, in the form `$<foo + bar>$`
* Script blocks, in the form `${ someCode(); moreCode() }$`
* 'Changer' blocks, in the form `$em[ Text _here_. ]` and `$<color('red')>[ Text *here*. ]`

## Extension

By default, Luatwine's built-in functionality is deliberately limited to improve performance and reduce bloat. However, adding in the functionality you need is usually trivial thanks to the flexibility of Lua.

For example, suppose you need to know if a given passage has been visited before - something like `$firstVisit[ Ask for her name ] $else[ Ask for her number ]`. You could add the following code blocks:
```lua
-- In a 'startup' passage
visitedSet = {}
function firstVisit(content)
    return iff(visitedSet[passage.name])(content)
end

-- In a 'footer' passage
visitedSet[passage.name] = true
```
