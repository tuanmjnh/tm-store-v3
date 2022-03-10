// Client ID and API key from the Developer Console
var CLIENT_ID = '45492650401-84j1lpnseu0lgn2k0cgs4hchks18cahn.apps.googleusercontent.com'
var API_KEY = 'AIzaSyBbhrs5sA6IbAuFG0miLdmEo1ZLcOFZHVw'

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4']

// Authorization scopes required by the API multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly'

//
const signin_button = document.createElement('button')
signin_button.id = 'signin_button'
signin_button.style = 'display:none;'
document.body.appendChild(signin_button)

const signout_button = document.createElement('button')
signout_button.id = 'signout_button'
signout_button.style = 'display:none;'
document.body.appendChild(signout_button)
//
var signinButton = document.getElementById('signin_button')
var signoutButton = document.getElementById('signout_button')

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad () {
  gapi.load('client:auth2', initClient)
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient () {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    // gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
    // Handle the initial sign-in state.
    // updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
    // signinButton.onclick = handleAuthClick
    // signoutButton.onclick = handleSignoutClick
  }, function (error) {
    console.log(error)
    // appendPre(JSON.stringify(error, null, 2))
  })
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus (isSignedIn) {
  if (isSignedIn) {
    signinButton.style.display = 'none'
    signoutButton.style.display = 'block'
    listMajors()
  } else {
    signinButton.style.display = 'block'
    signoutButton.style.display = 'none'
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick (event) {
  gapi.auth2.getAuthInstance().signIn()
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick (event) {
  gapi.auth2.getAuthInstance().signOut()
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre (message) {
  var pre = document.getElementById('content')
  var textContent = document.createTextNode(message + '\n')
  pre.appendChild(textContent)
}

/* <script async defer src="https://apis.google.com/js/api.js"
  onload="this.onload=function(){};handleClientLoad()"
  onreadystatechange="if (this.readyState === 'complete') this.onload()">
</script> */

const gapiScript = document.createElement('script')
gapiScript.src = 'https://apis.google.com/js/api.js?onload=onGapiLoad'
window.onGapiLoad = function onGapiLoad () {
  // window.gapi = gapi
  // gapi.load('auth', { 'callback': onAuthApiLoad })
  // function onAuthApiLoad () {
  // gapi.auth.init()
  // console.log(gapi.auth2.getAuthInstance())
  // listMajors()
  // listMajors()
  // }
  handleClientLoad()
}
document.body.appendChild(gapiScript)

// spreadsheets
/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors () {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:E'
  }).then((res) => {
    console.log(res)
    var range = res.result
    if (range.values.length > 0) {
      // appendPre('Name, Major:')
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i]
        // Print columns A and E, which correspond to indices 0 and 4.
        // appendPre(row[0] + ', ' + row[4])
      }
    } else {
      // appendPre('No data found.')
    }
  }, (res) => {
    console.log('Error: ' + res.result.error.message)
    // appendPre('Error: ' + response.result.error.message)
  })
}

export const getSheets = (spreadsheetId) => {
  return gapi.client.sheets.spreadsheets.get({ spreadsheetId: spreadsheetId }).then((res) => {
    return res.result.sheets
  }, (res) => {
    console.log('Error: ' + res.result.error.message)
    // appendPre('Error: ' + res.result.error.message)
    return null
  })
}

export const getSheetValues = ({ spreadsheetId, range, valueRenderOption, majorDimension, dateTimeRenderOption }) => {
  // FORMATTED_VALUE | UNFORMATTED_VALUE | FORMULA
  valueRenderOption = valueRenderOption || 'UNFORMATTED_VALUE'

  // DIMENSION_UNSPECIFIED | ROWS | COLUMNS
  majorDimension = majorDimension || 'ROWS'

  // SERIAL_NUMBER | FORMATTED_STRING
  dateTimeRenderOption = dateTimeRenderOption || 'SERIAL_NUMBER'

  return gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
    valueRenderOption: valueRenderOption,
    majorDimension: majorDimension,
    dateTimeRenderOption: dateTimeRenderOption
  }).then((res) => { return res.result.values },
    (res) => {
      console.log('Error: ' + res.result.error.message)
      // appendPre('Error: ' + res.result.error.message)
      return null
    })
}

export default window.gapi