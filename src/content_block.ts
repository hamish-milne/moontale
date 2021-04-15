// Handle [nested [content blocks]]
import markdownit from 'markdown-it'
import StateInline from 'markdown-it/lib/rules_inline/state_inline'

export default function (state: StateInline, silent: boolean): boolean {

    if (state.src.charCodeAt(state.pos) === 0x5B /* [ */) {
        state.push('content_open', '', 1)
        state.pos++
        return true
    }

    if (state.src.charCodeAt(state.pos) === 0x5D /* ] */) {
        state.push('content_close', '', -1)
        state.pos++
        return true
    }

    return false
}
