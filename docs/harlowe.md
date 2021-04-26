---
description: Equivalent functionality in Harlowe 3.2.1
---

# Harlowe

Examples taken from the [Harlowe online documentation](https://twine2.neocities.org/)

{% hint style="warning" %}
Harlowe and Moontale have fundamentally different use-cases! This guide is not exhaustive - in particular, it does not cover Styling, Input, Transitions, and utility functions.
{% endhint %}

## Hooks vs. Render functions

In Harlowe, a Hook is a specific _instance_ of content in a passage. A Hook can be hidden or shown at will, causing it to be inserted/removed from the passage text. A Hook name, when used in code, acts like a selector and is used to modify all Hooks with that name.

In contrast, Moontale render functions are a set of instructions for displaying content. Render functions can be combined with Changers, stored and retrieved like normal variables, and used in-line with other text as many times as desired. It is not possible to select and mutate text segments that have already been outputted; instead, use a variable to control what is outputted in a given block and call `reload()` to make the changes visible.

## Syntax

The following syntax is identical in both Harlowe and Moontale:

* `[[Passage]]`
* `[[Link -> Target]]`
* `[[Target <- Link]]`
* `~~Strike through~~`
* `*Emphasis*`
* `**Strong emphasis**`
* `$variable`
* Special passage tags: `startup`, `header`, and `footer`

<table>
  <thead>
    <tr>
      <th style="text-align:left">Harlowe</th>
      <th style="text-align:left">Moontale</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left"><code>[[Label -&gt; $target]]</code>
      </td>
      <td style="text-align:left"><code>$link(target)[Label]</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>//Italics//</code>
      </td>
      <td style="text-align:left"><code>*Italics*</code> or <code>_Italics_</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&apos;&apos;Bold&apos;&apos;</code>
      </td>
      <td style="text-align:left"><code>**Bold**</code>or <code>__Bold__</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&lt;custom-tag&gt;Text&lt;/custom-tag&gt;</code>
      </td>
      <td style="text-align:left"><code>$style.custom_tag[Text]</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>|foo)[Text]</code> or <code>[Text](foo|</code>
      </td>
      <td style="text-align:left"><code>$name.foo[Text]</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>|foo&gt;[Text]</code> or <code>[Text]&lt;foo|</code>
      </td>
      <td style="text-align:left"><code>$name.foo[Text] $foo</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(show: ?foo)</code>
      </td>
      <td style="text-align:left">
        <p><code>$If(foo)[ ... ]</code>
        </p>
        <p><code>{$ foo = true; reload() $}</code>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>?Passage</code>
      </td>
      <td style="text-align:left"><code>passage.content</code> (a <a href="concepts.md#render-functions">Render Function</a>)</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>?Page</code>, <code>?Sidebar</code>, <code>?Link</code>
      </td>
      <td style="text-align:left">&#x26A0;&#xFE0F; <b>Not supported</b>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>[==</code>
      </td>
      <td style="text-align:left"><code>[</code> - Content blocks are closed automatically &#x1F6A7;</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>`[[ ]]`</code>
      </td>
      <td style="text-align:left"><code>&lt;$ &apos;[[ ]]&apos; $&gt;</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>``Single grave: ` ``</code>
      </td>
      <td style="text-align:left"><code>Single grave: `</code> 
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&lt;$ $&gt; {$ $}</code>
      </td>
      <td style="text-align:left">
        <p><code>&lt;$ &apos;&lt;$ $&apos;..&apos;&gt; {$ $}&apos; $&gt;</code>
        </p>
        <p>See <a href="conventions-and-caveats.md#the-parser-is-dumb">The parser is dumb</a>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code> * Bulleted item</code>
        </p>
        <p><code>    *    Bulleted item 2</code>
        </p>
        <p><code>  ** Indented bulleted item</code>
        </p>
      </td>
      <td style="text-align:left">
        <p><code>* Bulleted item</code>
        </p>
        <p><code>* Bulleted item 2</code>
        </p>
        <p><code>    * Indented bulleted item</code>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>0. Numbered item</code>
        </p>
        <p><code>   0. Numbered item 2</code>
        </p>
        <p><code> 0.0. Indented numbered item</code>
        </p>
      </td>
      <td style="text-align:left">
        <p><code>1. Numbered item</code>
        </p>
        <p><code>1. Numbered item 2</code>
        </p>
        <p><code>    1. Indented numbered item</code>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>==&gt;</code>, <code>=&gt;&lt;=</code>, <code>&lt;==&gt;</code>, and <code>&lt;==</code>
      </td>
      <td style="text-align:left"><code>$align.right[</code>, <code>$align.center[</code>, <code>$align.justify[</code>,
        and <code>$align.left[</code> 
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>===&gt;&lt;=</code>, <code>=&gt;&lt;=====</code> etc.</td>
      <td style="text-align:left">
        <p>&#x26A0;&#xFE0F; <b>Not supported</b>
        </p>
        <p>You&apos;d need custom tags for this</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>|==</code>, <code>=|||=</code> etc.</td>
      <td style="text-align:left">
        <p>&#x26A0;&#xFE0F; <b>Not supported</b>
        </p>
        <p>You&apos;d need custom tags for this</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>   # Heading</code>
      </td>
      <td style="text-align:left"><code># Heading</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>{ Single</code>
        </p>
        <p><code>line }</code>
        </p>
        <p><code>New line</code>
        </p>
      </td>
      <td style="text-align:left">
        <p><code>Single </code>
        </p>
        <p><code>line \</code>
        </p>
        <p><code>New line</code>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>Single \</code>
        </p>
        <p><code>Line</code>
        </p>
        <p><code>\ text</code>
        </p>
        <p><code>New line</code>
        </p>
      </td>
      <td style="text-align:left">
        <p><code>Single</code>
        </p>
        <p><code>Line</code>
        </p>
        <p><code>text \</code>
        </p>
        <p><code>New line</code>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>(set: $foo to 5)</code>
        </p>
        <p><code>(put: 5 into $foo)</code>
        </p>
      </td>
      <td style="text-align:left"><code>{$ foo = 5 $}</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(set: num-type $foo to 5)</code> and friends</td>
      <td style="text-align:left">
        <p>&#x26A0;&#xFE0F; <b>Not supported</b>
        </p>
        <p>May be possible using <a href="https://github.com/andremm/typedlua">Typed Lua</a>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(set: _foo to 5)</code>
      </td>
      <td style="text-align:left">
        <p>&#x26A0;&#xFE0F; <b>Not supported</b>
        </p>
        <p>Use global <code>$foo</code> or <code>local foo</code> in code blocks</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(move: $foo into $bar)</code>
      </td>
      <td style="text-align:left"><code>{$ bar = foo; foo = nil $}</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(print: $foo)</code>
      </td>
      <td style="text-align:left"><code>$foo</code> (but note the edge-cases!)</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(set: $foo to (print: $bar))</code>
      </td>
      <td style="text-align:left"><code>$name.foo[$bar]</code> or <code>{$ foo = function() show(bar) end $}</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(if: $legs is 8)</code>
      </td>
      <td style="text-align:left"><code>$If(legs == 8)</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(hidden:)</code>
      </td>
      <td style="text-align:left"><code>$If(false)</code> if you really need it - but you probably want to
        use <code>name</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(if: x is 5)[Show] (else:)[Hide] (else:)[Show]</code>
      </td>
      <td style="text-align:left"><code>$If(x == 5)[Show Show] $Else[Hide]</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(for: each _item, ...$array)</code>
      </td>
      <td style="text-align:left"><code>$forEach(array)</code> with <code>value</code> as the iterator, or <code>$forEach(array, &apos;key&apos;, &apos;item&apos;)</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(for: each _value, 2, 4, 6, 8)</code>
      </td>
      <td style="text-align:left"><code>$forEach{2, 4, 6, 8}</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(for: _ingredient where it contains &quot;petal&quot;, ...$reagents)</code>
      </td>
      <td style="text-align:left"><code>$forEach(reagents)[$If(string.find(value, &apos;petal&apos;) [ ... ]]</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(for: each _i, ...(range:1,10))</code>
      </td>
      <td style="text-align:left"><code>$Repeat(10)</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(either: &quot;a&quot;, &quot;b&quot;, &quot;c&quot;)</code>
      </td>
      <td style="text-align:left"><code>$random(&apos;a&apos;, &apos;b&apos;, &apos;c&apos;)</code>&#x1F6A7;</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(either: ...$array)</code>
      </td>
      <td style="text-align:left"><code>$random(table.unpack(array))</code>&#x1F6A7;</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(cond: x is 1, &quot;a&quot;, x is 2, &quot;b&quot;)</code>
      </td>
      <td style="text-align:left"><code>&lt;$ {&apos;a&apos;, &apos;b&apos;}[x] $&gt;</code> 
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(cond: x is &apos;a&apos;, 1, x is &apos;b&apos;, 2)</code>
      </td>
      <td style="text-align:left"><code>&lt;$ {a = 1, b = 2}[x] $&gt;</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(v6m:)[ \(`A`)/ ]</code>
      </td>
      <td style="text-align:left"><code>&lt;$ &apos;\(`A`)/&apos; $&gt;</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(print: &quot;**foo**&quot;)</code>
      </td>
      <td style="text-align:left">See <a href="conventions-and-caveats.md#text-output-is-not-re-parsed">Text output is not re-parsed</a>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(verbatim-print: ?hookName)</code>
      </td>
      <td style="text-align:left">
        <p>&#x26A0;&#xFE0F; <b>Not supported</b>
        </p>
        <p>It may be possible to do this by overriding the output functions to convert
          tags into Markdown tokens</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(enchant: &apos;gold&apos;, (text-colour: yellow))</code>
      </td>
      <td style="text-align:left">
        <p><code>$enchant(&apos;gold&apos;, color.yellow)[</code>
        </p>
        <p>Note the rules on <a href="conventions-and-caveats.md#immutability">Immutability</a>;
          this must be done <em>before</em> the text you want to change &#x1F6A7;</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(enchant: ?ghost, (text-style: &apos;outline&apos;))</code>
      </td>
      <td style="text-align:left">
        <p><code>{$ ghost = style.outline $}</code>
        </p>
        <p>This must be done <em>before </em>using <code>ghost</code> as a changer.
          &#x1F6A7;</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(change: &apos;gold&apos;, (text-colour: yellow))</code>
      </td>
      <td style="text-align:left">
        <p>&#x26A0;&#xFE0F; <b>Not supported</b>
        </p>
        <p>It&apos;s not possible to change existing output</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(enchant-in: ?frog, (text-colour: green))</code>
      </td>
      <td style="text-align:left">
        <p><code>$with{frog = combine(frog, color.green)}[</code>
        </p>
        <p>&#x1F6A7;</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(print: (hooks-named:</code>  <code>$companionType))</code>
      </td>
      <td style="text-align:left"><code>&lt;$ _G[companionType] $&gt;</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(a: &apos;foo&apos;, &apos;bar&apos;)</code>
      </td>
      <td style="text-align:left"><code>{&apos;foo&apos;, &apos;bar&apos;}</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(dm: &apos;a&apos;, 1, &apos;b&apos;, 2)</code>
      </td>
      <td style="text-align:left"><code>{a = 1, b = 2}</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(ds: &apos;foo&apos;, &apos;bar&apos;)</code>
      </td>
      <td style="text-align:left"><code>{foo = true, bar = true}</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(all-pass: _num where _num &gt; 1 and &lt; 14, 6, 8, 12, 10, 9)</code>
      </td>
      <td style="text-align:left">
        <p><code>all({6, 8, 12, 10, 9}, function(it) it &gt; 1 and num &lt; 14 end)</code>
        </p>
        <p>&#x1F6A7;</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(set: $foo to (macro: num-type _x, [(print: _x + 5)]))</code>
      </td>
      <td style="text-align:left"><code>{$ function foo(x) show(x + 5) end $}</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(history:) contains &quot;Cellar&quot;</code>
      </td>
      <td style="text-align:left">
        <p><code>visited[&quot;Cellar&quot;]</code>
        </p>
        <p>&#x1F6A7;</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(metadata: &quot;rarity&quot;, 5)</code>
      </td>
      <td style="text-align:left"><code>{$ passage.rarity = 5 $}</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(passage: &quot;Cellar&quot;)</code>
      </td>
      <td style="text-align:left"><code>passages[&quot;Cellar&quot;]</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>(passages:)</code>
      </td>
      <td style="text-align:left">
        <p><code>passages</code>
        </p>
        <p>Note that this is a map keyed by the passage name</p>
      </td>
    </tr>
  </tbody>
</table>



