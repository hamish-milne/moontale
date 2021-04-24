// Handle $variables
import StateInline from 'markdown-it/lib/rules_inline/state_inline'

function isLetter(code: number): boolean {
    return code === 0x5F || (code >= 0x41 && code <= 0x5A) || (code >= 0x61 && code <= 0x7A)
}

function isLetterOrNumber(code: number): boolean {
    return isLetter(code) || (code >= 0x30 && code <= 0x39)
}

function propertyExpression(state: StateInline): boolean {
    if (state.src.charCodeAt(state.pos) != 0x2E /* . */) {
        return false
    }
    if (!isLetter(state.src.charCodeAt(state.pos + 1))) {
        return false
    }
    state.pos++
    do {
        state.pos++
    } while (state.pos < state.src.length && isLetterOrNumber(state.src.charCodeAt(state.pos)))
    return true
}

function callExpression(state: StateInline, begin: number, end: number): boolean {
    if (state.src.charCodeAt(state.pos) != begin) {
        return false
    }
    let pos = state.pos
    let level = 1
    let code: Number
    do {
        pos++
        code = state.src.charCodeAt(pos)
        if (code == begin) {
            level++
        } else if (code == end) {
            level--
            pos++
        }
    } while (level > 0 && code != 0x0A && pos < state.src.length)
    if (level == 0) {
        state.pos = pos
        return true
    }
    return false
}

export default function (state: StateInline, silent: boolean): boolean {

    if (state.src.charCodeAt(state.pos) !== 0x24 /* $ */) {
        return false
    }
    if (!isLetter(state.src.charCodeAt(state.pos + 1))) {
        return false
    }
    const start = state.pos + 1
    let length = 1
    while (isLetterOrNumber(state.src.charCodeAt(state.pos + length + 1))) {
        length++
    }
    state.pos += 1 + length
    while (propertyExpression(state) // foo.bar
        || callExpression(state, 0x28, 0x29) // foo(bar)
        || callExpression(state, 0x7B, 0x7D) // foo{bar}
    ) {
        // Continue
    }
    state.push('code_variable', '', 0).content = state.src.slice(start, state.pos)
    return true
}