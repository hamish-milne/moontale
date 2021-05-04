import MarkdownIt from "markdown-it";
import StateInline from "markdown-it/lib/rules_inline/state_inline";
import Token from "markdown-it/lib/token";
import rule from "./passage_link"

describe("Passage link rule", () => {
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
        let state = newState(`abc${src}def`)
        state.pos = 3
        expect(rule(state, false)).toBeTruthy()
        let expected = [
            new Token('link_open', 'a', 1),
            new Token('text', '', 0),
            new Token('link_close', 'a', -1)
        ]
        expected[0].attrs = [['href', 'Target'], ['changer', null]]
        expected[1].level = 1
        expect(state.tokens).toEqual(expected)
    }

    it("matches on [[Label->Target]]", () => {
        testWith("[[Label->Target]]")
    })

    it("matches on [[Target<-Label]]", () => {
        testWith("[[Target<-Label]]")
    })

    it("matches on [[Target]]", () => {
        testWith("[[Target]]")
    })

    it("emits an inline display on [[ ->Target]]", () => {
        let state = newState("[[ ->Target]]")
        expect(rule(state, false)).toBeTruthy()
        let expected = new Token('link_inline', '', 0)
        expected.attrs = [['href', 'Target'], ['changer', null]]
        expect(state.tokens).toEqual([expected])
    })
})