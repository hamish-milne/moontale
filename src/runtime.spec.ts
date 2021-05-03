import { loadStory, raiseEvent, start } from "./runtime" 
import { readFileSync } from "fs"

let moontaleLib = readFileSync(`${__dirname}/../lua/moontale.lua`, "utf-8")

describe("JS runtime", () => {

    it("emits HTML for push/pop/text/object", () => {
        let html: string
        loadStory([moontaleLib,
            `function SoftReset() Clear(); Push('p'); Text('text'); Object('hr'); Pop() end`
        ], x => html = x, () => {})
        start()
        expect(html).toBe("<p>text<hr></p>")
    })

    it("responds to events from link tags", () => {
        let html: string
        loadStory([moontaleLib, `
            function SoftReset() Clear(); Link('Target')('text') end
            function RaiseEvent(event, id) Clear(); Text(event); Text('='); Text(id) end`
        ], x => html = x, () => {})
        start()
        expect(html).toBe(`<a href="#" id="1">text</a>`)
        raiseEvent("click", "1")
        expect(html).toBe("click=1")
    })
})