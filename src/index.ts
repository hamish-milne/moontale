
import { storyToLua } from './convert'
import { loadStory, start, raiseEvent } from './runtime'

let luaSrc = storyToLua(document.body.children[0])
let output = document.getElementById('output')

function onNewText(html: string) {
    output.innerHTML = html
    output.style.opacity = '1'
}

loadStory(luaSrc, html => {
    output.style.opacity = '0'
    setTimeout(onNewText, 200, html)
})
document.addEventListener('click', event => raiseEvent(event.type, (event.target as Element).id))
start()
