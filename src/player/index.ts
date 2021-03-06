
import { storyToLua } from '../common/convert'
import { loadStory, start, raiseEvent, update } from '../common/runtime'
import moontaleLib from '../../moontale-unity/Packages/com.hmilne.moontale/Runtime/moontale.lua'

const transitionTime = 200

let output = document.getElementById('output')!
let outputContainer = document.getElementById('outputContainer')!
let luaCode = document.getElementById('lua')!
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

let luaSrc = storyToLua(document.getElementById('storyData')!.children[0])
luaCode.textContent = luaSrc

let download = document.getElementById('download') as HTMLAreaElement
download.href = window.URL.createObjectURL(new Blob([luaSrc], {type: "octet/stream"}))
download.download = document.title + ".lua"

function onNewText(html: string) {
    output.innerHTML = html
    output.style.opacity = '1'
    inputDisabled = false
}

loadStory([moontaleLib, luaSrc], (html, invalidate) => {
    if (invalidate) {
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
    let target: Element | null = event.target as Element
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
        hovering = null
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

let lastTime = performance.now()
let callback: FrameRequestCallback = time => {
    update((time - lastTime) * 1000)
    lastTime = time
    window.requestAnimationFrame(callback)
}
window.requestAnimationFrame(callback)

start()
