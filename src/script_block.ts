// Handle {$ lua_script $}
import markdownit from 'markdown-it'
import StateInline from 'markdown-it/lib/rules_inline/state_inline'

export default function (state: StateInline, silent: boolean): boolean {

    const markerLength = 2
    if (!state.src.startsWith('{$', state.pos)) {
        return false
    }
    const end = state.src.indexOf('$}', state.pos + markerLength)
    if (end === -1) {
        return false
    }
    state.push('code_block', '', 0).content = state.src.slice(state.pos + markerLength, end)
    state.pos = end + markerLength
    return true
}