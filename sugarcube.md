---
description: Equivalent functionality in Sugarcube v2
---

# Sugarcube

Examples taken from the [Sugarcube online documentation](http://www.motoslave.net/sugarcube/2/docs)

{% hint style="warning" %}
Sugarcube and Moontale have fundamentally different use-cases! This guide is not exhaustive - in particular, it does not cover the DOM, Input, Audio, or utility functions.
{% endhint %}

## Macros and Functions

As a rule, Moontale makes no distinction between a 'macro' and a 'function'. The changer syntax `$foo[Text]` makes use of `foo` as a Lua function, and using it in code e.g. `{$ x = foo(y) $}` is just as valid.

## Syntax

The following syntax is identical in Sugarcube and Moontale:

* `[[Passage]]`
* `[[Link -> Target]]`
* `[[Target <- Link]]`
* `$variable`
* `* Unordered lists`
* `> Blockquote`

<table>
  <thead>
    <tr>
      <th style="text-align:left">Sugarcube</th>
      <th style="text-align:left">Moontale</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left"><code>&lt;&lt;print $name&gt;&gt;</code>
      </td>
      <td style="text-align:left"><code>{$ show(name) $}</code> 
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&lt;&lt;= 2 + 3&gt;&gt;</code>
      </td>
      <td style="text-align:left"><code>&lt;$ 2 + 3 $&gt;</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&quot;&quot;&quot;No markup&quot;&quot;&quot;</code>
      </td>
      <td style="text-align:left"><code>&lt;$ &apos;No markup&apos; $&gt;</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>{{{$name}}}</code>
      </td>
      <td style="text-align:left"><code>`$name`</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>[[Label|Target]]</code> and <code>[[Label][Target]]</code>
      </td>
      <td style="text-align:left"><code>[[Label-&gt;Target]]</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>[[Go buy milk|Grocery][$bought to &quot;milk&quot;]]</code>
      </td>
      <td style="text-align:left"><code>$click(function() bought = &apos;milk&apos;; jump(&apos;Grocery&apos;) end)[Go buy milk]</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>[img[Image][Link]]</code> etc.</td>
      <td style="text-align:left">&#x26A0;&#xFE0F; <b>Not supported</b>
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
      <td style="text-align:left"><code>!Heading 1</code>
      </td>
      <td style="text-align:left"><code># Heading 1</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>!!Heading 2</code>
      </td>
      <td style="text-align:left"><code>## Heading 2</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>//Emphasis//</code>
      </td>
      <td style="text-align:left"><code>*Emphasis*</code> or <code>_Emphasis_</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&apos;&apos;Strong&apos;&apos;</code>
      </td>
      <td style="text-align:left"><code>**Strong**</code> or <code>__Strong__</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>==Strikethrough==</code>
      </td>
      <td style="text-align:left"><code>~~Strikethrough~~</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>__Underline__</code>
      </td>
      <td style="text-align:left"><code>$u[Underline]</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code># Item 1</code>
        </p>
        <p><code># Item 2</code>
        </p>
      </td>
      <td style="text-align:left">
        <p><code>1. Item 1</code>
        </p>
        <p><code>1. Item 2</code>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>{{{Code}}}</code>
      </td>
      <td style="text-align:left"><code>`Code`</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>{{{<br />Code<br />}}} </code>
      </td>
      <td style="text-align:left"><code>```</code>
        <br /><code>Code<br />```</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>----</code>
      </td>
      <td style="text-align:left"><code>---</code> or <code>***</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">Templates, e.g. <code>?He was always willing to lend ?his ear to anyone.</code>
      </td>
      <td style="text-align:left">
        <p><code>$name(&apos;myTemplate&apos;)[$He was always willing to lend $his ear to anyone.]</code>
        </p>
        <p><code>$with{He = &apos;She&apos;, his = &apos;her&apos;}[$myTemplate]</code>&#x1F6A7;</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>/* Comment */</code>
        </p>
        <p><code>/% Comment %/</code>
        </p>
        <p><code>&lt;!-- Comment --&gt;</code>
        </p>
      </td>
      <td style="text-align:left"><code>{$--[[ Comment --]]$}</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&lt;&lt;capture foo bar&gt;&gt;</code>
      </td>
      <td style="text-align:left"><code>{$ local foo = foo; local bar = bar $}</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&lt;&lt;run foo()&gt;&gt;</code> and <code>&lt;&lt;script&gt;&gt;foo()&lt;&lt;/script&gt;&gt;</code>
      </td>
      <td style="text-align:left">
        <p><code>{$ foo() $}</code>
        </p>
        <p>(Of course, this is Lua rather than JavaScript)</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&lt;&lt;set $gold to 5&gt;&gt;</code>
      </td>
      <td style="text-align:left"><code>{$ gold = 5 $}</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&lt;&lt;unset $cheese, $gold&gt;&gt;</code>
      </td>
      <td style="text-align:left"><code>{$ cheese = nil; gold = nil $}</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&lt;&lt;include &quot;Go West&quot;&gt;&gt;</code>
      </td>
      <td style="text-align:left"><code>$display(&quot;Go West&quot;)</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&lt;&lt; if $cash lt 5&gt;&gt;</code>
      </td>
      <td style="text-align:left"><code>$If(cash &lt; 5)[</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&lt;&lt;for i, name range $dwarves&gt;&gt;</code>
      </td>
      <td style="text-align:left"><code>$forEach(dwarves)[</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&lt;&lt;break&gt;&gt;</code> and <code>&lt;&lt;continue&gt;</code>
      </td>
      <td style="text-align:left">Not supported in markup - use a script block with a <code>for</code> loop</td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>&lt;&lt;switch $hairColor&gt;&gt;</code>
        </p>
        <p><code>&lt;&lt;case &quot;black&quot; &quot;brown&quot;&gt;&gt;</code>
        </p>
        <p><code>        Dark haired, eh?</code>
        </p>
        <p><code>&lt;&lt;default&gt;&gt;</code>
        </p>
        <p><code>&lt;&lt;/switch&gt;&gt;</code>
        </p>
      </td>
      <td style="text-align:left">
        <p><code>$switch(hairColor)</code> 
          <br /><code>$case(&apos;black&apos;, &apos;brown&apos;)[ Dark haired, eh? ]</code>
        </p>
        <p><code>$Else[  ]</code>&#x1F6A7;</p>
      </td>
    </tr>
  </tbody>
</table>



