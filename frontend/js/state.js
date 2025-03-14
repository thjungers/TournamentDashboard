import { equals } from "./utils.js"

export function initState(state) {
    /** Handle courts **/
    for (const court of state.courts) {
        updateCourtStatus(court)
    }

    /** Handle current matches **/
    for (const match of state.current_matches) {
        updateCurrentMatch(match, state)
    }

    /** Handle next match **/
    updateNextMatch(state.next_matches[0], state)
    /** Rotate ads **/
    rotateAds()
}

export function updateState(currentState, newState) {
    /** Handle courts **/
    for (const newCourt of newState.courts) {
        const currentCourt = getCourt(newCourt.name, currentState)
        if (!equals(currentCourt, newCourt))
            updateCourtStatus(newCourt)
    }
    /** Handle matches **/
    for (const newMatch of newState.current_matches) {
        const currentMatch = getMatch(newMatch.id, currentState.current_matches)
        if (!equals(currentMatch, newMatch))
            updateCurrentMatch(newMatch, newState)
    }
    /** Handle next matches **/
    const newNextMatch = newState.next_matches[0]
    const currentNextMatch = currentState.next_matches[0]
    if (!equals(currentNextMatch, newNextMatch))
        updateNextMatch(newNextMatch, newState)
    /** Handle ads **/
    const currentShowAds = currentState.courts.reduce((acc, elm) => acc + elm.available, 0) <= 5
    const newShowAds = newState.courts.reduce((acc, elm) => acc + elm.available, 0) <= 5
    const adsDiv = document.getElementById("ads")
    if (currentShowAds && !newShowAds)
        adsDiv.classList.add("display-none")
    if(!currentShowAds && newShowAds)
        adsDiv.classList.remove("display-none")

}

export function getCourtId(courtName) {
    return `court-${courtName}`
}

const getTeam = (teamName, state) => {
    for (const team of state.teams) {
        if (team.name == teamName)
            return team
    }
}

const getCourt = (courtName, state) => {
    for (const court of state.courts) {
        if (court.name == courtName)
            return court
    }
}

const getMatch = (matchId, matches) => {
    for (const match of matches) {
        if (match.id == matchId)
            return match
    }
}

const updateCourtStatus = court => {
    const unavailableClass = "court-unavailable"
    const freePlayClass = "court-free-play"
    const courtDiv = document.getElementById(getCourtId(court.name))

    courtDiv.classList.remove(unavailableClass, freePlayClass)
    if (!court.available)
        courtDiv.classList.add(unavailableClass)
    else if (court.free_play) {
        courtDiv.classList.add(freePlayClass)
        courtDiv.classList.remove("match-pending")
        courtDiv.querySelector(".first-team").innerHTML = ""
        courtDiv.querySelector(".second-team").innerHTML = ""
    }
}

const updateCurrentMatch = (match, state) => {
    const matchPendingClass = "match-pending"
    const courtDiv = document.getElementById(getCourtId(match.court))
    const team1 = getTeam(match.teams[0], state)
    const team2 = getTeam(match.teams[1], state)

    courtDiv.querySelector(".first-team").innerHTML = team1.name
    courtDiv.querySelector(".first-team-emoji").innerHTML = team1.emoji
    courtDiv.querySelector(".second-team").innerHTML = team2.name
    courtDiv.querySelector(".second-team-emoji").innerHTML = team2.emoji

    if (match.started)
        courtDiv.classList.remove(matchPendingClass)
    else
        courtDiv.classList.add(matchPendingClass)
}

const updateNextMatch = (match, state) => {
    if (match === undefined)
        return

    const div = document.getElementById("next-match")
    div.innerHTML = `${match.teams[0]} & ${match.teams[1]}`
}

const rotateAds = () => {
    const adsDiv = document.getElementById("ads")
    const ids = [...adsDiv.children].map(elm => {
        elm.classList.add("display-none")
        return elm.id
    })

    const sampledId = sample(ids)
    document.getElementById(sampledId).classList.remove("display-none")
    setTimeout(rotateAds, 60000);
}

const sample = array => {
    return array[(Math.random() * array.length) | 0]
}