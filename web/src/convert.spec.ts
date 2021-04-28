import chai from "chai";
import { markdownToLua, storyToLua } from "./convert"
import { JSDOM } from "jsdom"

const assert = chai.assert

describe("Compiler", () => {

    describe("Markdown to Lua conversion", () => {

        function check(input: string, output: string[]) {
            let out: string[] = []
            markdownToLua(input, out, {level: 0})
            output.splice(0, 0, "push('p')")
            output.push("pop()")
            assert.deepEqual(out.map(x => x.trim()), output)
        }

        it("renders plain text", () => {
            check(
                "Some plain text",
                ["text('Some plain text')"]
            )
        })

        it("renders normal markup", () => {
            check(
                "*italics*, **bold**",
                ["push('em')", "text('italics')", "pop()", "text(', ')", "push('strong')", "text('bold')", "pop()"]
            )
        })

        it('renders Lua variables', () => {
            check(
                'foo: $foo',
                ["text('foo: ')", "show(foo)"]
            )
        })

        it('renders Lua expression blocks', () => {
            check(
                "foo: <$ foo(\n) $>",
                ["text('foo: ')", "show( foo(\n) )"]
            )
        })

        it('renders Lua script blocks', () => {
            check(
                "foo: {$ foo(\n) $}",
                ["text('foo: ')", 'foo(\n)']
            )
        })

        it('renders Lua variables as changers', () => {
            check(
                "$foo.bar[Text]",
                ["asChanger(foo.bar)(function()", "text('Text')", "end)"]
            )
        })

        it('renders Lua expressions as changers', () => {
            check(
                "<$ foo.\nbar $>[Text]",
                ["asChanger( foo.\nbar )(function()", "text('Text')", "end)"]
            )
        })

        it('renders passage links', () => {
            check(
                "a link: [[*Label*->Target]]",
                ["text('a link: ')", "link('Target')(function()", "push('em')", "text('Label')", "pop()", "end)"]
            )
        })
    })

    describe("Story to Lua conversion", () => {

        function check(input: string, output: string) {
            let div = new JSDOM().window.document.createElement('div')
            div.innerHTML = input
            assert.equal(storyToLua(div.firstElementChild), `-- Generated with Moontale\n${output}`)
        }

        it('can convert simple story', () => {
            check(
`<tw-storydata name="Test" startnode="1">
    <tw-passagedata pid="1" name="Foo" tags="", position="1,2">Text</tw-passagedata>
</tw-storydata>
`,
`story = 'Test'
passages = {
  ['Foo'] = {
    tags = {  },
    position = {1,2},
    content = function()
      push('p')
        text('Text')
      pop()
    end
  },
}
startPassage = 'Foo'`
            )
        })
    })
})