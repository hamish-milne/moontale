---
description: Moontale's standard library
---

# Built-in Functions

## Variables

| Name | Type | Description |
| :--- | :--- | :--- |
| `Passages` | Map of string to table | The set of all passages in the story, keyed by their name. |
| `Passages[name].tags` | Set of string | The set of tags assigned to the passage; you can use `if(tags['my-tag'])` to check for a tag's presence |
| `Passages[name].content` | Function | The rendering function for the passage's content. |
| `Passages[name].position` | \[Number, Number\] | The position of the passage node in the editor, in \[x, y\] pixels |
| `PassageName` | String | The name of the currently rendering passage. |
| `StartPassage` | String | The name of the starting passage, as set in the editor. |

## Basics

All functions in this section do not return a value.

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `Show(...)` | Any \(multiple\) | Displays each argument in the output. |
| `Jump(passage)` | String | Clears the screen and renders the passage with the given name. This will change the value of `PassageName` . |
| `Once(fn)` | Function or Table | Ensures that the given function is executed when the passage is reached, and not on any subsequent `Reload`s. If a Table is passed, it treats each key-value pair as an instruction to set a variable. For example `$Once{ gold = gold + 5 }` |
| `Reload()` | None | Causes the current passage to be re-rendered. |
| `Display(passage)` | String | Renders the passage with the given name in-line with the text. Note that this does _not_ change the value of `passageName`. |
| `SoftReset()` | None | Jumps to `startPassage`, re-running any `startup`-tagged passages. |
| `HardReset()` | None | 🚧 Clears all user-defined variables, then does a `SoftReset()`. This is a 'best effort' function - it is possible to 'leak' state into places that this function won't touch, such as the `Passages` table. If this is a concern, the host should destroy and re-create the Lua VM. |

## Entities

Broadly, an Entity is a non-text object that the Host is capable of handling.

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `Entity[tag]` | String | Outputs the entity with the given name |
| `Entity.hr` |  | Outputs a horizontal line |
| `Image(path)` | String | Draws an image \(`img` entity\) with the given path |
| `Audio(path)` | String | Plays the audio file \(`audio` entity\) with the given path. You will probably want to combine this with `once`  |

## Changers

A 'changer' is something that modifies a block of content - for example hiding/showing it, wrapping it with some formatting, or rendering it multiple times. Behind the scenes, changers are higher-order functions; they can be called with a single argument, which itself is a parameter-less function that renders the attached content. This means that `$Color.red[Text]` is functionally equivalent to `$Color.red(function() Text('Text') end)`, and `$Link('Passage')[Text]` is the same as `$Link('Passage')(function() Text('Text') end)`

As a convenience, built-in changers will convert a single string argument to a content rendering function. So instead of `Style.em(function Text('Text') end)` you could write `Style.em('Text')`.

All functions in this section are themselves Changers, or return a Changer function.

{% hint style="warning" %}
If an entry is listed without parentheses, it should be used as such: for example, `$Else[ Text ]`, **not** `$Else()[ Text ]`
{% endhint %}

### Conditionals

{% hint style="info" %}
The capitalization is required to avoid conflicting with Lua keywords
{% endhint %}

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `If(condition)` | Boolean | Renders its content if `condition` is truthy |
| `Else` |  | Renders its content if neither the previous `If` or any of the `ElseIf` calls following it were entered |
| `ElseIf(condition)` | Boolean | Renders its content if `condition` is truthy _and_ neither the previous `If` or any of the `ElseIf` calls following it were entered |

### Formatting

Note that these functions are written as table indexers, allowing the 'dot' syntax where the index is a string literal \(the most common use case\).

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `Style[tag]` | String | Wraps the content in the named tag. For example, `Style.em`.  |
| `Style(tag, ...)` | String, Any | Wraps the content in the named tag, with the given additional arguments. For example, `Style('line-height', 25)` |
| `Align[alignment]` | String | Sets the named text alignment for the content. For example, `Align.left`, `Align.justify` |
| `Color[color]` | String | Colours the text with the given [colour name](https://www.w3schools.com/colors/colors_names.asp) \(not case sensitive\). For example, `Color.darkred` |

### Interactivity

{% hint style="danger" %}
When nesting interactivity changers, the resulting callbacks will all be applied to the outer-most block. This means that if you have a 'link within a link', the outer link will perform _both_ actions when clicked on.
{% endhint %}

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `On[event](callback)` | String, Function | Executes `callback` when `event` occurs over the content; for example \`$On.click |
| `Link(passage)` | String | Jumps to `passage` when the content is clicked |
| `Hover(hovering, normal)` | Changer, Changer \(optional\) | Applies the `hovering` changer when the cursor is over the content, and `normal` when it is not. For example, `Hover(Color.red, Color.blue)` . Note that any use of this function will cause a `Reload` to happen when the cursor position changes; make sure to use `Once` where appropriate! |

### Repetition

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `Repeat(count)` | Integer | Renders the content `count` times in a row, with the number of the current iteration \(1-indexed\) assigned to `index`  |
| `ForEach(iterable)` | Table | Renders the content for each item in `iterable`, setting the variables `key` and `value` to the key and value of each entry. This is equivalent to `ForEach(iterable, 'key', 'value')`. |
| `ForEach(iterable, ...)` | Table, String \(multiple\) | Renders the content for each item in `iterable`, mapping each entry to variables with the names given in the subsequent arguments. |

### Transformation

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `Replace(pattern, replacement)` | String, String | 🚧 Executes a [pattern](https://www.lua.org/pil/20.2.html) replacement on the `text()` emissions within the block |
| `Strip(...)` | String \(multiple\) | 🚧 Causes all `Push(tag)` emissions \(with their paired `Pop()`s\) to be dropped. For example, `$Strip('em')[ Some $Style.em[text] ]` will render `Some text` without the `em` instruction of the inner block. |
| `With(replacements)` | Table | 🚧 Temporarily overrides the given expressions \(table keys\) with their corresponding values. For example `With{['style.em'] = color.blue}` |

### Miscellaneous

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `Name[name]` | String | Hides the block, and assigns it to a variable named `name`. The block can subsequently be displayed with `$name`. |
| `Combine(...)` | Changer \(multiple\) | Creates a Changer that combines each of its Changer arguments in order of outer-most to inner-most. For example, `$Combine(Style.em, Style.u)[Text]` equates to `$Style.em[$Style.u[Text]]`. |
| `Freeze` |  | 🚧 Renders the block's content and caches it, so that subsequent calls don't execute any embedded code a second time. |

## Output

These are the low-level functions that produce user-visible text, and need to be implemented by the Host. You probably won't call these from Moontale directly \(but you can, if you know what you're doing!\)

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `Host` |  | A String variable identifying the current Host as a dot-separated sequence of names. For example `RichText.Unity.TMP`, `HTML`, `RichText.LOVE.SYSL` |
| `Push(tag, ...)` | String, Any \(multiple\) | Encloses all further output in `tag`, until `pop()` is called. |
| `Pop()` | None | Ends the tag from the last un-popped `push()` instruction. `push()` and `pop()` must be balanced. |
| `Text(text)` | String | Outputs the given text string \(the argument _must_ be a string; use `show` if the argument might not be one\) |
| `Object(tag, ...)` | String, Any \(multiple\) | Outputs the given non-text object \(e.g. `hr`\). |
| `Clear()` | None | Clears the screen; normally called just before rendering a passage |
| `Log(message, trace)` | String, String | Emits a diagnostic message, such as a rendering error |

{% hint style="danger" %}
Moontale overrides some of these functions on start-up to facilitate proper event handling.  
In general, once the Host registers these functions it should not change them for the lifetime of the Lua VM
{% endhint %}

Note that _any_ tag can be given as an argument to `Push` and `Object`; the list of valid tags will ultimately depend on the Host. The browser host, for instance, will faithfully emit all tags as HTML.

Most tags do not take any additional arguments. Notable exceptions are `color(color)` and `a(id)`. When developing custom tag conventions, you should use simple arguments \(string, number etc.\) rather than complex tables.

## Input

While the Host can call any library-defined or user-defined Moontale function, the following should be called solely by the Host \(unless your intention is to simulate user actions\):

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `RaiseEvent(event, id, ...)` | String, Integer, Any \(multiple\) | Called when the named event occurs on the content with the given ID |

Interactive content is indicated with `Push('a', id)`, where `id` is a sequential integer. The Host is then responsible for calling `RaiseEvent` with the ID for that span when an event occurs. Interactivity tags will never be nested.

The following is a non-exhaustive list of event names, a subset of the [HTML DOM events](https://developer.mozilla.org/en-US/docs/Web/Events):

| Name | Description |
| :--- | :--- |
| `click` | The element was clicked or tapped on |
| `mouseover` | The cursor entered the element's bounding region |
| `mouseout` | The cursor exited the element's bounding region |

The Host should note that raising an event can call one or more of the Output functions, resulting in the content on screen changing and the mapping of IDs to user-visible content changing. If `Clear()` is called as a result of an event, the Host should ignore any other events until the new content is on screen. This may result in e.g. `mouseover` and `mouseout` being un-balanced.

