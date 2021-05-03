
import { storyToLua } from './convert'
import { loadStory, start, raiseEvent } from './runtime'
import './style.css'
import moontaleLib from '../lua/moontale.lua'
import "@fortawesome/fontawesome-free/svgs/solid/code.svg"

const transitionTime = 200

let output = document.getElementById('output')
let outputContainer = document.getElementById('outputContainer')
let luaCode = document.getElementById('lua')

let toggle = document.getElementById('outputToggleInput') as HTMLInputElement
toggle.onchange = event => {
    outputContainer.style.opacity = toggle.checked ? '0' : '1'
    outputContainer.style.visibility = toggle.checked ? 'hidden' : 'visible'
    luaCode.style.opacity = toggle.checked ? '1' : '0'
    luaCode.style.visibility = toggle.checked ? 'visible' : 'hidden'
}

let luaSrc = storyToLua(document.getElementById('storyData').children[0])
luaCode.textContent = luaSrc

let download = document.getElementById('download') as HTMLAreaElement
download.href = window.URL.createObjectURL(new Blob([luaSrc], {type: "octet/stream"}))
download.download = document.title + ".lua"

function onNewText(html: string) {
    output.innerHTML = html
    output.style.opacity = '1'
}

loadStory([moontaleLib, luaSrc], html => {
    output.style.opacity = '0'
    setTimeout(onNewText, transitionTime, html)
}, (message) => console.error(message))
document.addEventListener('click', event => raiseEvent(event.type, (event.target as Element).id))
start()
