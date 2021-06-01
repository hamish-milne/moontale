import { markdownToLua, storyToLua } from "./convert"
import { JSDOM } from "jsdom"

describe("Compiler", () => {

    describe("Markdown to Lua conversion", () => {

        function check(input: string, output: string[]) {
            let out: string[] = []
            markdownToLua(input, out, {level: 0, links: []})
            output.splice(0, 0, "Style.p(function()")
            output.push("end)")
            expect(out.map(x => x.trim())).toEqual(output)
        }

        it("renders plain text", () => {
            check(
                "Some plain text",
                ["Text('Some plain text ')"]
            )
        })

        it("renders smartquotes", () => {
            check(
                "\"Quoted!\"",
                ["Text('\u201cQuoted!\u201d ')"]
            )
        })

        it("renders normal markup", () => {
            check(
                "*italics*, **bold**",
                ["Style.em(function()", "Text('italics ')", "end)", "Text(', ')", "Style.strong(function()", "Text('bold ')", "end)"]
            )
        })

        it('renders Lua variables', () => {
            check(
                'foo: $foo',
                ["Text('foo: ')", "Show(foo)"]
            )
        })

        it('renders Lua expression blocks', () => {
            check(
                "foo: <$ foo(\n) $>",
                ["Text('foo: ')", "Show( foo(\n) )"]
            )
        })

        it('renders Lua script blocks', () => {
            check(
                "foo: {$ foo(\n) $}",
                ["Text('foo: ')", 'foo(\n)']
            )
        })

        it('renders Lua variables as changers', () => {
            check(
                "$foo.bar[Text]",
                ["AsChanger(foo.bar)(function()", "Text('Text ')", "end)"]
            )
        })

        it('renders Lua expressions as changers', () => {
            check(
                "<$ foo.\nbar $>[Text]",
                ["AsChanger( foo.\nbar )(function()", "Text('Text ')", "end)"]
            )
        })

        it('renders passage links', () => {
            check(
                "a link: [[*Label*->Target]]",
                ["Text('a link: ')", "Link('Target')(function()", "Style.em(function()", "Text('Label ')", "end)", "end)"]
            )
        })

        it('handles hard and soft line breaks', () => {
            check(
                "A\nB  \nC",
                ["Text('A ')", "Text('B ')", "Object('br')", "Text('C ')"]
            )
        })

        it("can apply changers to links", () => {
            check(
                "$foo[[Label->Target]]",
                ["Combine(AsChanger(foo), Link('Target'))(function()", "Text('Label ')", "end)"]
            )
        })

        it("can render inline links", () => {
            check(
                "[[ ->Target]]",
                ["Display('Target')"]
            )
        })

        it("auto-closes content blocks", () => {
            check(
                "$foo[$bar[Text",
                ["AsChanger(foo)(function()", "AsChanger(bar)(function()", "Text('Text ')", "end)", "end)"]
            )
        })

        it("parses multi-line code elements", () => {
            check(
                "foo {$ bar\n\nbaz\n\n$} bar",
                ["Text('foo ')", 'bar\n\nbaz', "Text(' bar ')"]
            )
        })
    })

    describe("Story to Lua conversion", () => {

        function check(input: string, output: string) {
            let div = new JSDOM().window.document.createElement('div')
            div.innerHTML = input
            expect(storyToLua(div.firstElementChild)).toBe(`-- Generated with Moontale\n${output}`)
        }

        it('can convert simple story', () => {
            check(
`<tw-storydata name="Test" startnode="1">
    <tw-passagedata pid="1" name="Foo" tags="", position="1,2">Text</tw-passagedata>
</tw-storydata>
`,
`story = 'Test'
Passages = {
  ['Foo'] = {
    tags = {  },
    position = {1,2},
    content = function()
      Style.p(function()
        Text('Text ')
      end)
    end,
    links = {  }
  },
}
StartPassage = 'Foo'`
            )
        })
    })
})