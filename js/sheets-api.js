// ============================================
// BSYA - Google Sheets API Layer
// ============================================
// Handles all communication with Google Sheets
// via Google Apps Script web app
// ============================================

var BSYA_API = (function () {

  function getApiUrl() {
    return BSYA_CONFIG && BSYA_CONFIG.SHEETS_API_URL ? BSYA_CONFIG.SHEETS_API_URL : '';
  }

  function isConnected() {
    return BSYA_CONFIG && BSYA_CONFIG.IS_CONNECTED && getApiUrl() !== '';
  }

  // --- Generic request helper ---
  function request(action, data) {
    var url = getApiUrl();
    if (!url) return Promise.reject('No API URL configured');

    var payload = Object.assign({ action: action }, data || {});

    return fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      // no-cors returns opaque response, so we use GET for reads
      return { ok: true };
    });
  }

  function get(action, params) {
    var url = getApiUrl();
    if (!url) return Promise.reject('No API URL configured');

    var query = '?action=' + action;
    if (params) {
      Object.keys(params).forEach(function (key) {
        query += '&' + key + '=' + encodeURIComponent(params[key]);
      });
    }

    return fetch(url + query)
      .then(function (r) { return r.json(); });
  }

  // --- Events ---
  function getEvents() {
    return get('getEvents');
  }

  function createEvent(eventData) {
    return request('createEvent', eventData);
  }

  function updateEvent(eventData) {
    return request('updateEvent', eventData);
  }

  // --- Performers ---
  function getPerformers(eventId) {
    return get('getPerformers', { eventId: eventId });
  }

  function addPerformer(performerData) {
    return request('addPerformer', performerData);
  }

  function removePerformer(performerId, eventId) {
    return request('removePerformer', { performerId: performerId, eventId: eventId });
  }

  // --- Check-ins ---
  function getCheckins(eventId) {
    return get('getCheckins', { eventId: eventId });
  }

  function submitCheckin(checkinData) {
    return request('submitCheckin', checkinData);
  }

  // --- Public API ---
  return {
    isConnected: isConnected,
    getEvents: getEvents,
    createEvent: createEvent,
    updateEvent: updateEvent,
    getPerformers: getPerformers,
    addPerformer: addPerformer,
    removePerformer: removePerformer,
    getCheckins: getCheckins,
    submitCheckin: submitCheckin
  };

})();
