// Handle $variables
import markdownit from 'markdown-it'
import StateInline from 'markdown-it/lib/rules_inline/state_inline'

function isLetter(code: number): boolean {
    return code === 0x5F || (code >= 0x41 && code <= 0x5A) || (code >= 0x61 && code <= 0x7A)
}

function isLetterOrNumber(code: number): boolean {
    return isLetter(code) || (code >= 0x30 && code <= 0x39)
}

export default function (state: StateInline, silent: boolean): boolean {

    if (state.src.charCodeAt(state.pos) !== 0x24 /* $ */) {
        return false
    }
    if (!isLetter(state.src.charCodeAt(state.pos + 1))) {
        return false
    }
    let length = 1
    while (isLetterOrNumber(state.src.charCodeAt(state.pos + length + 1))) {
        length++
    }
    state.push('code_variable', '', 0).content = state.src.slice(state.pos + 1, state.pos + 1 + length)
    state.pos += 1 + length
    return true
}