// Handle [[passage->links]], all three forms
import StateInline from 'markdown-it/lib/rules_inline/state_inline'

export default function (state: StateInline, silent: boolean): boolean {

    const markerLength = 2
    if (!state.src.startsWith('[[', state.pos)) {
        return false
    }

    const startPos = state.pos + markerLength
    const srcEnd = state.posMax
    let endPos = startPos
    let ltrLink = -1
    let rtlLink = -1
    while (endPos < srcEnd && !state.src.startsWith(']]', endPos)) {
        // For complex links, we always want to minimise the length of the 'target' and maximise the length of the 'label'
        // So for RTL links, we want to take the left-most (first) occurrence, and for LTR, the right-most (last)
        if (rtlLink === -1 && state.src.startsWith('<-', endPos)) {
            rtlLink = endPos
        } else if (state.src.startsWith('->', endPos)) {
            ltrLink = endPos
        }
        endPos++
    }

    if (endPos === srcEnd) {
        // No ']]' found; not a valid link
        return false
    }

    if (ltrLink !== -1 && rtlLink !== -1) {
        // In the first instance, prefer the form where the marker is closest to its 'end'
        const rtlLength = rtlLink - startPos
        const ltrLength = endPos - (ltrLink + markerLength)
        // If it's something stupid like [[foo<- ->bar]] or [[foo-> <-bar]], prefer LTR links
        if (rtlLength < ltrLength) {
            ltrLink = -1
        } else {
            rtlLink = -1
        }
    }

    // Slice up the target and label based on the link form
    let target: string
    if (ltrLink !== -1) {
        target = state.src.slice(ltrLink + markerLength, endPos).trim()
        state.pos = startPos
        state.posMax = ltrLink
    } else if (rtlLink !== -1) {
        target = state.src.slice(startPos, rtlLink).trim()
        state.pos = rtlLink + markerLength
        state.posMax = endPos
    } else {
        target = state.src.slice(startPos, endPos).trim()
        state.pos = startPos
        state.posMax = endPos
    }

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

    // If the link matches [[ ->Foo]], then just display Foo inline
    if (ltrLink !== -1 && state.src.slice(state.pos, state.posMax).trim() == "") {
        state.push('link_inline', '', 0).attrs = [ ['href', target], ['changer', changer] ]
    } else {
        // The label can contain tokens itself, so we need to call 'tokenize' here
        state.push('link_open', 'a', 1).attrs = [ ['href', target], ['changer', changer] ]
        state.md.inline.tokenize(state)
        state.push('link_close', 'a', -1)
    }

    // Restore the state to its original... state
    state.pos = endPos + markerLength
    state.posMax = srcEnd
    return true

}