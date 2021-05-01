import MarkdownIt from "markdown-it";
import StateInline from "markdown-it/lib/rules_inline/state_inline";
import Token from "markdown-it/lib/token";
import rule from "./variable"

describe("Lua variable rule", () => {
    function newState(src: string) {
        return new StateInline(src, {
            inline: {
                tokenize: function(state: StateInline) {
                    state.push('text', '', 0)
                }
            }
        } as MarkdownIt, {}, [])
    }

    function testWith(src: string, output?: string) {
        let state = newState(`abc$${src} def`)
        state.pos = 3
        expect(rule(state, false)).toBeTruthy()
        let expected = new Token('code_variable', '', 0)
        expected.content = output ?? src
        expect(state.tokens).toEqual([expected])
    }

    it("matches short variables", () => {
        testWith("foo")
    })

    it("matches property accesses", () => {
        testWith("foo.bar")
    })

    it("matches call expressions with nested parentheses", () => {
        testWith("foo(bar(1, 2), baz(3))")
    })

    it("matches table call expressions with nested braces", () => {
        testWith("foo{a = b(), c = {1,2,3}}")
    })

    it("matches single lambda expression", () => {
        testWith("foo<<x = x + 1>>", "foo(function() x = x + 1 end)")
    })

    it("matches lambda expression chain", () => {
        testWith("foo.bar<<baz>>(bat)", "foo.bar(function() baz end)(bat)")
    })

    it("matches expression sequence", () => {
        testWith("foo.bar{}.baz().bat")
    })
})