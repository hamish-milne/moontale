// Handle <$ lua_expression $>
import StateInline from 'markdown-it/lib/rules_inline/state_inline'

export default function (state: StateInline, silent: boolean): boolean {

    const markerLength = 2
    if (!state.src.startsWith('<$', state.pos)) {
        return false
    }
    const end = state.src.indexOf('$>', state.pos + markerLength)
    if (end === -1) {
        return false
    }
    let tok = state.push('code_expression', '', 0)
    tok.content = state.src.slice(state.pos + markerLength, end)
    tok.meta = state.pos
    state.pos = end + markerLength
    return true
}