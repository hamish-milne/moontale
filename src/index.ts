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