---
description: Equivalent functionality in Chapbook
---

# Chapbook

Examples taken from the [Chapbook online documentation](https://klembot.github.io/chapbook/guide)

{% hint style="warning" %}
Chapbook and Moontale have fundamentally different use cases! This guide is not exhaustive.
{% endhint %}

## Syntax

The following syntax is identical in both Chapbook and Moontale:

* `[[Passage]]`
* `[[Link -> Target]]`
* `[[Target <- Link]]`
* `*Emphasis*`
* `**Strong emphasis**`
* ```Monospace```
* `Line breaks \`
* `***`
* `* Unordered lists`
* `1. Ordered lists`

<table>
  <thead>
    <tr>
      <th style="text-align:left">Chapbook</th>
      <th style="text-align:left">Moontale</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left"><code>&lt;del&gt;Strike through&lt;/del&gt;</code>
      </td>
      <td style="text-align:left"><code>~~Strike through~~</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&gt; [[Fork target]]</code>
      </td>
      <td style="text-align:left">
        <p>&#x26A0;&#xFE0F; <b>Not supported</b>
        </p>
        <p>You can use a custom tag or just the plain link to achieve this</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>[align center]</code> and friends</td>
      <td style="text-align:left"><code>$align.right[</code>, <code>$align.center[</code>, <code>$align.justify[</code>,
        and <code>$align.left[</code> &#x1F6A7;</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>[after 1 second]</code>
      </td>
      <td style="text-align:left"><code>$delay(1.0)[</code>&#x1F6A7;</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>[append]</code>
      </td>
      <td style="text-align:left">Don&apos;t leave a line break between sections</td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>[note]</code>
        </p>
        <p><code>I really need a better beginning</code>
        </p>
      </td>
      <td style="text-align:left"><code>{$ -- I really need a better beginning $}</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>{back link, label: &apos;retreat for now&apos;}</code>
      </td>
      <td style="text-align:left"><code>$back[retreat for now]</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>{restart link, label: &apos;Oh forget it all&apos;}</code>
      </td>
      <td style="text-align:left"><code>$click(hardReset)[Oh forget it all]</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>{link to: &apos;passage&apos;, label: &apos;Text&apos;}</code>
      </td>
      <td style="text-align:left"><code>$link(&apos;passage&apos;)[Text]</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>{reveal link: &apos;something odd occurred&apos;, text: &apos;I saw five deer...&apos;}</code>
      </td>
      <td style="text-align:left">
        <p><code>$revealBefore[something odd occurred]<br />$revealAfter[I saw five deer...]</code>
        </p>
        <p>Note that this will reload the passage. &#x1F6A7;</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>{reveal link: &apos;groceries&apos;, passage: &apos;Shopping list&apos;}</code>
      </td>
      <td style="text-align:left">
        <p><code>$revealBefore[groceries]</code> 
        </p>
        <p><code>$revealAfter[$display(&apos;Shopping list&apos;)]</code>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>{embed passage: &apos;L.A.&apos;}</code>
      </td>
      <td style="text-align:left"><code>$display(&apos;L.A.&apos;)</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>strength: 18</code>
        </p>
        <p><code>dexterity: 7</code>
        </p>
        <p><code>--</code>
        </p>
      </td>
      <td style="text-align:left">
        <p><code>{$ strength = 18</code>
        </p>
        <p><code>   dexterity = 7</code>
        </p>
        <p><code>$}</code>&#x1F6A7;</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>&quot;Hi, {name},&quot; your guide greets you.</code>
      </td>
      <td style="text-align:left"><code>&quot;Hi, $name,&quot; your guide greets you.</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>_unreasonablePrice: cash + 3</code>
        </p>
        <p><code>--</code>
        </p>
        <p><code>I want {_unreasonablePrice} for it</code>
        </p>
      </td>
      <td style="text-align:left"><code>I want &lt;$ cash + 3 $&gt; for it</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>[if hasKey]</code>
        </p>
        <p><code>You could try [[unlocking it]] with the key</code>
        </p>
      </td>
      <td style="text-align:left"><code>$If(hasKey)[You could try [[unlocking it]] with the key]</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>[else]</code>
        </p>
        <p><code>Nothing to do here but [[turn back]]</code>
        </p>
      </td>
      <td style="text-align:left"><code>$Else[ Nothing to do here but [[turn back]] ]</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>transportation: &apos;car&apos;</code>
        </p>
        <p><code>transportation (kilometers &gt; 1000): &apos;plane&apos;</code>
        </p>
        <p><code>--</code>
        </p>
      </td>
      <td style="text-align:left">
        <p><code>${ if(kilometers &gt; 1000) then</code>
        </p>
        <p><code>     transporation = &apos;car&apos;</code>
        </p>
        <p><code>   else</code>
        </p>
        <p><code>     transportation = &apos;car&apos;</code>
        </p>
        <p><code>   end $}</code>
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p><code>my.favorite.variable: &apos;red&apos;</code>
        </p>
        <p><code>--</code>
        </p>
      </td>
      <td style="text-align:left"><code>{$ my = { favorite = { variable = &apos;red } } $}</code>
      </td>
    </tr>
  </tbody>
</table>

