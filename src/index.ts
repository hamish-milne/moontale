import markdownit from 'markdown-it'

import content_block from './content_block'
import expression from './expression'
import passage_link from './passage_link'
import variable from './variable'
import script_block from './script_block'
import Token from 'markdown-it/lib/token'

const md = markdownit().use(md => {
    const rules = md.inline.ruler
    rules.disable(['link', 'image', 'autolink'])
    rules.push('passage_link', passage_link)
    rules.push('content_block', content_block)
    rules.push('expression', expression)
    rules.push('script_block', script_block)
    rules.push('variable', variable)
    md.block.ruler.disable(['reference'])
})

export function parse(src: string): Token[] {
    return md.parse(src, {})
}

export function render(src: string): string {
    const output: string[] = []
    renderMany(parse(src), output, {level: 0})
    return output.join('\n')
}

function renderMany(input: Token[], output: string[], state: {level: number}) {
    for (const x of input) {
        renderOne(x, output, state)
    }
}

function escapeText(input: string): string {
    return input
        .replace('\'', '\\\'')
        .replace('\n', '\\\n')
}

function renderOne(input: Token, output: string[], state: {level: number}) {

    function add(str: string) {
        output.push(`${'    '.repeat(state.level)}${str}`)
    } 
    switch (input.type) {
    case 'inline':
        renderMany(input.children, output, state)
        break
    case 'text':
        add(`text('${escapeText(input.content)}')`)
        break
    case 'link_open':
        add(`link('${escapeText(input.attrGet('href'))}')(function()`)
        state.level++
        break
    case 'content_open':
        const changer = input.attrGet('changer')
        if (changer == null) {
            add(`show(function()`)
        } else {
            add(`asChanger(${changer})(function()`)
        }
        state.level++
        break
    case 'content_close':
    case 'link_close':
        state.level--
        add(`end)`)
        break
    case 'code_variable':
    case 'code_expression':
        add(`show(${input.content})`)
        break
    case 'code_block':
        add(input.content)
        break
    default: 
        switch (input.nesting) {
        case 1:
            add(`push('${input.tag}')`)
            state.level++
            break
        case -1:
            state.level--
            add(`pop()`)
            break
        case 0:
            add(`object('${input.tag}')`)
            break
        }
    }
}