// Handle <$ lua_expression $>
import StateInline from 'markdown-it/lib/rules_inline/state_inline'

export default function (state: StateInline, silent: boolean): boolean {

    const markerLength = 2
    if (!state.src.startsWith('<$', state.pos)) {
        return false
    }
    const endMarker = state.src.indexOf('$>', state.pos + markerLength)
    let endBlock: number, endSyntax: number;
    if (endMarker < 0) {
        endBlock = state.src.length
        endSyntax = state.src.length
    } else {
        endBlock = endMarker
        endSyntax = endMarker + markerLength
    }
    let tok = state.push('code_expression', '', 0)
    tok.content = state.src.slice(state.pos + markerLength, endBlock)
    tok.meta = state.pos
    state.pos = endSyntax
    return true
}