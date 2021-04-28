
import { storyToLua } from './convert'
import { loadStory, start, raiseEvent } from './runtime'
import './style.css'
import moontaleLib from '../lua/moontale.lua'

let luaSrc = storyToLua(document.getElementById('storyData').children[0])
let output = document.getElementById('output')

function onNewText(html: string) {
    output.innerHTML = html
    output.style.opacity = '1'
}

loadStory([moontaleLib, luaSrc], html => {
    output.style.opacity = '0'
    setTimeout(onNewText, 200, html)
}, () => {})
document.addEventListener('click', event => raiseEvent(event.type, (event.target as Element).id))
start()
