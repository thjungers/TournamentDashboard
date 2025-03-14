import { fetchData } from "./gateway.js"
import { initState, updateState, getCourtId } from "./state.js"

let state = {}

const init = async () => {
    makeCourts("template-court", "courts", 10)
    state = await fetchData()
    initState(state)

    setTimeout(update, 2000)
}

const update = async () => {
    console.log("updating")
    const newState = await fetchData()
    updateState(state, newState)
    state = newState
    setTimeout(update, 2000)
}

const makeCourts = (templateId, targetId, number) => {
    const content = document.getElementById(templateId).content.cloneNode(true)
    const target = document.getElementById(targetId)
    for (let i = 0; i < number; i++) {
        const cloned = document.importNode(content, true)
        cloned.children[0].id = getCourtId(i + 1)
        cloned.querySelector(".court-name-fr").innerText = `Terrain ${i + 1}`
        cloned.querySelector(".court-name-en").innerText = `Court ${i + 1}`
        cloned.querySelector(".court-number-large").innerText = i + 1
        target.appendChild(cloned)
    }
}

init()