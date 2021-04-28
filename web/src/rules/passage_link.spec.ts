import chai from "chai";
import MarkdownIt from "markdown-it";
import StateInline from "markdown-it/lib/rules_inline/state_inline";
import Token from "markdown-it/lib/token";
import rule from "./passage_link"

const assert = chai.assert

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
        assert.isTrue(rule(state, false), "Rule didn't match")
        let expected = [
            new Token('link_open', 'a', 1),
            new Token('text', '', 0),
            new Token('link_close', 'a', -1)
        ]
        expected[0].attrs = [['href', 'Target']]
        expected[1].level = 1
        assert.deepEqual(state.tokens, expected)
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
})