import MarkdownIt from "markdown-it";
import StateInline from "markdown-it/lib/rules_inline/state_inline";
import Token from "markdown-it/lib/token";
import rule from "./expression"

describe("Lua expression block rule", () => {
    function newState() {
        return new StateInline("abc<$def<$\nghi$><$jkl", {} as MarkdownIt, {}, [])
    }

    it("matches on <$ $>", () => {
        let state = newState()
        state.pos = 3
        expect(rule(state, false)).toBeTruthy()
        let expected = new Token('code_expression', '', 0)
        expected.content = 'def<$\nghi'
        expect(state.tokens).toEqual([expected])
    })

    it("doesn't match on <$ alone", () => {
        let state = newState()
        state.pos = 16
        expect(rule(state, false)).toBeFalsy()
        expect(state.tokens).toEqual([])
    })
})