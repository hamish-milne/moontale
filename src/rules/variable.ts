// Handle $variables
import StateInline from 'markdown-it/lib/rules_inline/state_inline'

function isLetter(code: number): boolean {
    return code === 0x5F || (code >= 0x41 && code <= 0x5A) || (code >= 0x61 && code <= 0x7A)
}

function isLetterOrNumber(code: number): boolean {
    return isLetter(code) || (code >= 0x30 && code <= 0x39)
}

function propertyExpression(state: StateInline, output: string[]): boolean {
    let start = state.pos
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
    output.push(state.src.slice(start, state.pos))
    return true
}

function callExpression(state: StateInline, output: string[], begin: number, end: number): boolean {
    if (state.src.charCodeAt(state.pos) != begin) {
        return false
    }
    let start = state.pos
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
        }
    } while (level > 0 && code != 0x0A && pos < state.src.length)
    if (level == 0) {
        state.pos = pos + 1
        output.push(state.src.slice(start, state.pos))
        return true
    }
    return false
}

function lambdaExpression(state: StateInline, output: string[]): boolean {
    if (!state.src.startsWith("<<", state.pos)) {
        return false
    }
    let found = state.src.indexOf(">>", state.pos + 2)
    if (found < 0) {
        return false
    }
    output.push("(function() ")
    output.push(state.src.slice(state.pos + 2, found))
    output.push(" end)")
    state.pos = found + 2
    return true
}

export default function (state: StateInline, silent: boolean): boolean {

    if (state.src.charCodeAt(state.pos) !== 0x24 /* $ */) {
        return false
    }
    if (!isLetter(state.src.charCodeAt(state.pos + 1))) {
        return false
    }
    const start = state.pos = state.pos + 1
    do {
        state.pos++
    } while (isLetterOrNumber(state.src.charCodeAt(state.pos)))
    let output = [state.src.slice(start, state.pos)]
    while (propertyExpression(state, output) // foo.bar
        || callExpression(state, output, 0x28, 0x29) // foo(bar)
        || callExpression(state, output, 0x7B, 0x7D) // foo{bar}
        || lambdaExpression(state, output) // foo<<bar>>
    ) {
        // Continue
    }
    state.push('code_variable', '', 0).content = output.join('')
    return true
}