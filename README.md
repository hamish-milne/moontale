---
description: 'Learn what we''re about, and get started!'
---

# Introduction

Moontale is a [Twine ](https://twinery.org/)story format that uses Lua as its scripting language. In addition to writing Lua code directly in your passages, you can convert your entire story to a single Lua file, which can be run by any "host" that supports Lua. You can also test and play your stories right in the browser, or publish them to HTML, just like any other Twine format.

## Quick start

```bash
https://hamish-milne.github.io/moontale/format.js
```

From the [**Twine 2**](https://twinery.org/2/#!/stories) editor, go to **Formats** on the sidebar, then **Add a New Format** and paste in the URL above. Make sure to select **Moontale** from the format list!

```text
# An example Moontale passage

I can use all the standard formatting: **bold**, _italics_ and so on.

Even lists:
1. First
2. Second
3. Third

To link to another passage, the standard Twine syntax works:
* [[Go forward -> Passage 2]]
* [[Passage 0 <- Go back]]
* [[More information]]

To add Lua code, I can use a script block like this: {$
  x = 2
  print(x) -- This will write to the debugging console
$}

If I've set any variables, I can use them in the text. The value of X is $x!

For more complex expressions, I can use the expression syntax:
2 + $x = <$ 2 + x $>

The '< >' means that the result will be displayed.

Some variables/expressions, called 'changers', can be applied to content in the passage:

<$_if(x == 2)$>[ Yes! My logic is sound. ]
$_else[ The walls of reality are collapsing! ]
```

## Motivation

It has always been possible, in theory at least, to use the output of Twine \(and [Twee](https://dan-q.github.io/twee2/)\) in non-browser applications. A number of other projects achieve this to some degree: Cradle, and my own Spool library. However, these solutions are hampered by their reliance on existing browser-focused story formats, which make developing and using these solutions difficult at best.

I created Moontale to help make Twine useful in all stages of game development - from prototyping to production.

### Who is this for?

* Twine 'power users' using the platform to develop games or complex mechanics, who will benefit from Lua's programmer-friendly syntax and structures.
* Developers interested in using their creations in unconventional ways, who will benefit from Lua's embeddability and extensibility.

### Who is this not for?

* Developers focused on linear storytelling, CYOA, and other projects with minimal logic \(and are only targeting the browser\). Harlowe should have everything you need.
* Developers intending to take advantage of complex browser-based features: media playback, CSS and so on. For any feature, if it's not in [TextMeshPro's Rich Text](http://digitalnativestudios.com/textmeshpro/docs/rich-text/) then Moontale probably won't support it in the browser.
* Developers who like the 'mutable' model used by Harlowe: hiding/showing parts of a passage, changing words from one to another when the user clicks something and so on. See Immutability for more details.

