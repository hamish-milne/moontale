import { lua, lauxlib, lualib } from 'fengari'

import content_block from './content_block'
import expression from './expression'
import passage_link from './passage_link'
import variable from './variable'
import script_block from './script_block'
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
        output.push(`${'  '.repeat(state.level)}${str}`)
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

export function convert(story: Element): string {
    const nodes: {
        id: number,
        name: string,
        tags: string[],
        position: [number, number],
        content: string
    }[] = []
    for (let i = 0; i < story.children.length; i++) {
        let node = story.children[i]
        if (node.tagName.toLowerCase() === "tw-passagedata") {
            nodes.push({
                id: Number(node.getAttribute('pid')),
                name: node.getAttribute('name'),
                tags: node.getAttribute('tags').split(','),
                position: node.getAttribute('position').split(',').map(x => Number(x)) as [number, number],
                content: node.textContent
            })
        }
    }

    const buf: string[] = ['-- Generated with Moontale']
    buf.push(`story = '${escapeText(story.getAttribute('name'))}'`)
    buf.push(`passages = {`)
    nodes.map(x => {
        const tokens = parse(x.content)
        buf.push(`  ['${escapeText(x.name)}'] = {`)
        buf.push(`    id = ${x.id},`)
        buf.push(`    tags = {${x.tags.join(', ')}},`)
        buf.push(`    position = {x = ${x.position[0]}, y = ${x.position[1]}},`)
        buf.push(`    content = function()`)
        renderMany(tokens, buf, {level: 3})
        buf.push(`    end`)
        buf.push(`  },`)
    })
    buf.push(`}`)

    return buf.join('\n')
}


export function executeLua(src: string): string {
    const enc = new TextEncoder()
    const dec = new TextDecoder()
    const L = lauxlib.luaL_newstate()
    lualib.luaL_openlibs(L)

    let tags: string[] = []
    let buf: string[] = []
    lua.lua_register(L, "push", _ => {
        let str = dec.decode(lua.lua_tostring(L, -1))
        tags.push(str)
        if (str == 'a') {
            buf.push(`<${str} href='#'>`)
        } else {
            buf.push(`<${str}>`)
        }
        lua.lua_pop(L, 1)
        return 0
    })
    lua.lua_register(L, "pop", _ => {
        let str = tags.splice(tags.length - 1, 1)
        if (str) {
            buf.push(`</${str}>`)
        }
        return 0
    })
    lua.lua_register(L, "text", _ => {
        let str = dec.decode(lua.lua_tostring(L, -1))
        buf.push(str)
        lua.lua_pop(L, 1)
        return 0
    })
    lua.lua_register(L, "object", _ => {
        let str = dec.decode(lua.lua_tostring(L, -1))
        buf.push(`<${str}>`)
        lua.lua_pop(L, 1)
        return 0
    })

    console.log(src)
    lauxlib.luaL_dostring(L, enc.encode("function link(target) return function(content) push('a'); content(); pop(); end end"))
    lauxlib.luaL_dostring(L, enc.encode(src))
    lauxlib.luaL_dostring(L, enc.encode("passages['Untitled Passage'].content()"))
    return buf.join('')
}

// let luaSrc = convert(document.body.children[0])
// document.getElementById('output').innerHTML = executeLua(luaSrc)
