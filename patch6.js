/**
 * patch6.js — Cumulative patches on v1.0.18 original build
 * Creates v1.0.26 with:
 *   P1: border-radius all 4 corners
 *   P2: mobile default view (Month→Week on <=768px)
 *   P3: _showLocationSuggestions parentElement→closest
 *   P4: _clearLocationSuggestions parentElement→closest
 *   P5: HA CSS variable overrides injection
 *   P6: Recurrence translations (EN defaults + FR, DE, ES, IT, NL, PT)
 *   P7: Recurrence <select> in create form (after End field)
 *   P8: Recurrence <select> in edit form (after End field)
 *   P9: _handleCreateEvent reads recurrence and sends rrule
 *   P10: _handleEditEventClick pre-fills recurrence from event
 *   P11: _handleDeleteEvent shows dialog for recurring events
 *   P12: _handleDeleteEventFromEdit shows dialog for recurring events
 *   P13: _handleUpdateEvent shows dialog for recurring + sends rrule
 *   P14: Add new dialog render methods + delete handlers
 *   P15: Add recurring dialogs to render output
 *   P16: Add new properties for recurring dialogs
 */

const fs = require('fs');
const path = require('path');

// Read original v1.0.18
const src = path.join(__dirname, '..', '..', 'EGAILL~1', 'AppData', 'Local', 'Temp', 'v1018', 'skylight-family-calendar-card.js');
let buf;
try {
    buf = fs.readFileSync(src, 'utf8');
} catch {
    // Try alternative path
    const src2 = path.resolve(process.env.USERPROFILE || process.env.HOME, 'AppData', 'Local', 'Temp', 'v1018', 'skylight-family-calendar-card.js');
    buf = fs.readFileSync(src2, 'utf8');
}

console.log('Original size:', buf.length);

function patch(label, oldStr, newStr) {
    if (!buf.includes(oldStr)) {
        console.error(`PATCH FAILED [${label}]: pattern not found`);
        console.error('  Looking for:', oldStr.substring(0, 80), '...');
        process.exit(1);
    }
    const count = buf.split(oldStr).length - 1;
    if (count > 1) {
        console.warn(`  WARNING [${label}]: pattern found ${count} times, replacing first only`);
    }
    buf = buf.replace(oldStr, newStr);
    console.log(`  OK [${label}]`);
}

// ─── P1: border-radius all 4 corners ───
patch('P1',
    'border-radius: 0 var(--event-border-radius) var(--event-border-radius) 0;',
    'border-radius: var(--event-border-radius);'
);

// ─── P2: mobile default view ───
patch('P2',
    'this._currentView=e.defaultView??"Week"',
    'this._currentView=window.innerWidth<=768&&"Month"===(e.defaultView??"Week")?"Week":e.defaultView??"Week"'
);

// ─── P3: _showLocationSuggestions parentElement→closest ───
patch('P3',
    '_showLocationSuggestions(e,t){let n=t.parentElement.querySelector(".location-suggestions")',
    '_showLocationSuggestions(e,t){let n=t.closest(".location-row").querySelector(".location-suggestions")'
);

// ─── P4: _clearLocationSuggestions parentElement→closest ───
patch('P4',
    '_clearLocationSuggestions(e){let t=e.parentElement.querySelector(".location-suggestions")',
    '_clearLocationSuggestions(e){let t=e.closest(".location-row").querySelector(".location-suggestions")'
);

// ─── P5: HA CSS variable overrides ───
const cssInjection = `\r\n\r\n    /* HA theme-adaptive overrides */\r\n    :host {\r\n        --skylight-bg: var(--card-background-color, rgba(255, 255, 255, 0.6));\r\n    }\r\n    .view-btn {\r\n        border-color: var(--divider-color, rgba(0, 0, 0, 0.15));\r\n        color: var(--primary-text-color, #333);\r\n    }\r\n    .filter-btn {\r\n        color: var(--primary-text-color, #333);\r\n    }\r\n    .container .day .events .none,\r\n    .container .day .events .more {\r\n        color: var(--secondary-text-color, rgba(0, 0, 0, 0.5));\r\n    }\r\n    .container .day .events .event .time {\r\n        color: var(--secondary-text-color, rgba(0, 0, 0, 0.5));\r\n    }\r\n    .container .day .events .event .title {\r\n        color: var(--primary-text-color, #333);\r\n    }\r\n    .container .day .add-event {\r\n        color: var(--secondary-text-color, rgba(0, 0, 0, 0.3));\r\n    }\r\n    .create-event-form .form-input {\r\n        background-color: var(--primary-background-color, #fff);\r\n        border-color: var(--divider-color, rgba(0, 0, 0, 0.12));\r\n        color: var(--primary-text-color, #333);\r\n    }\r\n    .create-event-form .form-input:focus {\r\n        border-color: var(--skylight-accent);\r\n    }\r\n    .create-event-form .location-suggestions {\r\n        background: var(--card-background-color, #fff);\r\n        border-color: var(--divider-color, rgba(0, 0, 0, 0.12));\r\n    }\r\n    .create-event-form .location-suggestions li {\r\n        border-bottom-color: var(--divider-color, rgba(0, 0, 0, 0.06));\r\n        color: var(--primary-text-color, #333);\r\n    }\r\n    .create-event-form .location-suggestions li:hover {\r\n        background-color: var(--skylight-accent);\r\n        color: #fff;\r\n    }\r\n    ha-dialog .description {\r\n        border-top-color: var(--divider-color, rgba(0, 0, 0, 0.12));\r\n    }\r\n    ha-dialog .event-actions {\r\n        border-top-color: var(--divider-color, rgba(0, 0, 0, 0.12));\r\n    }`;

// Inject CSS after .btn-submit:hover closing brace, before @keyframes
patch('P5',
    '.btn-submit:hover {\r\n        opacity: 0.9;\r\n    }\r\n\r\n    @keyframes',
    '.btn-submit:hover {\r\n        opacity: 0.9;\r\n    }' + cssInjection + '\r\n\r\n    @keyframes'
);

// ─── P6: Recurrence translations ───

// EN defaults
patch('P6-EN',
    'week:"Week",biweek:"Biweek",month:"Month"',
    'week:"Week",biweek:"Biweek",month:"Month",eventRecurrence:"Repeat",recurrenceNone:"No repeat",recurrenceDaily:"Daily",recurrenceWeekly:"Weekly",recurrenceMonthly:"Monthly",recurrenceYearly:"Yearly",editThisEvent:"This event only",editAllEvents:"All events",editRecurringTitle:"Edit recurring event",deleteThisEvent:"This event only",deleteAllEvents:"All events",deleteRecurringTitle:"Delete recurring event"'
);

// FR
patch('P6-FR',
    'week:"Semaine",biweek:"2 Semaines",month:"Mois"',
    'week:"Semaine",biweek:"2 Semaines",month:"Mois",eventRecurrence:"R\u00e9p\u00e9tition",recurrenceNone:"Pas de r\u00e9p\u00e9tition",recurrenceDaily:"Journalier",recurrenceWeekly:"Hebdomadaire",recurrenceMonthly:"Mensuelle",recurrenceYearly:"Annuelle",editThisEvent:"Cet \u00e9v\u00e9nement uniquement",editAllEvents:"Tous les \u00e9v\u00e9nements",editRecurringTitle:"Modifier l\'\u00e9v\u00e9nement r\u00e9current",deleteThisEvent:"Cet \u00e9v\u00e9nement uniquement",deleteAllEvents:"Tous les \u00e9v\u00e9nements",deleteRecurringTitle:"Supprimer l\'\u00e9v\u00e9nement r\u00e9current"'
);

// DE
patch('P6-DE',
    'week:"Woche",biweek:"2 Wochen",month:"Monat"',
    'week:"Woche",biweek:"2 Wochen",month:"Monat",eventRecurrence:"Wiederholung",recurrenceNone:"Keine Wiederholung",recurrenceDaily:"T\u00e4glich",recurrenceWeekly:"W\u00f6chentlich",recurrenceMonthly:"Monatlich",recurrenceYearly:"J\u00e4hrlich",editThisEvent:"Nur dieses Ereignis",editAllEvents:"Alle Ereignisse",editRecurringTitle:"Wiederkehrendes Ereignis bearbeiten",deleteThisEvent:"Nur dieses Ereignis",deleteAllEvents:"Alle Ereignisse",deleteRecurringTitle:"Wiederkehrendes Ereignis l\u00f6schen"'
);

// ES
patch('P6-ES',
    'week:"Semana",biweek:"2 Semanas",month:"Mes"',
    'week:"Semana",biweek:"2 Semanas",month:"Mes",eventRecurrence:"Repetici\u00f3n",recurrenceNone:"Sin repetici\u00f3n",recurrenceDaily:"Diario",recurrenceWeekly:"Semanal",recurrenceMonthly:"Mensual",recurrenceYearly:"Anual",editThisEvent:"Solo este evento",editAllEvents:"Todos los eventos",editRecurringTitle:"Editar evento recurrente",deleteThisEvent:"Solo este evento",deleteAllEvents:"Todos los eventos",deleteRecurringTitle:"Eliminar evento recurrente"'
);

// IT
patch('P6-IT',
    'week:"Settimana",biweek:"2 Settimane",month:"Mese"',
    'week:"Settimana",biweek:"2 Settimane",month:"Mese",eventRecurrence:"Ripetizione",recurrenceNone:"Nessuna ripetizione",recurrenceDaily:"Giornaliero",recurrenceWeekly:"Settimanale",recurrenceMonthly:"Mensile",recurrenceYearly:"Annuale",editThisEvent:"Solo questo evento",editAllEvents:"Tutti gli eventi",editRecurringTitle:"Modifica evento ricorrente",deleteThisEvent:"Solo questo evento",deleteAllEvents:"Tutti gli eventi",deleteRecurringTitle:"Elimina evento ricorrente"'
);

// NL
patch('P6-NL',
    'week:"Week",biweek:"2 Weken",month:"Maand"',
    'week:"Week",biweek:"2 Weken",month:"Maand",eventRecurrence:"Herhaling",recurrenceNone:"Geen herhaling",recurrenceDaily:"Dagelijks",recurrenceWeekly:"Wekelijks",recurrenceMonthly:"Maandelijks",recurrenceYearly:"Jaarlijks",editThisEvent:"Alleen dit evenement",editAllEvents:"Alle evenementen",editRecurringTitle:"Terugkerend evenement bewerken",deleteThisEvent:"Alleen dit evenement",deleteAllEvents:"Alle evenementen",deleteRecurringTitle:"Terugkerend evenement verwijderen"'
);

// PT
patch('P6-PT',
    'week:"Semana",biweek:"2 Semanas",month:"M\u00eas"',
    'week:"Semana",biweek:"2 Semanas",month:"M\u00eas",eventRecurrence:"Repeti\u00e7\u00e3o",recurrenceNone:"Sem repeti\u00e7\u00e3o",recurrenceDaily:"Di\u00e1rio",recurrenceWeekly:"Semanal",recurrenceMonthly:"Mensal",recurrenceYearly:"Anual",editThisEvent:"Apenas este evento",editAllEvents:"Todos os eventos",editRecurringTitle:"Editar evento recorrente",deleteThisEvent:"Apenas este evento",deleteAllEvents:"Todos os eventos",deleteRecurringTitle:"Excluir evento recorrente"'
);

// ─── P7: Recurrence <select> in create form ───
const createRecurrenceHtml = `\r\n                    <div class="form-row">\r\n                        <label for="event-recurrence">\${this._language.eventRecurrence}</label>\r\n                        <select id="event-recurrence" class="form-input">\r\n                            <option value="">\${this._language.recurrenceNone}</option>\r\n                            <option value="FREQ=DAILY">\${this._language.recurrenceDaily}</option>\r\n                            <option value="FREQ=WEEKLY">\${this._language.recurrenceWeekly}</option>\r\n                            <option value="FREQ=MONTHLY">\${this._language.recurrenceMonthly}</option>\r\n                            <option value="FREQ=YEARLY">\${this._language.recurrenceYearly}</option>\r\n                        </select>\r\n                    </div>`;

// Insert after the End field closing </div> in the create form
patch('P7',
    'id="event-end" class="form-input" .value="${r}" />\r\n                    </div>\r\n                    ${this._showLocationInForm',
    'id="event-end" class="form-input" .value="${r}" />\r\n                    </div>' + createRecurrenceHtml + '\r\n                    ${this._showLocationInForm'
);

// ─── P8: Recurrence <select> in edit form ───
const editRecurrenceHtml = `\r\n                    <div class="form-row">\r\n                        <label for="edit-event-recurrence">\${this._language.eventRecurrence}</label>\r\n                        <select id="edit-event-recurrence" class="form-input"\r\n                            @change="\${e=>{this._editFormData={...this._editFormData,recurrence:e.target.value}}}">\r\n                            <option value="" \${!e.recurrence?"selected":""}>\${this._language.recurrenceNone}</option>\r\n                            <option value="FREQ=DAILY" \${e.recurrence==="FREQ=DAILY"?"selected":""}>\${this._language.recurrenceDaily}</option>\r\n                            <option value="FREQ=WEEKLY" \${e.recurrence==="FREQ=WEEKLY"?"selected":""}>\${this._language.recurrenceWeekly}</option>\r\n                            <option value="FREQ=MONTHLY" \${e.recurrence==="FREQ=MONTHLY"?"selected":""}>\${this._language.recurrenceMonthly}</option>\r\n                            <option value="FREQ=YEARLY" \${e.recurrence==="FREQ=YEARLY"?"selected":""}>\${this._language.recurrenceYearly}</option>\r\n                        </select>\r\n                    </div>`;

patch('P8',
    'id="edit-event-end" class="form-input"\r\n                            .value="${e.end}"\r\n                            @input="${e=>{this._editFormData={...this._editFormData,end:e.target.value}}}" />\r\n                    </div>\r\n                    ${this._showLocationInForm',
    'id="edit-event-end" class="form-input"\r\n                            .value="${e.end}"\r\n                            @input="${e=>{this._editFormData={...this._editFormData,end:e.target.value}}}" />\r\n                    </div>' + editRecurrenceHtml + '\r\n                    ${this._showLocationInForm'
);

// ─── P9: _handleCreateEvent reads recurrence and sends rrule ───
patch('P9',
    'async _handleCreateEvent(){let e=this.shadowRoot.querySelector("#event-title")?.value?.trim(),t=this.shadowRoot.querySelector("#event-calendar")?.value,n=this.shadowRoot.querySelector("#event-start")?.value,i=this.shadowRoot.querySelector("#event-end")?.value,a=this.shadowRoot.querySelector("#event-location")?.value?.trim();if(!e||!n)return;let r=eh.DateTime.fromISO(n),s=i?eh.DateTime.fromISO(i):r.plus({hours:1}),o={entity_id:t,summary:e,start_date_time:r.toFormat("yyyy-MM-dd HH:mm:ss"),end_date_time:s.toFormat("yyyy-MM-dd HH:mm:ss")};a&&(o.location=a);try{await this.hass.callService("calendar","create_event",o)',
    'async _handleCreateEvent(){let e=this.shadowRoot.querySelector("#event-title")?.value?.trim(),t=this.shadowRoot.querySelector("#event-calendar")?.value,n=this.shadowRoot.querySelector("#event-start")?.value,i=this.shadowRoot.querySelector("#event-end")?.value,a=this.shadowRoot.querySelector("#event-location")?.value?.trim(),rc=this.shadowRoot.querySelector("#event-recurrence")?.value;if(!e||!n)return;let r=eh.DateTime.fromISO(n),s=i?eh.DateTime.fromISO(i):r.plus({hours:1}),o={entity_id:t,summary:e,start_date_time:r.toFormat("yyyy-MM-dd HH:mm:ss"),end_date_time:s.toFormat("yyyy-MM-dd HH:mm:ss")};a&&(o.location=a);rc&&(o.rrule=rc);try{await this.hass.callService("calendar","create_event",o)'
);

// ─── P10: _handleEditEventClick pre-fills recurrence ───
patch('P10',
    '_handleEditEventClick(){let e=this._currentEventDetails;this._currentEventDetails=null,this._editFormData={title:e.summary||"",calendar:e.calendars[0]||"",start:e.originalStart?e.originalStart.toFormat("yyyy-MM-dd\'T\'HH:mm"):"",end:e.originalEnd?e.originalEnd.toFormat("yyyy-MM-dd\'T\'HH:mm"):"",location:e.location||""},this._showEditEventDialog=e}',
    '_handleEditEventClick(){let e=this._currentEventDetails;this._currentEventDetails=null;let rc="";e.rrule?rc=e.rrule:e.recurrence_rule&&(rc=e.recurrence_rule);if(rc){let fm=rc.match(/FREQ=(DAILY|WEEKLY|MONTHLY|YEARLY)/);rc=fm?"FREQ="+fm[1]:""}this._editFormData={title:e.summary||"",calendar:e.calendars[0]||"",start:e.originalStart?e.originalStart.toFormat("yyyy-MM-dd\'T\'HH:mm"):"",end:e.originalEnd?e.originalEnd.toFormat("yyyy-MM-dd\'T\'HH:mm"):"",location:e.location||"",recurrence:rc},this._showEditEventDialog=e}'
);

// ─── P11: _handleDeleteEvent shows dialog for recurring ───
patch('P11',
    'async _handleDeleteEvent(){let e=this._currentEventDetails;if(e&&e.uid)try{let t={type:"calendar/event/delete",entity_id:e.calendars[0],uid:e.uid};e.recurrence_id&&(t.recurrence_id=e.recurrence_id,t.recurrence_range="THISANDFUTURE"),await this.hass.callWS(t),this._currentEventDetails=null,this._updateEvents()}catch(e){console.error("Failed to delete event:",e)}}',
    'async _handleDeleteEvent(){let e=this._currentEventDetails;if(!e||!e.uid)return;if(e.recurrence_id){this._showDeleteRecurringDialog={event:e,source:"details"};return}try{let t={type:"calendar/event/delete",entity_id:e.calendars[0],uid:e.uid};await this.hass.callWS(t),this._currentEventDetails=null,this._updateEvents()}catch(e){console.error("Failed to delete event:",e)}}'
);

// ─── P12: _handleDeleteEventFromEdit shows dialog for recurring ───
patch('P12',
    'async _handleDeleteEventFromEdit(){let e=this._showEditEventDialog;if(e&&e.uid)try{let t={type:"calendar/event/delete",entity_id:e.calendars[0],uid:e.uid};e.recurrence_id&&(t.recurrence_id=e.recurrence_id,t.recurrence_range="THISANDFUTURE"),await this.hass.callWS(t),this._showEditEventDialog=null,this._editFormData=null,this._updateEvents()}catch(e){console.error("Skylight Family Calendar: Failed to delete event:",e)}}',
    'async _handleDeleteEventFromEdit(){let e=this._showEditEventDialog;if(!e||!e.uid)return;if(e.recurrence_id){this._showDeleteRecurringDialog={event:e,source:"edit"};return}try{let t={type:"calendar/event/delete",entity_id:e.calendars[0],uid:e.uid};await this.hass.callWS(t),this._showEditEventDialog=null,this._editFormData=null,this._updateEvents()}catch(e){console.error("Skylight Family Calendar: Failed to delete event:",e)}}'
);

// ─── P13: _handleUpdateEvent with dialog for recurring + rrule support ───
// Replace the entire _handleUpdateEvent
const oldUpdateEvent = 'async _handleUpdateEvent(){let e=this._showEditEventDialog,t=this._editFormData;if(!e||!t)return void console.error("Skylight Family Calendar: No event or form data for update");let n=t.title?.trim(),i=t.calendar,a=t.start,r=t.end,s=t.location?.trim()??"";if(!n||!a)return void console.error("Skylight Family Calendar: Missing required fields",{title:n,startInput:a});let o=eh.DateTime.fromISO(a),l=r?eh.DateTime.fromISO(r):o.plus({hours:1}),d=i||e.calendars[0];try{if(e.uid){let t={summary:n,dtstart:o.toFormat("yyyy-MM-dd\'T\'HH:mm:ss"),dtend:l.toFormat("yyyy-MM-dd\'T\'HH:mm:ss")};s&&(t.location=s);let i={type:"calendar/event/update",entity_id:d,uid:e.uid,event:t};e.recurrence_id&&(i.recurrence_id=e.recurrence_id,i.recurrence_range="THISANDFUTURE"),await this.hass.callWS(i)}this._showEditEventDialog=null,this._editFormData=null,this._updateEvents()}catch(t){if("not_supported"===t.code&&e.uid)try{let t={type:"calendar/event/delete",entity_id:d,uid:e.uid};e.recurrence_id&&(t.recurrence_id=e.recurrence_id,t.recurrence_range="THISANDFUTURE"),await this.hass.callWS(t);let i={entity_id:d,summary:n,start_date_time:o.toFormat("yyyy-MM-dd HH:mm:ss"),end_date_time:l.toFormat("yyyy-MM-dd HH:mm:ss")};s&&(i.location=s),await this.hass.callService("calendar","create_event",i),this._showEditEventDialog=null,this._editFormData=null,this._updateEvents()}catch(e){console.error("Skylight Family Calendar: Failed to update event (fallback):",e)}else console.error("Skylight Family Calendar: Failed to update event:",t)}}';

const newUpdateEvent = `async _handleUpdateEvent(){let e=this._showEditEventDialog,t=this._editFormData;if(!e||!t)return void console.error("Skylight Family Calendar: No event or form data for update");if(e.recurrence_id){this._showRecurringConfirmDialog={event:e,form:{...t}};return}await this._performUpdateEvent(e,t,null)}async _handleUpdateThisEvent(){let c=this._showRecurringConfirmDialog;if(!c)return;this._showRecurringConfirmDialog=null,await this._performUpdateEvent(c.event,c.form,"this")}async _handleUpdateAllEvents(){let c=this._showRecurringConfirmDialog;if(!c)return;this._showRecurringConfirmDialog=null,await this._performUpdateEvent(c.event,c.form,"all")}async _handleDeleteThisEvent(){let c=this._showDeleteRecurringDialog;if(!c)return;let e=c.event;this._showDeleteRecurringDialog=null;try{let t={type:"calendar/event/delete",entity_id:e.calendars[0],uid:e.uid,recurrence_id:e.recurrence_id};await this.hass.callWS(t),"edit"===c.source?(this._showEditEventDialog=null,this._editFormData=null):this._currentEventDetails=null,this._updateEvents()}catch(e){console.error("Skylight Family Calendar: Failed to delete single event:",e)}}async _handleDeleteAllEvents(){let c=this._showDeleteRecurringDialog;if(!c)return;let e=c.event;this._showDeleteRecurringDialog=null;try{let t={type:"calendar/event/delete",entity_id:e.calendars[0],uid:e.uid};await this.hass.callWS(t),"edit"===c.source?(this._showEditEventDialog=null,this._editFormData=null):this._currentEventDetails=null,this._updateEvents()}catch(e){console.error("Skylight Family Calendar: Failed to delete all events:",e)}}async _performUpdateEvent(e,t,rm){let n=t.title?.trim(),i=t.calendar,a=t.start,r=t.end,s=t.location?.trim()??"",rc=t.recurrence||"";if(!n||!a)return void console.error("Skylight Family Calendar: Missing required fields",{title:n,startInput:a});let o=eh.DateTime.fromISO(a),l=r?eh.DateTime.fromISO(r):o.plus({hours:1}),d=i||e.calendars[0];try{if(e.uid){let t={summary:n,dtstart:o.toFormat("yyyy-MM-dd'T'HH:mm:ss"),dtend:l.toFormat("yyyy-MM-dd'T'HH:mm:ss")};s&&(t.location=s),rc&&(t.rrule=rc);let i={type:"calendar/event/update",entity_id:d,uid:e.uid,event:t};"this"===rm?i.recurrence_id=e.recurrence_id:"all"!==rm&&e.recurrence_id&&(i.recurrence_id=e.recurrence_id,i.recurrence_range="THISANDFUTURE"),await this.hass.callWS(i)}this._showEditEventDialog=null,this._editFormData=null,this._updateEvents()}catch(t){if("not_supported"===t.code&&e.uid)try{let t={type:"calendar/event/delete",entity_id:d,uid:e.uid};"this"===rm?t.recurrence_id=e.recurrence_id:"all"!==rm&&e.recurrence_id&&(t.recurrence_id=e.recurrence_id,t.recurrence_range="THISANDFUTURE"),await this.hass.callWS(t);let i={entity_id:d,summary:n,start_date_time:o.toFormat("yyyy-MM-dd HH:mm:ss"),end_date_time:l.toFormat("yyyy-MM-dd HH:mm:ss")};s&&(i.location=s),rc&&(i.rrule=rc),await this.hass.callService("calendar","create_event",i),this._showEditEventDialog=null,this._editFormData=null,this._updateEvents()}catch(e){console.error("Skylight Family Calendar: Failed to update event (fallback):",e)}else console.error("Skylight Family Calendar: Failed to update event:",t)}}`;

patch('P13', oldUpdateEvent, newUpdateEvent);

// ─── P14: Add dialog rendering methods ───
// Insert after _renderEditEventDialogHeading
const dialogMethods = `_renderRecurringConfirmDialog(){if(!this._showRecurringConfirmDialog)return j\`\`;return j\`
            <ha-dialog open @closed="\${()=>{this._showRecurringConfirmDialog=null}}">
                <div class="create-event-form">
                    <h3 style="margin:0 0 16px 0;font-size:1.1em">\${this._language.editRecurringTitle}</h3>
                    <div class="form-actions" style="justify-content:center;gap:8px">
                        <button class="btn btn-cancel" @click="\${this._handleUpdateThisEvent}">\${this._language.editThisEvent}</button>
                        <button class="btn btn-submit" @click="\${this._handleUpdateAllEvents}">\${this._language.editAllEvents}</button>
                    </div>
                </div>
            </ha-dialog>
        \`}_renderDeleteRecurringDialog(){if(!this._showDeleteRecurringDialog)return j\`\`;return j\`
            <ha-dialog open @closed="\${()=>{this._showDeleteRecurringDialog=null}}">
                <div class="create-event-form">
                    <h3 style="margin:0 0 16px 0;font-size:1.1em">\${this._language.deleteRecurringTitle}</h3>
                    <div class="form-actions" style="justify-content:center;gap:8px">
                        <button class="btn btn-cancel" @click="\${this._handleDeleteThisEvent}">\${this._language.deleteThisEvent}</button>
                        <button class="btn btn-delete" @click="\${this._handleDeleteAllEvents}"><ha-icon icon="mdi:delete"></ha-icon> \${this._language.deleteAllEvents}</button>
                    </div>
                </div>
            </ha-dialog>
        \`}`;

// Find the heading method end and the _getLoader start
patch('P14',
    '}_getLoader(){',
    '}' + dialogMethods + '_getLoader(){'
);

// ─── P15: Add recurring dialogs to render output ───
patch('P15',
    '${this._renderEditEventDialog()}\r\n                    ${this._loader}',
    '${this._renderEditEventDialog()}\r\n                    ${this._renderRecurringConfirmDialog()}\r\n                    ${this._renderDeleteRecurringDialog()}\r\n                    ${this._loader}'
);

// ─── P16: Add new properties ───
patch('P16',
    '_calendarVisibility:{type:Object}}}',
    '_calendarVisibility:{type:Object},_showRecurringConfirmDialog:{type:Object},_showDeleteRecurringDialog:{type:Object}}}'
);

// Write output
const outPath = path.join(__dirname, 'dist', 'skylight-family-calendar-card.js');
fs.writeFileSync(outPath, buf);
console.log('\nPatched file written to:', outPath);
console.log('New size:', buf.length);
