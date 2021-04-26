import chai from "chai";
import { loadStory, raiseEvent, start } from "./runtime" 
import { readFileSync } from "fs"

const assert = chai.assert
let moontaleLib = readFileSync(`${__dirname}/moontale.lua`, "utf-8")

describe("JS runtime", () => {

    it("emits HTML for push/pop/text/object", () => {
        let html: string
        loadStory([moontaleLib,
            `function softReset() clear(); push('p'); text('text'); object('hr'); pop() end`
        ], x => html = x, () => {})
        start()
        assert.equal(html, "<p>text<hr></p>")
    })

    it("responds to events from link tags", () => {
        let html: string
        loadStory([moontaleLib, `
            function softReset() clear(); link('Target')('text') end
            function raiseEvent(event, id) clear(); text(event); text('='); text(id) end`
        ], x => html = x, () => {})
        start()
        assert.equal(html, `<a href="#" id="1">text</a>`)
        raiseEvent("click", "1")
        assert.equal(html, "click=1")
    })
})