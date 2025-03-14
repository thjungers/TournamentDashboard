// This code is tightly coupled to the Google Sheets file (sheet names, cell coordinates)

function postState(e) {
  const payload = getPayload(e.source)
  const apiEndpoint = "https://sportardent.eu.pythonanywhere.com/"
  const response = UrlFetchApp.fetch(apiEndpoint, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    headers: {
      "X-Api-Token": "TOKEN"
    }
  })
  console.log(response)
}

function getPayload(spreadsheet) {
  const payload = {
    teams: getTeams(spreadsheet),
    courts: getCourts(spreadsheet)
  }
  const matches = getMatches(spreadsheet)
  payload.current_matches = matches.current
  payload.past_matches = matches.past
  payload.next_matches = matches.next
  return payload
}

function getTeams(spreadsheet) {
  const sheet = spreadsheet.getSheetByName("Equipes")
  const values = sheet.getDataRange().getValues()
  const teams = new Array()

  for (const row of values.slice(1)) { // Skip the first row (headers)
    if (row[1].length == 0)
      break
    teams.push({
      name: row[1],
      emoji: row[2]
    })
  }

  return teams
}

function getMatches(spreadsheet) {
  const sheet = spreadsheet.getSheetByName("Matches")
  const values = sheet.getDataRange().getValues()
  const matches = {
    current: new Array(),
    past: new Array(),
    next: new Array(),
  }

  for (const row of values.slice(1)) { // Skip the first row (headers)
    if (row[3].length == 0)
      break
    const match = {
      id: row[0],
      teams: [row[3], row[4]],
    }
    if (row[1].length == 0) { // No court assigned yet: next match
      matches.next.push(match)
    }
    else {
      match.court = row[1]
      if (row[13].length == 0) { // No winner yet: current match
        match.started = row[2]
        matches.current.push(match)
      }
      else { // Past match
        match.winner = row[13]
        matches.past.push(match)
      }
    }
  }

  return matches
}

function getCourts(spreadsheet) {
  const sheet = spreadsheet.getSheetByName("Terrains")
  const values = sheet.getDataRange().getValues()
  const courts = new Array()

  for (const row of values.slice(1)) { // Skip the first row (headers)
    if (row[0].length == 0)
      break
    courts.push({
      name: row[0],
      free_play: row[2],
      available: row[3]
    })
  }

  return courts
}
