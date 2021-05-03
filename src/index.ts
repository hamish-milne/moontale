
import { storyToLua } from './convert'
import { loadStory, start, raiseEvent } from './runtime'
import './style.css'
import moontaleLib from '../lua/moontale.lua'
import "@fortawesome/fontawesome-free/svgs/solid/code.svg"

const transitionTime = 200

let output = document.getElementById('output')
let outputContainer = document.getElementById('outputContainer')
let luaCode = document.getElementById('lua')
let inputDisabled = false

let toggle = document.getElementById('outputToggleInput') as HTMLInputElement
function outputDisplay() {
    outputContainer.style.display = toggle.checked ? 'none' : 'block'
    luaCode.style.display = toggle.checked ? 'block' : 'none'
}
toggle.onchange = event => {
    outputContainer.style.opacity = toggle.checked ? '0' : '1'
    luaCode.style.opacity = toggle.checked ? '1' : '0'
    setTimeout(outputDisplay, transitionTime)
}

let luaSrc = storyToLua(document.getElementById('storyData').children[0])
luaCode.textContent = luaSrc

let download = document.getElementById('download') as HTMLAreaElement
download.href = window.URL.createObjectURL(new Blob([luaSrc], {type: "octet/stream"}))
download.download = document.title + ".lua"

function onNewText(html: string) {
    output.innerHTML = html
    output.style.opacity = '1'
    inputDisabled = false
}

let invalidate = true
loadStory([moontaleLib, luaSrc], html => {
    if (invalidate) {
        invalidate = false
        inputDisabled = true
        output.style.opacity = '0'
        setTimeout(onNewText, transitionTime, html)
    } else {
        onNewText(html)
    }
}, (message) => {
    console.error(message)
})

function getEventId(event: Event): string | null {
    let target = event.target as Element
    while (target && !(Number(target.id) > 0)) {
        target = target.parentElement
    }
    if (!target) {
        return null
    }
    return target.id
}

let hovering: string | null = null

window.addEventListener('click', event => {
    if (inputDisabled) {
        return
    }
    let id = getEventId(event)
    if (id !== null) {
        console.log("Invalidated "+hovering)
        hovering = null
        raiseEvent('mouseout', id)
        invalidate = true
        raiseEvent(event.type, id)
    }
})
window.addEventListener('mouseover', event => {
    if (inputDisabled) {
        return
    }
    let id = getEventId(event)
    if (id === hovering) {
        return
    }
    if (id !== null) {
        if (hovering !== null) {
            raiseEvent('mouseout', hovering)
        }
        hovering = id
        raiseEvent(event.type, id)
    }
})
window.addEventListener('mouseout', event => {
    if (inputDisabled) {
        return
    }
    let id = getEventId(event)
    if (id !== null && id === hovering) {
        hovering = null
        raiseEvent(event.type, id)
    }
})
start()
