import { strictEqual } from "assert";
import fs from "fs"
import { storyToLua } from './convert'
import { loadStory, start, raiseEvent } from './runtime'

import { JSDOM } from "jsdom"

describe("Renderer", function() {

    it('parses twine passage data', function() {

        let div = new JSDOM().window.document.createElement('div')
        div.innerHTML = `
    <tw-storydata name="Test" startnode="1" creator="Twine" creator-version="2.3.13" ifid="B3B5AEA6-2952-4601-B27B-7D63F0DCEF0B" zoom="1" format="Twison" format-version="0.0.1" options="" hidden>
        <style role="stylesheet" id="twine-user-stylesheet" type="text/twine-css"></style>
        <script role="script" id="twine-user-script" type="text/twine-javascript"></script>
        <tw-passagedata pid="1" name="Untitled Passage" tags="" position="1620,564.5" size="100,100">[[test]] **foo** does this work? No, I guess? [[test-&gt;test2]] [[something-&gt;test3]] [[{abcdef}-&gt;test4]]
        </tw-passagedata>
        <tw-passagedata pid="2" name="test" tags="" position="1620,714.5" size="100,100">Double-click this passage to edit it.</tw-passagedata>
        <tw-passagedata pid="3" name="test2" tags="" position="1740,714.5" size="100,100">Double-click this passage to edit it.</tw-passagedata>
        <tw-passagedata pid="4" name="test3" tags="" position="1953,628.5" size="100,100">Double-click this passage to edit it.</tw-passagedata>
        <tw-passagedata pid="5" name="test4" tags="" position="1288,722.5" size="100,100">Double-click this passage to edit it.</tw-passagedata>
    </tw-storydata>`
        
        // console.log(executeLua(convert(div.children[0])))
    })

})