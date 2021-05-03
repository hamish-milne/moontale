import content_block from './rules/content_block'
import expression from './rules/expression'
import passage_link from './rules/passage_link'
import variable from './rules/variable'
import script_block from './rules/script_block'
import Token from 'markdown-it/lib/token'
import ParserInline from 'markdown-it/lib/parser_inline'
import ParserBlock from 'markdown-it/lib/parser_block'
import ParserCore from 'markdown-it/lib/parser_core'

// We construct our own MarkdownIt instance here to exclude the features we don't use
// (which saves on the bundle size)
const md = {
    inline: new ParserInline(),
    block: new ParserBlock(),
    core: new ParserCore(),
    options: {
        html:         false,
        xhtmlOut:     false,
        breaks:       false,
        langPrefix:   'language-',
        linkify:      false,
        typographer:  false,
        quotes: '\u201c\u201d\u2018\u2019', /* “”‘’ */
        highlight: null as null,
        maxNesting:   100
    },
    parse: function(src: string, env: object) {
        if (typeof src !== 'string') {
            throw new Error('Input data should be a String');
        }
        var state = new this.core.State(src, this, env);
        this.core.process(state);
        return state.tokens;
    } 
}

const rules = md.inline.ruler
rules.disable(['link', 'image', 'autolink'])
rules.push('passage_link', passage_link)
rules.push('content_block', content_block)
rules.push('expression', expression)
rules.push('script_block', script_block)
rules.push('variable', variable)
md.block.ruler.disable(['reference'])

function escape(input: string): string {
    return input
        .replace(/\'/g, '\\\'')
        .replace(/\n/g, '\\\n')
}

function renderOne(input: Token, output: string[], state: {level: number}) {

    function add(str: string) {
        output.push(`${'  '.repeat(state.level)}${str}`)
    }
    switch (input.type) {
    case 'inline':
        for (const child of input.children) {
            renderOne(child, output, state)
        }
        break
    case 'text':
        if (input.content.length > 0) {
            add(`Text('${escape(input.content)}')`)
        }
        break
    case 'link_open':
        add(`Link('${escape(input.attrGet('href'))}')(function()`)
        state.level++
        break
    case 'content_open':
        const changer = input.attrGet('changer')
        if (changer == null) {
            add(`Show(function()`)
        } else {
            add(`AsChanger(${changer})(function()`)
        }
        state.level++
        break
    case 'code_variable':
    case 'code_expression':
        add(`Show(${input.content})`)
        break
    case 'code_block':
        add(input.content)
        break
    default: 
        switch (input.nesting) {
        case 1:
            add(`Style.${input.tag}(function()`)
            state.level++
            break
        case -1:
            state.level--
            add(`end)`)
            break
        case 0:
            add(`Object('${input.tag}')`)
            break
        }
    }
}

export function markdownToLua(src: string, outputBuffer: string[], state: {level: number}) {
    for(const token of md.parse(src, {})) {
        renderOne(token, outputBuffer, state)
    }
}

export function storyToLua(story: Element): string {
    let startNode = story.getAttribute('startnode')
    let startNodeName: string | null = null
    const buf: string[] = ['-- Generated with Moontale']
    buf.push(`story = '${escape(story.getAttribute('name'))}'`)
    buf.push(`passages = {`)
    for (let i = 0; i < story.children.length; i++) {
        let node = story.children[i]
        if (node.tagName.toLowerCase() === "tw-passagedata") {
            if (startNode === node.getAttribute('pid')) {
                startNodeName = node.getAttribute('name')
            }
            buf.push(`  ['${escape(node.getAttribute('name'))}'] = {`)
            let tags = node.getAttribute('tags').split(' ')
            if (tags.length === 1 && tags[0] === '') {
                tags = []
            }
            buf.push(`    tags = { ${tags.map(t => `['${escape(t)}'] = true`).join(',')} },`)
            buf.push(`    position = {${node.getAttribute('position')}},`)
            buf.push(`    content = function()`)
            markdownToLua(node.textContent, buf, {level: 3})
            buf.push(`    end`)
            buf.push(`  },`)
        }
    }
    buf.push(`}`)
    buf.push(`startPassage = '${escape(startNodeName)}'`)

    return buf.join('\n')
}