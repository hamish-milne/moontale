---
description: Moontale's standard library
---

# Built-in Functions

## Variables

| Name | Type | Description |
| :--- | :--- | :--- |
| `passages` | Map of string to table | The set of all passages in the story, keyed by their name. |
| `passages[name].tags` | Set of string | The set of tags assigned to the passage; you can use `if(tags['my-tag'])` to check for a tag's presence |
| `passages[name].content` | Function | The rendering function for the passage's content. |
| `passages[name].position` | \[Number, Number\] | The position of the passage node in the editor, in \[x, y\] pixels |
| `passageName` | String | The name of the currently rendering passage. |
| `startPassage` | String | The name of the starting passage, as set in the editor. |

## Basics

All functions in this section do not return a value.

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `show(...)` | Any \(multiple\) | Displays each argument in the output. |
| `jump(passage)` | String |  Clears the screen and renders the passage with the given name. This will change the value of `passageName` . |
| `reload()` | None | Causes the current passage to be re-rendered. |
| `display(passage)` | String | Renders the passage with the given name in-line with the text. Note that this does _not_ change the value of `passageName`. |
| `softReset()` | None |  Jumps to `startPassage`, re-running any `startup`-tagged passages. |
| `hardReset()` | None | Clears all user-defined variables, then does a `softReset()`. This is a 'best effort' function - it is possible to 'leak' state into places that this function won't touch, such as the `passages` table. If this is a concern, the host should destroy and re-create the Lua VM. |

## Saving and loading

## Changers

A 'changer' is something that modifies a block of content - for example hiding/showing it, wrapping it with some formatting, or rendering it multiple times. Behind the scenes, changers are higher-order functions; they can be called with a single argument, which itself is a parameter-less function that renders the attached content. This means that `$em[Text]` is functionally equivalent to `<$ em(function() text('Text') end) $>`, and `<$color('red')$>[Text]` is the same as `<$color('red')(function() text('Text') end)$>`

As a convenience, built-in changers will convert a single string argument to a content rendering function. So instead of `em(function text('Text') end)` you could write `em('Text')`.

All functions in this section are themselves Changers, or return a Changer function.

{% hint style="warning" %}
If an entry is listed without parentheses, it should be used as such: for example, `$_else[ Text ]` , **not** `<$ _else() $>[ Text ]`
{% endhint %}

### Conditionals

{% hint style="info" %}
The capitalization is required to avoid conflicting with Lua keywords
{% endhint %}

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `If(condition)` | Boolean |  Renders its content if `condition` is truthy |
| `Else` |  |  Renders its content if the previous `If` and none of the `ElseIf` calls following it were entered |
| `ElseIf(condition)` | Boolean |  Renders its content if `condition` is truthy _and_ the previous `If` and none of the `ElseIf` calls following it were entered |

### Formatting

All the functions here call `push` and `pop` with the first argument being their own name. Ultimately the host decides how these will be displayed, so the description here is more of a 'serving suggestion'.

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `em` |  | Emphasises the text, typically with italics |
| `strong` |  | Strongly emphasises the text, typically by making it bold |
| `u` |  | Underlines the text |
| `s` |  | Strikes-through the text |
| `p` |  | Puts the content in its own paragraph |
| `color(color)` | String | Colours the text with the given [colour name](https://www.w3schools.com/colors/colors_names.asp) |

### Interactivity

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `click(fn)` | Function | Executes `fn` when the content is clicked |
| `link(passage)` | String | Jumps to `passage` when the content is clicked |
| `a(id)` | Integer | Marks the content as interactive and assigns an event ID to it, which is passed to `raiseEvent` by the host. This is a low-level function; you probably won't call this directly. |

### Repetition

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `Repeat(count)` | Integer |  Renders the content `count` times in a row |
| `forEach(iterable)` | Table |  Renders the content for each item in `iterable`, setting the variables `key` and `value` to the key and value of each entry. This is equivalent to `forEach(iterable, 'key', 'value')`. |
| `forEach(iterable, ...)` | Table, String \(multiple\) | Renders the content for each item in `iterable`, mapping each entry to variables with the names given in the subsequent arguments. |

### Transformation

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `replace(pattern, replacement)` | String, String | Executes a [pattern](https://www.lua.org/pil/20.2.html) replacement on the `text()` emissions within the block |
| `strip(...)` | String \(multiple\) |  Causes all `push(tag)` emissions \(with their paired `pop()`s\) to be dropped. For example, `<$strip('em')$>[ Some $em[text] ]` will render `Some text` without the `em` instruction of the inner block. |

### Miscellaneous

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `name(name)` | String | Hides the block, and assigns it to a variable named `name`. The block can subsequently be displayed with `$name`. |
| `combine(...)` | Changer \(multiple\) | Creates a Changer that combines each of its Changer arguments in order of outer-most to inner-most. For example, `<$combine(em, u)$>[Text]` equates to `$em[$u[Text]]`. |
| `freeze` |  | Renders the block's content and caches it, so that subsequent calls don't execute any embedded code a second time. |

## Output

These are the low-level functions that produce user-visible text, and need to be implemented by the Host. You probably won't call these from Moontale directly \(but you can, if you know what you're doing!\)

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `push(tag, ...)` | String, Any \(multiple\) | Encloses all further output in `tag`, until `pop()` is called. |
| `pop()` | None | Ends the tag from the last un-popped `push()` instruction. `push()` and `pop()` must be balanced. |
| `text(text)` | String | Outputs the given text string \(the argument _must_ be a string; use `show` if the argument might not be one\) |
| `object(tag, ...)` | String, Any \(multiple\) | Outputs the given non-text object \(e.g. `hr`\). |
| `clear()` | None | Clears the screen; normally called just before rendering a passage |
| `log(message, trace)` | String, String | Emits a diagnostic message, such as a rendering error |

{% hint style="danger" %}
Moontale overrides the `clear` function on start-up to facilitate proper event handling.  
In general, once the Host registers these functions it should not change them for the lifetime of the Lua VM
{% endhint %}

Note that _any_ tag can be given as an argument to `push` and `object`; the list of valid tags will ultimately depend on the Host. The browser runner, for instance, will faithfully emit all tags as HTML. As a baseline, all the tags of the eponymous [Formatting](built-in-functions.md#formatting) functions, along with `a(id)`,  should be supported.

Most tags do not take any additional arguments. Notable exceptions are `color(color)` and `a(id)`. When developing custom tag conventions, you should use simple arguments \(string, number etc.\) rather than complex tables.

### Input

While the Host can call any library-defined or user-defined Moontale function, the following should be called solely by the Host \(unless your intention is to simulate user actions\):

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `raiseEvent(event, id, ...)` | String, Integer, Any \(multiple\) | Called when the named event occurs on the content with the given ID \(previously indicated by `push('a', id)`\) |

The following is a non-exhaustive list of event names, a subset of the [HTML DOM events](https://developer.mozilla.org/en-US/docs/Web/Events):

| Name | Description |
| :--- | :--- |
| `click` | The element was clicked or tapped on |
| `mouseover` | The cursor entered the element's bounding region |
| `mouseout` | The cursor exited the element's bounding region |

The Host should note that raising an event can call one or more of the Output functions, resulting in the content on screen changing and the mapping of IDs to user-visible content changing. If `clear()` is called as a result of an event, the Host should ignore any other events until the new content is on screen. This may result in e.g. `mouseover` and `mouseout` being un-balanced.

