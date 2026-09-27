// ============================================
// BSYA - Google Apps Script Code
// ============================================
// INSTRUCTIONS:
// 1. Open the BSYA Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Delete any existing code and paste this entire file
// 4. Click Deploy > New Deployment
// 5. Select "Web app"
// 6. Set "Execute as" to your account
// 7. Set "Who has access" to "Anyone"
// 8. Click Deploy and copy the URL
// 9. Paste the URL into js/config.js
// ============================================

// --- Handle GET requests (reading data) ---
function doGet(e) {
  var action = e.parameter.action;
  var result;

  try {
    switch (action) {
      case 'getEvents':
        result = getEvents();
        break;
      case 'getPerformers':
        result = getPerformers(e.parameter.eventId);
        break;
      case 'getCheckins':
        result = getCheckins(e.parameter.eventId);
        break;
      default:
        result = { error: 'Unknown action: ' + action };
    }
  } catch (err) {
    result = { error: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- Handle POST requests (writing data) ---
function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid JSON' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var action = data.action;
  var result;

  try {
    switch (action) {
      case 'createEvent':
        result = createEvent(data);
        break;
      case 'updateEvent':
        result = updateEvent(data);
        break;
      case 'addPerformer':
        result = addPerformer(data);
        break;
      case 'removePerformer':
        result = removePerformer(data);
        break;
      case 'submitCheckin':
        result = submitCheckin(data);
        break;
      default:
        result = { error: 'Unknown action: ' + action };
    }
  } catch (err) {
    result = { error: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// EVENTS
// ============================================

function getEvents() {
  var sheet = getOrCreateSheet('Events');
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { events: [] };

  var headers = data[0];
  var events = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    events.push(row);
  }
  return { events: events };
}

function createEvent(data) {
  var sheet = getOrCreateSheet('Events');
  var id = 'EVT-' + Date.now();
  sheet.appendRow([
    id,
    data.eventName || '',
    data.eventDate || '',
    data.venue || '',
    data.status || 'active',
    new Date().toISOString()
  ]);
  return { success: true, eventId: id };
}

function updateEvent(data) {
  var sheet = getOrCreateSheet('Events');
  var allData = sheet.getDataRange().getValues();
  for (var i = 1; i < allData.length; i++) {
    if (allData[i][0] === data.eventId) {
      if (data.eventName) sheet.getRange(i + 1, 2).setValue(data.eventName);
      if (data.eventDate) sheet.getRange(i + 1, 3).setValue(data.eventDate);
      if (data.venue) sheet.getRange(i + 1, 4).setValue(data.venue);
      if (data.status) sheet.getRange(i + 1, 5).setValue(data.status);
      return { success: true };
    }
  }
  return { error: 'Event not found' };
}

// ============================================
// PERFORMERS
// ============================================

function getPerformers(eventId) {
  var sheet = getOrCreateSheet('Performers');
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { performers: [] };

  var headers = data[0];
  var performers = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    if (!eventId || row.eventId === eventId) {
      performers.push(row);
    }
  }
  return { performers: performers };
}

function addPerformer(data) {
  var sheet = getOrCreateSheet('Performers');
  var id = 'PFM-' + Date.now();
  sheet.appendRow([
    id,
    data.eventId || '',
    data.childName || '',
    data.childAge || '',
    data.parentName || '',
    data.parentPhone || '',
    data.emergencyNotes || '',
    new Date().toISOString()
  ]);
  return { success: true, performerId: id };
}

function removePerformer(data) {
  var sheet = getOrCreateSheet('Performers');
  var allData = sheet.getDataRange().getValues();
  for (var i = 1; i < allData.length; i++) {
    if (allData[i][0] === data.performerId) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { error: 'Performer not found' };
}

// ============================================
// CHECK-INS
// ============================================

function getCheckins(eventId) {
  var sheet = getOrCreateSheet('CheckIns');
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { checkins: [] };

  var headers = data[0];
  var checkins = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    if (!eventId || row.eventId === eventId) {
      checkins.push(row);
    }
  }
  return { checkins: checkins };
}

function submitCheckin(data) {
  var sheet = getOrCreateSheet('CheckIns');
  var id = 'CHK-' + Date.now();
  sheet.appendRow([
    id,
    data.performerId || '',
    data.eventId || '',
    data.childName || '',
    data.guardianName || '',
    data.consentPhotos || 'no',
    data.consentVideo || 'no',
    data.consentParticipation || 'no',
    new Date().toISOString()
  ]);
  return { success: true, checkinId: id };
}

// ============================================
// HELPERS
// ============================================

function getOrCreateSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);

    // Set up headers
    var headers;
    switch (name) {
      case 'Events':
        headers = ['eventId', 'eventName', 'eventDate', 'venue', 'status', 'createdAt'];
        break;
      case 'Performers':
        headers = ['performerId', 'eventId', 'childName', 'childAge', 'parentName', 'parentPhone', 'emergencyNotes', 'createdAt'];
        break;
      case 'CheckIns':
        headers = ['checkinId', 'performerId', 'eventId', 'childName', 'guardianName', 'consentPhotos', 'consentVideo', 'consentParticipation', 'timestamp'];
        break;
    }
    if (headers) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }

  return sheet;
}

// --- Run once to set up all sheets ---
function initialSetup() {
  getOrCreateSheet('Events');
  getOrCreateSheet('Performers');
  getOrCreateSheet('CheckIns');
  SpreadsheetApp.getActiveSpreadsheet().toast('All sheets created!', 'BSYA Setup', 5);
}
