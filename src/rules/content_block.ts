// Handle [nested [content blocks]]
import StateInline from 'markdown-it/lib/rules_inline/state_inline'

export default function (state: StateInline, silent: boolean): boolean {

    if (state.src.charCodeAt(state.pos) === 0x5B /* [ */) {

        // If we immediately followed a variable or expression, use it as a Changer for this content:
        const prevToken = state.tokens[state.tokens.length - 1]
        let changer: string | null
        if (prevToken && (prevToken.type == 'code_variable' || prevToken.type == 'code_expression')) {
            // Remove the expression token; we don't want it to be printed in the output
            state.tokens.splice(state.tokens.length - 1, 1)
            changer = prevToken.content
        } else {
            changer = null
        }

        state.push('content_open', '', 1).attrs = [['changer', changer!]]
        state.pos++
        return true
    }

    if (state.src.charCodeAt(state.pos) === 0x5D /* ] */) {
        state.push('content_close', '', state.level <= 0 ? 0 : -1)
        state.pos++
        return true
    }

    return false
}
