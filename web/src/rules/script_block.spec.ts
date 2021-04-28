import chai from "chai";
import MarkdownIt from "markdown-it";
import StateInline from "markdown-it/lib/rules_inline/state_inline";
import Token from "markdown-it/lib/token";
import rule from "./script_block"

const assert = chai.assert

describe("Lua script block rule", () => {
    function newState() {
        return new StateInline("abc{$def{$\nghi$}{$jkl", {} as MarkdownIt, {}, [])
    }

    it("matches on {$ $}", () => {
        let state = newState()
        state.pos = 3
        assert.isTrue(rule(state, false), "Rule didn't match")
        let expected = new Token('code_block', '', 0)
        expected.content = 'def{$\nghi'
        assert.deepEqual(state.tokens, [expected])
    })

    it("doesn't match on {$ alone", () => {
        let state = newState()
        state.pos = 16
        assert.isFalse(rule(state, false))
        assert.deepEqual(state.tokens, [])
    })
})