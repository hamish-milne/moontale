import chai from "chai";
import MarkdownIt from "markdown-it";
import StateInline from "markdown-it/lib/rules_inline/state_inline";
import Token from "markdown-it/lib/token";
import rule from "./content_block"

const assert = chai.assert

describe("Content block rule", () => {
    function newState() {
        return new StateInline("abc[def]", {} as MarkdownIt, {}, [])
    }

    it("matches on '['", ()=> {
        let state = newState()
        state.pos = 3
        assert.isTrue(rule(state, false), "Rule didn't match")
        let expected = new Token('content_open', '', 1)
        expected.attrs = [['changer', null]]
        assert.deepEqual(state.tokens, [expected])
    })

    it("matches on ']", () => {
        let state = newState()
        state.pos = 7
        assert.isTrue(rule(state, false), "Rule didn't match")
        let expected = new Token('content_close', '', -1)
        expected.level = -1
        assert.deepEqual(state.tokens, [expected])
    })

    it("doesn't match on other characters", () => {
        let state = newState()
        assert.isFalse(rule(state, false))
        assert.deepEqual(state.tokens, [])
    })

    it("gathers variables to the left", () => {
        let state = newState()
        state.pos = 3
        state.push('code_variable', '', 0).content = "foo"
        assert.isTrue(rule(state, false), "Rule didn't match")
        let expected = new Token('content_open', '', 1)
        expected.attrs = [['changer', 'foo']]
        assert.deepEqual(state.tokens, [expected])
    })
})