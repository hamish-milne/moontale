import MarkdownIt from "markdown-it";
import StateInline from "markdown-it/lib/rules_inline/state_inline";
import Token from "markdown-it/lib/token";
import rule from "./content_block"

describe("Content block rule", () => {
    function newState() {
        return new StateInline("abc[def]", {} as MarkdownIt, {}, [])
    }

    it("matches on '['", ()=> {
        let state = newState()
        state.pos = 3
        expect(rule(state, false)).toBeTruthy()
        let expected = new Token('content_open', '', 1)
        expected.attrs = [['changer', null!]]
        expect(state.tokens).toEqual([expected])
    })

    it("matches on ']", () => {
        let state = newState()
        state.level = 1
        state.pos = 7
        expect(rule(state, false)).toBeTruthy()
        let expected = new Token('content_close', '', -1)
        expected.level = 0
        expect(state.tokens).toEqual([expected])
    })

    it("doesn't match on other characters", () => {
        let state = newState()
        expect(rule(state, false)).toBeFalsy()
        expect(state.tokens).toEqual([])
    })

    it("gathers variables to the left", () => {
        let state = newState()
        state.pos = 3
        state.push('code_variable', '', 0).content = "foo"
        expect(rule(state, false)).toBeTruthy()
        let expected = new Token('content_open', '', 1)
        expected.attrs = [['changer', 'foo']]
        expect(state.tokens).toEqual([expected])
    })
})