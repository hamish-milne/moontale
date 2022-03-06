---
description: Learn how to write Moontale passages
---

# Syntax

## Formatting

Moontale supports most standard Markdown syntax.

<table>
  <thead>
    <tr>
      <th style="text-align:left">Syntax</th>
      <th style="text-align:left">Alternative</th>
      <th style="text-align:left">Output</th>
      <th style="text-align:left">Tag</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">
        <p><code>Paragraph 1</code> 
        </p>
        <p>&lt;code&gt;&lt;/code&gt;</p>
        <p><code>Paragraph 2</code>
        </p>
      </td>
      <td style="text-align:left"></td>
      <td style="text-align:left">
        <p>Paragraph 1</p>
        <p></p>
        <p>Paragraph 2</p>
      </td>
      <td style="text-align:left"><code>p</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>Line 1    </code>
        </p>
        <p><code>Line 2</code>
        </p>
      </td>
      <td style="text-align:left"></td>
      <td style="text-align:left">
        <p>Line 1</p>
        <p>Line 2</p>
      </td>
      <td style="text-align:left"><code>br</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>*Italic*</code>
      </td>
      <td style="text-align:left"><code>_Italic_</code>
      </td>
      <td style="text-align:left"><em>Italic</em>
      </td>
      <td style="text-align:left"><code>em</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>**Bold**</code>
      </td>
      <td style="text-align:left"><code>__Bold__</code>
      </td>
      <td style="text-align:left"><b>Bold</b>
      </td>
      <td style="text-align:left"><code>strong</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>~Strikethrough~</code>
      </td>
      <td style="text-align:left"></td>
      <td style="text-align:left"><del>Strikethrough</del>
      </td>
      <td style="text-align:left"><code>s</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code># Heading 1</code>
      </td>
      <td style="text-align:left">
        <p><code>Heading 1</code>
        </p>
        <p><code>=========</code>
        </p>
      </td>
      <td style="text-align:left"></td>
      <td style="text-align:left"><code>h1</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>## Heading 2</code>
      </td>
      <td style="text-align:left">
        <p><code>Heading 2</code>
        </p>
        <p><code>---------</code>
        </p>
      </td>
      <td style="text-align:left"></td>
      <td style="text-align:left"><code>h2</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>### Heading 3</code>
      </td>
      <td style="text-align:left"></td>
      <td style="text-align:left"></td>
      <td style="text-align:left"><code>h3</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>Blockquote</code>
      </td>
      <td style="text-align:left"></td>
      <td style="text-align:left"></td>
      <td style="text-align:left"><code>blockquote</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>* Item 1</code>
        </p>
        <p><code>  * Item 2</code>
        </p>
        <p><code>* Item 3</code>
        </p>
      </td>
      <td style="text-align:left">
        <p><code>- Item 1</code>
        </p>
        <p><code>  - Item 2</code>
        </p>
        <p><code>- Item 3</code>
        </p>
      </td>
      <td style="text-align:left">
        <ul>
          <li>Item 1
            <ul>
              <li>Item 2</li>
            </ul>
          </li>
          <li>Item 3</li>
        </ul>
      </td>
      <td style="text-align:left">
        <p><code>ul</code>
        </p>
        <p><code>li</code>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>1. One</code>
        </p>
        <p><code>  1. One A</code>
        </p>
        <p><code>2. Two</code>
        </p>
      </td>
      <td style="text-align:left">
        <p><code>1) One</code>
        </p>
        <p><code>  1) One A</code>
        </p>
        <p><code>2) Two</code>
        </p>
      </td>
      <td style="text-align:left">
        <ol>
          <li>One
            <ol>
              <li>One A</li>
            </ol>
          </li>
          <li>Two</li>
        </ol>
      </td>
      <td style="text-align:left">
        <p><code>ol</code>
        </p>
        <p><code>li</code>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>`Preformatted`</code>
      </td>
      <td style="text-align:left"></td>
      <td style="text-align:left"><code>Preformatted</code>
      </td>
      <td style="text-align:left"><code>pre</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>---</code>
      </td>
      <td style="text-align:left"><code>***</code>
      </td>
      <td style="text-align:left">Horizontal rule</td>
      <td style="text-align:left"><code>hr</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&amp;yen;</code>
      </td>
      <td style="text-align:left">
        <p><code>&amp;#x000A5;</code>
        </p>
        <p><code>&amp;#165;</code>
        </p>
      </td>
      <td style="text-align:left">&#xA5;</td>
      <td style="text-align:left">UTF-8</td>
    </tr>
  </tbody>
</table>

The following Markdown elements are **not** supported:

* Hyperlinks, of the form `[Label](Target)` and `https://...`
* Images, of the form `![Image](Source)`
* Raw HTML tags

## Passage links

Moontale supports the Twine standard format for passage links.

* `[[Passage]]`
* `[[Label->Passage]]`
* `[[Passage<-Label]]`

The Twine editor looks for links like these, and uses them to draw pretty lines between passages. When you rename a passage in the editor, it will automatically update any links that use the syntax above.

You can also use code to create a link: `$Link('Passage')[Label]` - but the link lines and auto-updating won't work in this case, so you should use the standard syntax wherever possible.

In links with a separate label and target, the label can contain any inline syntax: bold/italics, variables, expressions, etc. It cannot contain line-based syntax such as headers or lists. The target is _not_ parsed further, so `[[Label->$foo]]` will look for a passage named `$foo`, not the value of the `foo` variable. To calculate the target dynamically, use `$Link(foo)[Label]`.

### Embed links

A passage link with a blank label, like `[[ ->Passage]]` will embed the passage directly in the body rather than creating a clickable link. This is equivalent to `$Display('Passage')` , but with the benefits of link lines, rename handling and so on.

## Scripting

There are three ways to embed Lua code into a passage:

* Variables: `$x`
* Expressions: `<$ x $>`
* Scripts: `{$ show(x) $}`

The Variable syntax will look up the value of the variable in question, and display it. The variable name must begin with an ASCII letter or underscore, which is followed by a contiguous sequence of ASCII letters, numbers, or underscores. This ensures that monetary values in the text e.g. `$1.10` will display as intended.

{% hint style="info" %}
 If for some reason you want to look up a variable with a non-identifier name, you can use `<$ _G['1.10'] $>`
{% endhint %}

Short-form variables are of course limited to a single identifier. To show the result of an expression - a function call, arithmetic, or similar - you can use the expression syntax: `<$ 1 + 2 + 3 $>` will print '6'. You can add whitespace and new-lines anywhere you could ordinarily with Lua, without affecting the output.

If your expression is limited to a sequence of property accesses \( `foo.bar` \) and calls \( `foo(bar)` or `foo{a = 1}`\), and doesn't include any line breaks, you can omit the `<$ $>` tokens: `$foo.bar(function() show('abc') end).baz` is valid! Note that extra whitespace around the joining `.` and `( )` tokens isn't allowed. Indexers with `[ ]` aren't valid because they would conflict with the Changer syntax.

{% hint style="danger" %}
Remember that [The Parser is Dumb](conventions-and-caveats.md#the-parser-is-dumb). Scanning for 'call' expressions is done by balancing `(` and `)` , so if you have a string literal with `)` it will cause issues! Use the `<$ $>` markers in this case.
{% endhint %}

Expressions are limited to a single, well, expression. If you want to run code with statements, such as to set variables and define functions, you can use the script block syntax, e.g. `{$ x = 5 $}`, which will set the value of 'x' to '5'. Script blocks only generate output if explicit calls to `show()` and friends are made. As with expressions, you can add whitespace anywhere you like.

 Internally, short-form variables expand to expressions, which in turn expand to script blocks with an inner call to `show()`. So `$foo` expands to `<$ foo $>` which expands to `{$ show(foo) $}`.

## Lambda

When using untagged Lua expressions in markdown, Moontale adds an additional 'call' operator: `<< >>` , the 'Lambda' syntax, which wraps its body in an anonymous function and passes it to the preceding expression. This makes interactivity Changers easier to write: instead of `$On.click(function() x = x + 1 end)` you can write `$On.click<<x = x + 1>>`. You can combine multiple statements with `;`, for example `$On.click<<x = x + 1; y = y - 1>>`

A Lambda is always a parameter-less function; if the caller passes in any arguments, you won't be able to access them. You can, however, return values with `return` as the final statement, if needed.

Lambdas are not parsed in tagged expressions \(`<$ $>`\), nor in script blocks \(`{$ $}`\).

## Changers

If a short-form variable or expression immediately precedes a 'content block' - any content surrounded by `[` and `]` - it will be treated as a 'changer' with the content block applied to it. Changer blocks can be nested infinitely.

A content block without an attached changer expression will generate a warning \(because there is no reason to do this\) but will otherwise be shown normally. So `[Text]` will display as `Text`.

You can also apply changers to any of the link syntaxes, e.g. `$Color.red[[Label->Target]]`.

