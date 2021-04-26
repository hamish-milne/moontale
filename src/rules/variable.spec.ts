import chai from "chai";
import MarkdownIt from "markdown-it";
import StateInline from "markdown-it/lib/rules_inline/state_inline";
import Token from "markdown-it/lib/token";
import rule from "./variable"

const assert = chai.assert

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

    function testWith(src: string) {
        let state = newState(`abc$${src} def`)
        state.pos = 3
        assert.isTrue(rule(state, false), "Rule didn't match")
        let expected = new Token('code_variable', '', 0)
        expected.content = src
        assert.deepEqual(state.tokens, [expected])
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

    it("matches expression sequence", () => {
        testWith("foo.bar{}.baz().bat")
    })
})