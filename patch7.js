/**
 * patch7.js — Cumulative patches on v1.0.18 original build
 * Creates v1.0.27 with:
 *   P1: border-radius all 4 corners
 *   P2: mobile default view (Month→Week on <=768px)
 *   P3: _showLocationSuggestions parentElement→closest
 *   P4: _clearLocationSuggestions parentElement→closest
 *   P5: HA CSS variable overrides injection
 *   P6: Recurrence translations (EN defaults + FR, DE, ES, IT, NL, PT) — with detail keys
 *   P7: Recurrence <select> + conditional detail fields in create form
 *   P8: Recurrence <select> + conditional detail fields in edit form
 *   P9: _handleCreateEvent builds full RRULE from multiple fields
 *   P10: _handleEditEventClick parses full RRULE into form components
 *   P11: _handleDeleteEvent shows dialog for recurring events
 *   P12: _handleDeleteEventFromEdit shows dialog for recurring events
 *   P13: _handleUpdateEvent dialog + _performUpdateEvent builds full RRULE
 *   P14: Dialog render methods + delete handlers
 *   P15: Recurring dialogs in render output
 *   P16: New properties (_showRecurringConfirmDialog, _showDeleteRecurringDialog, _createRecurrenceType, _createRecurrenceEndType)
 *   P17: Utility methods (_buildRrule, _parseRrule, _toggleDayBtn, etc.)
 *   P18: CSS for day-picker, recurrence-inline, etc.
 *   P19: _closeCreateEventDialog resets recurrence state
 */

const fs = require('fs');
const path = require('path');

// Read original v1.0.18
const src = path.join(__dirname, '..', '..', 'EGAILL~1', 'AppData', 'Local', 'Temp', 'v1018', 'skylight-family-calendar-card.js');
let buf;
try {
    buf = fs.readFileSync(src, 'utf8');
} catch {
    const src2 = path.resolve(process.env.USERPROFILE || process.env.HOME, 'AppData', 'Local', 'Temp', 'v1018', 'skylight-family-calendar-card.js');
    buf = fs.readFileSync(src2, 'utf8');
}

console.log('Original size:', buf.length);

function patch(label, oldStr, newStr) {
    if (!buf.includes(oldStr)) {
        console.error(`PATCH FAILED [${label}]: pattern not found`);
        console.error('  Looking for:', oldStr.substring(0, 120), '...');
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
const cssInjection = `\r\n\r\n    /* HA theme-adaptive overrides */\r\n    :host {\r\n        --skylight-bg: var(--card-background-color, rgba(255, 255, 255, 0.6));\r\n    }\r\n    .view-btn {\r\n        border-color: var(--divider-color, rgba(0, 0, 0, 0.15));\r\n        color: var(--primary-text-color, #333);\r\n    }\r\n    .filter-btn {\r\n        color: var(--primary-text-color, #333);\r\n    }\r\n    .container .day .events .none,\r\n    .container .day .events .more {\r\n        color: var(--secondary-text-color, rgba(0, 0, 0, 0.5));\r\n    }\r\n    .container .day .events .event .time {\r\n        color: var(--primary-text-color, #333);\r\n        font-weight: bold;\r\n    }\r\n    .container .day .events .event .title {\r\n        color: var(--primary-text-color, #333);\r\n        font-size: 1.15em;\r\n        font-weight: 600;\r\n    }\r\n    .container .day .add-event {\r\n        color: var(--secondary-text-color, rgba(0, 0, 0, 0.3));\r\n    }\r\n    .create-event-form .form-input {\r\n        background-color: var(--primary-background-color, #fff);\r\n        border-color: var(--divider-color, rgba(0, 0, 0, 0.12));\r\n        color: var(--primary-text-color, #333);\r\n    }\r\n    .create-event-form .form-input:focus {\r\n        border-color: var(--skylight-accent);\r\n    }\r\n    .create-event-form .location-suggestions {\r\n        background: var(--card-background-color, #fff);\r\n        border-color: var(--divider-color, rgba(0, 0, 0, 0.12));\r\n    }\r\n    .create-event-form .location-suggestions li {\r\n        border-bottom-color: var(--divider-color, rgba(0, 0, 0, 0.06));\r\n        color: var(--primary-text-color, #333);\r\n    }\r\n    .create-event-form .location-suggestions li:hover {\r\n        background-color: var(--skylight-accent);\r\n        color: #fff;\r\n    }\r\n    ha-dialog .description {\r\n        border-top-color: var(--divider-color, rgba(0, 0, 0, 0.12));\r\n    }\r\n    ha-dialog .event-actions {\r\n        border-top-color: var(--divider-color, rgba(0, 0, 0, 0.12));\r\n    }`;

patch('P5',
    '.btn-submit:hover {\r\n        opacity: 0.9;\r\n    }\r\n\r\n    @keyframes',
    '.btn-submit:hover {\r\n        opacity: 0.9;\r\n    }' + cssInjection + '\r\n\r\n    @keyframes'
);

// ─── P6: Recurrence translations (with detail keys) ───

// EN defaults
patch('P6-EN',
    'week:"Week",biweek:"Biweek",month:"Month"',
    'week:"Week",biweek:"Biweek",month:"Month",eventRecurrence:"Repeat",recurrenceNone:"No repeat",recurrenceDaily:"Daily",recurrenceWeekly:"Weekly",recurrenceMonthly:"Monthly",recurrenceYearly:"Yearly",editThisEvent:"This event only",editAllEvents:"All events",editRecurringTitle:"Edit recurring event",deleteThisEvent:"This event only",deleteAllEvents:"All events",deleteRecurringTitle:"Delete recurring event",recurrenceInterval:"Repeat interval",recurrenceEnds:"Ends",recurrenceEndsNever:"Never",recurrenceEndsOnDate:"On date",recurrenceEndsAfter:"After",recurrenceOccurrences:"occurrences",recurrenceDays:"days",recurrenceWeeks:"weeks",recurrenceMonths:"months",recurrenceMonthlyOn:"Monthly on day"'
);

// FR
patch('P6-FR',
    'week:"Semaine",biweek:"2 Semaines",month:"Mois"',
    'week:"Semaine",biweek:"2 Semaines",month:"Mois",eventRecurrence:"R\u00e9p\u00e9tition",recurrenceNone:"Pas de r\u00e9p\u00e9tition",recurrenceDaily:"Journalier",recurrenceWeekly:"Hebdomadaire",recurrenceMonthly:"Mensuelle",recurrenceYearly:"Annuelle",editThisEvent:"Cet \u00e9v\u00e9nement uniquement",editAllEvents:"Tous les \u00e9v\u00e9nements",editRecurringTitle:"Modifier l\'\u00e9v\u00e9nement r\u00e9current",deleteThisEvent:"Cet \u00e9v\u00e9nement uniquement",deleteAllEvents:"Tous les \u00e9v\u00e9nements",deleteRecurringTitle:"Supprimer l\'\u00e9v\u00e9nement r\u00e9current",recurrenceInterval:"Intervalle de r\u00e9p\u00e9tition",recurrenceEnds:"Se termine",recurrenceEndsNever:"Jamais",recurrenceEndsOnDate:"\u00c0 une date",recurrenceEndsAfter:"Apr\u00e8s",recurrenceOccurrences:"occurrences",recurrenceDays:"jours",recurrenceWeeks:"semaines",recurrenceMonths:"mois",recurrenceMonthlyOn:"Chaque mois le"'
);

// DE
patch('P6-DE',
    'week:"Woche",biweek:"2 Wochen",month:"Monat"',
    'week:"Woche",biweek:"2 Wochen",month:"Monat",eventRecurrence:"Wiederholung",recurrenceNone:"Keine Wiederholung",recurrenceDaily:"T\u00e4glich",recurrenceWeekly:"W\u00f6chentlich",recurrenceMonthly:"Monatlich",recurrenceYearly:"J\u00e4hrlich",editThisEvent:"Nur dieses Ereignis",editAllEvents:"Alle Ereignisse",editRecurringTitle:"Wiederkehrendes Ereignis bearbeiten",deleteThisEvent:"Nur dieses Ereignis",deleteAllEvents:"Alle Ereignisse",deleteRecurringTitle:"Wiederkehrendes Ereignis l\u00f6schen",recurrenceInterval:"Wiederholungsintervall",recurrenceEnds:"Endet",recurrenceEndsNever:"Nie",recurrenceEndsOnDate:"Am Datum",recurrenceEndsAfter:"Nach",recurrenceOccurrences:"Wiederholungen",recurrenceDays:"Tagen",recurrenceWeeks:"Wochen",recurrenceMonths:"Monaten",recurrenceMonthlyOn:"Monatlich am"'
);

// ES
patch('P6-ES',
    'week:"Semana",biweek:"2 Semanas",month:"Mes"',
    'week:"Semana",biweek:"2 Semanas",month:"Mes",eventRecurrence:"Repetici\u00f3n",recurrenceNone:"Sin repetici\u00f3n",recurrenceDaily:"Diario",recurrenceWeekly:"Semanal",recurrenceMonthly:"Mensual",recurrenceYearly:"Anual",editThisEvent:"Solo este evento",editAllEvents:"Todos los eventos",editRecurringTitle:"Editar evento recurrente",deleteThisEvent:"Solo este evento",deleteAllEvents:"Todos los eventos",deleteRecurringTitle:"Eliminar evento recurrente",recurrenceInterval:"Intervalo de repetici\u00f3n",recurrenceEnds:"Termina",recurrenceEndsNever:"Nunca",recurrenceEndsOnDate:"En una fecha",recurrenceEndsAfter:"Despu\u00e9s de",recurrenceOccurrences:"ocurrencias",recurrenceDays:"d\u00edas",recurrenceWeeks:"semanas",recurrenceMonths:"meses",recurrenceMonthlyOn:"Cada mes el"'
);

// IT
patch('P6-IT',
    'week:"Settimana",biweek:"2 Settimane",month:"Mese"',
    'week:"Settimana",biweek:"2 Settimane",month:"Mese",eventRecurrence:"Ripetizione",recurrenceNone:"Nessuna ripetizione",recurrenceDaily:"Giornaliero",recurrenceWeekly:"Settimanale",recurrenceMonthly:"Mensile",recurrenceYearly:"Annuale",editThisEvent:"Solo questo evento",editAllEvents:"Tutti gli eventi",editRecurringTitle:"Modifica evento ricorrente",deleteThisEvent:"Solo questo evento",deleteAllEvents:"Tutti gli eventi",deleteRecurringTitle:"Elimina evento ricorrente",recurrenceInterval:"Intervallo di ripetizione",recurrenceEnds:"Termina",recurrenceEndsNever:"Mai",recurrenceEndsOnDate:"In una data",recurrenceEndsAfter:"Dopo",recurrenceOccurrences:"occorrenze",recurrenceDays:"giorni",recurrenceWeeks:"settimane",recurrenceMonths:"mesi",recurrenceMonthlyOn:"Ogni mese il"'
);

// NL
patch('P6-NL',
    'week:"Week",biweek:"2 Weken",month:"Maand"',
    'week:"Week",biweek:"2 Weken",month:"Maand",eventRecurrence:"Herhaling",recurrenceNone:"Geen herhaling",recurrenceDaily:"Dagelijks",recurrenceWeekly:"Wekelijks",recurrenceMonthly:"Maandelijks",recurrenceYearly:"Jaarlijks",editThisEvent:"Alleen dit evenement",editAllEvents:"Alle evenementen",editRecurringTitle:"Terugkerend evenement bewerken",deleteThisEvent:"Alleen dit evenement",deleteAllEvents:"Alle evenementen",deleteRecurringTitle:"Terugkerend evenement verwijderen",recurrenceInterval:"Herhalingsinterval",recurrenceEnds:"Eindigt",recurrenceEndsNever:"Nooit",recurrenceEndsOnDate:"Op datum",recurrenceEndsAfter:"Na",recurrenceOccurrences:"herhalingen",recurrenceDays:"dagen",recurrenceWeeks:"weken",recurrenceMonths:"maanden",recurrenceMonthlyOn:"Maandelijks op"'
);

// PT
patch('P6-PT',
    'week:"Semana",biweek:"2 Semanas",month:"M\u00eas"',
    'week:"Semana",biweek:"2 Semanas",month:"M\u00eas",eventRecurrence:"Repeti\u00e7\u00e3o",recurrenceNone:"Sem repeti\u00e7\u00e3o",recurrenceDaily:"Di\u00e1rio",recurrenceWeekly:"Semanal",recurrenceMonthly:"Mensal",recurrenceYearly:"Anual",editThisEvent:"Apenas este evento",editAllEvents:"Todos os eventos",editRecurringTitle:"Editar evento recorrente",deleteThisEvent:"Apenas este evento",deleteAllEvents:"Todos os eventos",deleteRecurringTitle:"Excluir evento recorrente",recurrenceInterval:"Intervalo de repeti\u00e7\u00e3o",recurrenceEnds:"Termina",recurrenceEndsNever:"Nunca",recurrenceEndsOnDate:"Em uma data",recurrenceEndsAfter:"Ap\u00f3s",recurrenceOccurrences:"ocorr\u00eancias",recurrenceDays:"dias",recurrenceWeeks:"semanas",recurrenceMonths:"meses",recurrenceMonthlyOn:"Todo m\u00eas no dia"'
);

// ─── P6b: Split create form datetime variables into date + time ───
patch('P6b',
    'a=n.toFormat("yyyy-MM-dd\'T\'HH:mm"),r=i.toFormat("yyyy-MM-dd\'T\'HH:mm")',
    'aD=n.toFormat("yyyy-MM-dd"),aT=n.toFormat("HH:mm"),rD=i.toFormat("yyyy-MM-dd"),rT=i.toFormat("HH:mm")'
);

// ─── P7: Create form — split date/time + recurrence select + conditional detail fields ───
const createRecurrenceBlock = `\r\n                    <div class="form-row">\r\n                        <label for="event-recurrence">\${this._language.eventRecurrence}</label>\r\n                        <select id="event-recurrence" class="form-input"\r\n                            @change="\${e=>{this._createRecurrenceType=e.target.value||null,this._createRecurrenceEndType="never"}}">\r\n                            <option value="">\${this._language.recurrenceNone}</option>\r\n                            <option value="FREQ=DAILY">\${this._language.recurrenceDaily}</option>\r\n                            <option value="FREQ=WEEKLY">\${this._language.recurrenceWeekly}</option>\r\n                            <option value="FREQ=MONTHLY">\${this._language.recurrenceMonthly}</option>\r\n                            <option value="FREQ=YEARLY">\${this._language.recurrenceYearly}</option>\r\n                        </select>\r\n                    </div>\r\n                    \${this._createRecurrenceType?j\`\r\n                        \${this._createRecurrenceType!=="FREQ=YEARLY"?j\`\r\n                        <div class="form-row recurrence-inline">\r\n                            <label>\${this._language.recurrenceInterval}</label>\r\n                            <input type="number" id="event-recurrence-interval" class="form-input recurrence-number" min="1" value="1" />\r\n                            <span class="recurrence-unit">\${this._createRecurrenceType==="FREQ=DAILY"?this._language.recurrenceDays:this._createRecurrenceType==="FREQ=WEEKLY"?this._language.recurrenceWeeks:this._language.recurrenceMonths}</span>\r\n                        </div>\r\n                        \`:""}\r\n                        \${this._createRecurrenceType==="FREQ=WEEKLY"?j\`\r\n                        <div class="form-row">\r\n                            <div class="day-picker" id="event-day-picker">\r\n                                \${["MO","TU","WE","TH","FR","SA","SU"].map(d=>j\`\r\n                                    <button type="button" class="day-btn" data-day="\${d}"\r\n                                        @click="\${this._toggleDayBtn}">\${this._dayLabel(d)}</button>\r\n                                \`)}\r\n                            </div>\r\n                        </div>\r\n                        \`:""}\r\n                        \${this._createRecurrenceType==="FREQ=MONTHLY"?j\`\r\n                        <div class="form-row recurrence-inline">\r\n                            <label>\${this._language.recurrenceMonthlyOn}</label>\r\n                            <input type="number" id="event-recurrence-monthday" class="form-input recurrence-number"\r\n                                min="1" max="31" value="\${this._getDefaultMonthDay()}" />\r\n                        </div>\r\n                        \`:""}\r\n                        <div class="form-row">\r\n                            <label>\${this._language.recurrenceEnds}</label>\r\n                            <select id="event-recurrence-end" class="form-input"\r\n                                @change="\${e=>{this._createRecurrenceEndType=e.target.value}}">\r\n                                <option value="never">\${this._language.recurrenceEndsNever}</option>\r\n                                <option value="date">\${this._language.recurrenceEndsOnDate}</option>\r\n                                <option value="count">\${this._language.recurrenceEndsAfter}</option>\r\n                            </select>\r\n                        </div>\r\n                        \${this._createRecurrenceEndType==="date"?j\`\r\n                        <div class="form-row">\r\n                            <input type="date" id="event-recurrence-end-date" class="form-input" />\r\n                        </div>\r\n                        \`:""}\r\n                        \${this._createRecurrenceEndType==="count"?j\`\r\n                        <div class="form-row recurrence-inline">\r\n                            <input type="number" id="event-recurrence-end-count" class="form-input recurrence-number"\r\n                                min="1" value="10" />\r\n                            <span class="recurrence-unit">\${this._language.recurrenceOccurrences}</span>\r\n                        </div>\r\n                        \`:""}\r\n                    \`:""}`;

patch('P7',
    '<label for="event-start">${this._language.eventStart} *</label>\r\n                        <input type="datetime-local" id="event-start" class="form-input" .value="${a}" required />\r\n                    </div>\r\n                    <div class="form-row">\r\n                        <label for="event-end">${this._language.eventEnd}</label>\r\n                        <input type="datetime-local" id="event-end" class="form-input" .value="${r}" />\r\n                    </div>\r\n                    ${this._showLocationInForm',
    '<label for="event-start-date">${this._language.eventStart} *</label>\r\n                        <div class="datetime-row">\r\n                            <input type="date" id="event-start-date" class="form-input" .value="${aD}" required />\r\n                            <input type="time" id="event-start-time" class="form-input" .value="${aT}" required />\r\n                        </div>\r\n                    </div>\r\n                    <div class="form-row">\r\n                        <label for="event-end-date">${this._language.eventEnd}</label>\r\n                        <div class="datetime-row">\r\n                            <input type="date" id="event-end-date" class="form-input" .value="${rD}" />\r\n                            <input type="time" id="event-end-time" class="form-input" .value="${rT}" />\r\n                        </div>\r\n                    </div>' + createRecurrenceBlock + '\r\n                    ${this._showLocationInForm'
);

// ─── P8: Edit form — recurrence select + conditional detail fields ───
const editRecurrenceBlock = `\r\n                    <div class="form-row">\r\n                        <label for="edit-event-recurrence">\${this._language.eventRecurrence}</label>\r\n                        <select id="edit-event-recurrence" class="form-input"\r\n                            @change="\${t=>{this._editFormData={...this._editFormData,recurrence:t.target.value,recurrenceByDay:[],recurrenceEndType:"never"}}}">\r\n                            <option value="" \${!e.recurrence?"selected":""}>\${this._language.recurrenceNone}</option>\r\n                            <option value="FREQ=DAILY" \${e.recurrence==="FREQ=DAILY"?"selected":""}>\${this._language.recurrenceDaily}</option>\r\n                            <option value="FREQ=WEEKLY" \${e.recurrence==="FREQ=WEEKLY"?"selected":""}>\${this._language.recurrenceWeekly}</option>\r\n                            <option value="FREQ=MONTHLY" \${e.recurrence==="FREQ=MONTHLY"?"selected":""}>\${this._language.recurrenceMonthly}</option>\r\n                            <option value="FREQ=YEARLY" \${e.recurrence==="FREQ=YEARLY"?"selected":""}>\${this._language.recurrenceYearly}</option>\r\n                        </select>\r\n                    </div>\r\n                    \${e.recurrence?j\`\r\n                        \${e.recurrence!=="FREQ=YEARLY"?j\`\r\n                        <div class="form-row recurrence-inline">\r\n                            <label>\${this._language.recurrenceInterval}</label>\r\n                            <input type="number" id="edit-event-recurrence-interval" class="form-input recurrence-number" min="1"\r\n                                .value="\${String(e.recurrenceInterval||1)}"\r\n                                @input="\${t=>{this._editFormData={...this._editFormData,recurrenceInterval:parseInt(t.target.value)||1}}}" />\r\n                            <span class="recurrence-unit">\${e.recurrence==="FREQ=DAILY"?this._language.recurrenceDays:e.recurrence==="FREQ=WEEKLY"?this._language.recurrenceWeeks:this._language.recurrenceMonths}</span>\r\n                        </div>\r\n                        \`:""}\r\n                        \${e.recurrence==="FREQ=WEEKLY"?j\`\r\n                        <div class="form-row">\r\n                            <div class="day-picker" id="edit-event-day-picker">\r\n                                \${["MO","TU","WE","TH","FR","SA","SU"].map(d=>j\`\r\n                                    <button type="button" class="day-btn \${(e.recurrenceByDay||[]).includes(d)?"active":""}" data-day="\${d}"\r\n                                        @click="\${t=>this._toggleEditDayBtn(t,d)}">\${this._dayLabel(d)}</button>\r\n                                \`)}\r\n                            </div>\r\n                        </div>\r\n                        \`:""}\r\n                        \${e.recurrence==="FREQ=MONTHLY"?j\`\r\n                        <div class="form-row recurrence-inline">\r\n                            <label>\${this._language.recurrenceMonthlyOn}</label>\r\n                            <input type="number" id="edit-event-recurrence-monthday" class="form-input recurrence-number"\r\n                                min="1" max="31" .value="\${String(e.recurrenceByMonthDay||1)}"\r\n                                @input="\${t=>{this._editFormData={...this._editFormData,recurrenceByMonthDay:parseInt(t.target.value)||1}}}" />\r\n                        </div>\r\n                        \`:""}\r\n                        <div class="form-row">\r\n                            <label>\${this._language.recurrenceEnds}</label>\r\n                            <select id="edit-event-recurrence-end" class="form-input"\r\n                                @change="\${t=>{this._editFormData={...this._editFormData,recurrenceEndType:t.target.value}}}">\r\n                                <option value="never" \${e.recurrenceEndType==="never"?"selected":""}>\${this._language.recurrenceEndsNever}</option>\r\n                                <option value="date" \${e.recurrenceEndType==="date"?"selected":""}>\${this._language.recurrenceEndsOnDate}</option>\r\n                                <option value="count" \${e.recurrenceEndType==="count"?"selected":""}>\${this._language.recurrenceEndsAfter}</option>\r\n                            </select>\r\n                        </div>\r\n                        \${e.recurrenceEndType==="date"?j\`\r\n                        <div class="form-row">\r\n                            <input type="date" id="edit-event-recurrence-end-date" class="form-input"\r\n                                .value="\${e.recurrenceEndDate||""}"\r\n                                @input="\${t=>{this._editFormData={...this._editFormData,recurrenceEndDate:t.target.value}}}" />\r\n                        </div>\r\n                        \`:""}\r\n                        \${e.recurrenceEndType==="count"?j\`\r\n                        <div class="form-row recurrence-inline">\r\n                            <input type="number" id="edit-event-recurrence-end-count" class="form-input recurrence-number"\r\n                                min="1" .value="\${String(e.recurrenceEndCount||10)}"\r\n                                @input="\${t=>{this._editFormData={...this._editFormData,recurrenceEndCount:parseInt(t.target.value)||10}}}" />\r\n                            <span class="recurrence-unit">\${this._language.recurrenceOccurrences}</span>\r\n                        </div>\r\n                        \`:""}\r\n                    \`:""}`;

patch('P8',
    '<label for="edit-event-start">${this._language.eventStart} *</label>\r\n                        <input type="datetime-local" id="edit-event-start" class="form-input" required\r\n                            .value="${e.start}"\r\n                            @input="${e=>{this._editFormData={...this._editFormData,start:e.target.value}}}" />\r\n                    </div>\r\n                    <div class="form-row">\r\n                        <label for="edit-event-end">${this._language.eventEnd}</label>\r\n                        <input type="datetime-local" id="edit-event-end" class="form-input"\r\n                            .value="${e.end}"\r\n                            @input="${e=>{this._editFormData={...this._editFormData,end:e.target.value}}}" />\r\n                    </div>\r\n                    ${this._showLocationInForm',
    '<label for="edit-event-start-date">${this._language.eventStart} *</label>\r\n                        <div class="datetime-row">\r\n                            <input type="date" id="edit-event-start-date" class="form-input" required\r\n                                .value="${e.startDate}"\r\n                                @input="${e=>{this._editFormData={...this._editFormData,startDate:e.target.value}}}" />\r\n                            <input type="time" id="edit-event-start-time" class="form-input" required\r\n                                .value="${e.startTime}"\r\n                                @input="${e=>{this._editFormData={...this._editFormData,startTime:e.target.value}}}" />\r\n                        </div>\r\n                    </div>\r\n                    <div class="form-row">\r\n                        <label for="edit-event-end-date">${this._language.eventEnd}</label>\r\n                        <div class="datetime-row">\r\n                            <input type="date" id="edit-event-end-date" class="form-input"\r\n                                .value="${e.endDate}"\r\n                                @input="${e=>{this._editFormData={...this._editFormData,endDate:e.target.value}}}" />\r\n                            <input type="time" id="edit-event-end-time" class="form-input"\r\n                                .value="${e.endTime}"\r\n                                @input="${e=>{this._editFormData={...this._editFormData,endTime:e.target.value}}}" />\r\n                        </div>\r\n                    </div>' + editRecurrenceBlock + '\r\n                    ${this._showLocationInForm'
);

// ─── P9: _handleCreateEvent builds full RRULE ───
patch('P9',
    'async _handleCreateEvent(){let e=this.shadowRoot.querySelector("#event-title")?.value?.trim(),t=this.shadowRoot.querySelector("#event-calendar")?.value,n=this.shadowRoot.querySelector("#event-start")?.value,i=this.shadowRoot.querySelector("#event-end")?.value,a=this.shadowRoot.querySelector("#event-location")?.value?.trim();if(!e||!n)return;let r=eh.DateTime.fromISO(n),s=i?eh.DateTime.fromISO(i):r.plus({hours:1}),o={entity_id:t,summary:e,start_date_time:r.toFormat("yyyy-MM-dd HH:mm:ss"),end_date_time:s.toFormat("yyyy-MM-dd HH:mm:ss")};a&&(o.location=a);try{await this.hass.callService("calendar","create_event",o)',
    'async _handleCreateEvent(){let e=this.shadowRoot.querySelector("#event-title")?.value?.trim(),t=this.shadowRoot.querySelector("#event-calendar")?.value,nD=this.shadowRoot.querySelector("#event-start-date")?.value,nT=this.shadowRoot.querySelector("#event-start-time")?.value,iD=this.shadowRoot.querySelector("#event-end-date")?.value,iT=this.shadowRoot.querySelector("#event-end-time")?.value,a=this.shadowRoot.querySelector("#event-location")?.value?.trim(),fq=this.shadowRoot.querySelector("#event-recurrence")?.value;if(!e||!nD||!nT)return;let n=nD+"T"+nT,i=iD&&iT?iD+"T"+iT:"",r=eh.DateTime.fromISO(n),s=i?eh.DateTime.fromISO(i):r.plus({hours:1}),rr="";if(fq){let iv=parseInt(this.shadowRoot.querySelector("#event-recurrence-interval")?.value)||1,bd=[];if(fq==="FREQ=WEEKLY"){bd=[...this.shadowRoot.querySelectorAll("#event-day-picker .day-btn.active")].map(b=>b.dataset.day)}let md=fq==="FREQ=MONTHLY"?parseInt(this.shadowRoot.querySelector("#event-recurrence-monthday")?.value):null,et=this.shadowRoot.querySelector("#event-recurrence-end")?.value||"never",ed=this.shadowRoot.querySelector("#event-recurrence-end-date")?.value||"",ec=parseInt(this.shadowRoot.querySelector("#event-recurrence-end-count")?.value)||10;rr=this._buildRrule(fq,iv,bd,md,et,ed,ec)}let o={summary:e,dtstart:r.toFormat("yyyy-MM-dd\'T\'HH:mm:ss"),dtend:s.toFormat("yyyy-MM-dd\'T\'HH:mm:ss")};a&&(o.location=a);rr&&(o.rrule=rr);try{await this.hass.callWS({type:"calendar/event/create",entity_id:t,event:o})'
);

// ─── P10: _handleEditEventClick parses full RRULE ───
patch('P10',
    '_handleEditEventClick(){let e=this._currentEventDetails;this._currentEventDetails=null,this._editFormData={title:e.summary||"",calendar:e.calendars[0]||"",start:e.originalStart?e.originalStart.toFormat("yyyy-MM-dd\'T\'HH:mm"):"",end:e.originalEnd?e.originalEnd.toFormat("yyyy-MM-dd\'T\'HH:mm"):"",location:e.location||""},this._showEditEventDialog=e}',
    '_handleEditEventClick(){let e=this._currentEventDetails;this._currentEventDetails=null;let rs="";e.rrule?rs=e.rrule:e.recurrence_rule&&(rs=e.recurrence_rule);let p=this._parseRrule(rs);this._editFormData={title:e.summary||"",calendar:e.calendars[0]||"",startDate:e.originalStart?e.originalStart.toFormat("yyyy-MM-dd"):"",startTime:e.originalStart?e.originalStart.toFormat("HH:mm"):"",endDate:e.originalEnd?e.originalEnd.toFormat("yyyy-MM-dd"):"",endTime:e.originalEnd?e.originalEnd.toFormat("HH:mm"):"",location:e.location||"",recurrence:p.freq,recurrenceInterval:p.interval,recurrenceByDay:p.byDay,recurrenceByMonthDay:p.byMonthDay??(e.originalStart?e.originalStart.day:eh.DateTime.now().day),recurrenceEndType:p.endType,recurrenceEndDate:p.endDate,recurrenceEndCount:p.endCount},this._showEditEventDialog=e}'
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

// ─── P13: Full replacement of _handleUpdateEvent + new methods ───
const oldUpdateEvent = 'async _handleUpdateEvent(){let e=this._showEditEventDialog,t=this._editFormData;if(!e||!t)return void console.error("Skylight Family Calendar: No event or form data for update");let n=t.title?.trim(),i=t.calendar,a=t.start,r=t.end,s=t.location?.trim()??"";if(!n||!a)return void console.error("Skylight Family Calendar: Missing required fields",{title:n,startInput:a});let o=eh.DateTime.fromISO(a),l=r?eh.DateTime.fromISO(r):o.plus({hours:1}),d=i||e.calendars[0];try{if(e.uid){let t={summary:n,dtstart:o.toFormat("yyyy-MM-dd\'T\'HH:mm:ss"),dtend:l.toFormat("yyyy-MM-dd\'T\'HH:mm:ss")};s&&(t.location=s);let i={type:"calendar/event/update",entity_id:d,uid:e.uid,event:t};e.recurrence_id&&(i.recurrence_id=e.recurrence_id,i.recurrence_range="THISANDFUTURE"),await this.hass.callWS(i)}this._showEditEventDialog=null,this._editFormData=null,this._updateEvents()}catch(t){if("not_supported"===t.code&&e.uid)try{let t={type:"calendar/event/delete",entity_id:d,uid:e.uid};e.recurrence_id&&(t.recurrence_id=e.recurrence_id,t.recurrence_range="THISANDFUTURE"),await this.hass.callWS(t);let i={entity_id:d,summary:n,start_date_time:o.toFormat("yyyy-MM-dd HH:mm:ss"),end_date_time:l.toFormat("yyyy-MM-dd HH:mm:ss")};s&&(i.location=s),await this.hass.callService("calendar","create_event",i),this._showEditEventDialog=null,this._editFormData=null,this._updateEvents()}catch(e){console.error("Skylight Family Calendar: Failed to update event (fallback):",e)}else console.error("Skylight Family Calendar: Failed to update event:",t)}}';

const newUpdateEvent = `async _handleUpdateEvent(){let e=this._showEditEventDialog,t=this._editFormData;if(!e||!t)return void console.error("Skylight Family Calendar: No event or form data for update");if(e.recurrence_id){this._showRecurringConfirmDialog={event:e,form:{...t}};return}await this._performUpdateEvent(e,t,null)}async _handleUpdateThisEvent(){let c=this._showRecurringConfirmDialog;if(!c)return;this._showRecurringConfirmDialog=null,await this._performUpdateEvent(c.event,c.form,"this")}async _handleUpdateAllEvents(){let c=this._showRecurringConfirmDialog;if(!c)return;this._showRecurringConfirmDialog=null,await this._performUpdateEvent(c.event,c.form,"all")}async _handleDeleteThisEvent(){let c=this._showDeleteRecurringDialog;if(!c)return;let e=c.event;this._showDeleteRecurringDialog=null;try{let t={type:"calendar/event/delete",entity_id:e.calendars[0],uid:e.uid,recurrence_id:e.recurrence_id};await this.hass.callWS(t),"edit"===c.source?(this._showEditEventDialog=null,this._editFormData=null):this._currentEventDetails=null,this._updateEvents()}catch(e){console.error("Skylight Family Calendar: Failed to delete single event:",e)}}async _handleDeleteAllEvents(){let c=this._showDeleteRecurringDialog;if(!c)return;let e=c.event;this._showDeleteRecurringDialog=null;try{let t={type:"calendar/event/delete",entity_id:e.calendars[0],uid:e.uid};await this.hass.callWS(t),"edit"===c.source?(this._showEditEventDialog=null,this._editFormData=null):this._currentEventDetails=null,this._updateEvents()}catch(e){console.error("Skylight Family Calendar: Failed to delete all events:",e)}}async _performUpdateEvent(e,t,rm){let n=t.title?.trim(),i=t.calendar,a=t.startDate&&t.startTime?t.startDate+"T"+t.startTime:"",r=t.endDate&&t.endTime?t.endDate+"T"+t.endTime:"",s=t.location?.trim()??"",rc=this._buildRrule(t.recurrence,t.recurrenceInterval,t.recurrenceByDay,t.recurrenceByMonthDay,t.recurrenceEndType,t.recurrenceEndDate,t.recurrenceEndCount);if(!n||!a)return void console.error("Skylight Family Calendar: Missing required fields",{title:n,startInput:a});let o=eh.DateTime.fromISO(a),l=r?eh.DateTime.fromISO(r):o.plus({hours:1}),d=i||e.calendars[0];try{if(e.uid){let t={summary:n,dtstart:o.toFormat("yyyy-MM-dd'T'HH:mm:ss"),dtend:l.toFormat("yyyy-MM-dd'T'HH:mm:ss")};s&&(t.location=s),rc&&(t.rrule=rc);let i={type:"calendar/event/update",entity_id:d,uid:e.uid,event:t};"this"===rm?i.recurrence_id=e.recurrence_id:"all"!==rm&&e.recurrence_id&&(i.recurrence_id=e.recurrence_id,i.recurrence_range="THISANDFUTURE"),await this.hass.callWS(i)}this._showEditEventDialog=null,this._editFormData=null,this._updateEvents()}catch(t){if("not_supported"===t.code&&e.uid)try{let t={type:"calendar/event/delete",entity_id:d,uid:e.uid};"this"===rm?t.recurrence_id=e.recurrence_id:"all"!==rm&&e.recurrence_id&&(t.recurrence_id=e.recurrence_id,t.recurrence_range="THISANDFUTURE"),await this.hass.callWS(t);let i={summary:n,dtstart:o.toFormat("yyyy-MM-dd'T'HH:mm:ss"),dtend:l.toFormat("yyyy-MM-dd'T'HH:mm:ss")};s&&(i.location=s),rc&&(i.rrule=rc),await this.hass.callWS({type:"calendar/event/create",entity_id:d,event:i}),this._showEditEventDialog=null,this._editFormData=null,this._updateEvents()}catch(e){console.error("Skylight Family Calendar: Failed to update event (fallback):",e)}else console.error("Skylight Family Calendar: Failed to update event:",t)}}`;

patch('P13', oldUpdateEvent, newUpdateEvent);

// ─── P14: Add dialog rendering methods ───
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
    '_calendarVisibility:{type:Object},_showRecurringConfirmDialog:{type:Object},_showDeleteRecurringDialog:{type:Object},_createRecurrenceType:{type:String},_createRecurrenceEndType:{type:String}}}'
);

// ─── P17: Utility methods ───
// Insert after _closeEditEventDialog, before _handleDeleteEventFromEdit
// We'll insert right before _getViewLabel which we can find in the minified code
// Actually, let's find a good anchor. _getViewLabel is `_getViewLabel(e){` in minified.
// Better to add right after the P13 new methods (after _performUpdateEvent) by anchoring on _getViewLabel
const utilityMethods = `_toggleDayBtn(e){e.target.classList.toggle("active")}_toggleEditDayBtn(e,d){let bd=[...(this._editFormData.recurrenceByDay||[])],ix=bd.indexOf(d);ix>=0?bd.splice(ix,1):bd.push(d),this._editFormData={...this._editFormData,recurrenceByDay:bd}}_dayLabel(c){let m={MO:0,TU:1,WE:2,TH:3,FR:4,SA:5,SU:6},w=eh.Info.weekdays("short");return w[m[c]]??c}_getDefaultMonthDay(){let si=this.shadowRoot?.querySelector("#event-start-date")?.value;return si?eh.DateTime.fromISO(si).day:eh.DateTime.now().day}_buildRrule(fq,iv,bd,md,et,ed,ec){if(!fq)return"";let r=fq;iv&&iv>1&&(r+=";INTERVAL="+iv),"FREQ=WEEKLY"===fq&&bd&&bd.length>0&&(r+=";BYDAY="+bd.join(",")),"FREQ=MONTHLY"===fq&&md&&(r+=";BYMONTHDAY="+md);if("date"===et&&ed){let dt=eh.DateTime.fromISO(ed).endOf("day");r+=";UNTIL="+dt.toFormat("yyyyMMdd'T'HHmmss")}else"count"===et&&ec>0&&(r+=";COUNT="+ec);return r}_parseRrule(s){let r={freq:"",interval:1,byDay:[],byMonthDay:null,endType:"never",endDate:"",endCount:10};if(!s)return r;let ps=s.split(";");for(let p of ps){let[k,v]=p.split("=");switch(k){case"FREQ":r.freq="FREQ="+v;break;case"INTERVAL":r.interval=parseInt(v)||1;break;case"BYDAY":r.byDay=v.split(",");break;case"BYMONTHDAY":r.byMonthDay=parseInt(v);break;case"UNTIL":r.endType="date",r.endDate=eh.DateTime.fromFormat(v,"yyyyMMdd'T'HHmmss").toFormat("yyyy-MM-dd");break;case"COUNT":r.endType="count",r.endCount=parseInt(v)||10;break}}return r}`;

// Insert before _getViewLabel
patch('P17',
    '_getViewLabel(e){',
    utilityMethods + '_getViewLabel(e){'
);

// ─── P18a: Add box-sizing to .container .day (needed for border separators) ───
patch('P18a',
    '.container .day {\r\n        position: relative;\r\n        display: flex;\r\n        flex-direction: column;\r\n        width: calc((100%',
    '.container .day {\r\n        position: relative;\r\n        display: flex;\r\n        flex-direction: column;\r\n        box-sizing: border-box;\r\n        width: calc((100%'
);

// ─── P18: CSS for recurrence detail fields ───
const recurrenceCss = `\r\n\r\n    .datetime-row {\r\n        display: flex;\r\n        gap: 8px;\r\n    }\r\n    .datetime-row .form-input {\r\n        flex: 1;\r\n        min-width: 0;\r\n    }\r\n    .recurrence-inline {\r\n        display: flex;\r\n        align-items: center;\r\n        gap: 8px;\r\n    }\r\n    .recurrence-number {\r\n        width: 70px !important;\r\n        text-align: center;\r\n    }\r\n    .recurrence-unit {\r\n        font-size: 0.9em;\r\n        color: var(--secondary-text-color, #666);\r\n        white-space: nowrap;\r\n    }\r\n    .day-picker {\r\n        display: flex;\r\n        gap: 4px;\r\n        flex-wrap: wrap;\r\n    }\r\n    .day-btn {\r\n        padding: 6px 10px;\r\n        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.15));\r\n        border-radius: 4px;\r\n        background: transparent;\r\n        color: var(--primary-text-color, #333);\r\n        cursor: pointer;\r\n        font-size: 0.85em;\r\n    }\r\n    .day-btn.active {\r\n        background-color: var(--primary-color, #03a9f4);\r\n        color: var(--text-primary-color, #fff);\r\n        border-color: var(--primary-color, #03a9f4);\r\n    }\r\n    .container .day {\r\n        border-right: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));\r\n        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));\r\n    }`;

// Insert the CSS before @keyframes (after the P5 injection block)
// We'll anchor on the event-actions rule that P5 added
patch('P18',
    'ha-dialog .event-actions {\r\n        border-top-color: var(--divider-color, rgba(0, 0, 0, 0.12));\r\n    }\r\n\r\n    @keyframes',
    'ha-dialog .event-actions {\r\n        border-top-color: var(--divider-color, rgba(0, 0, 0, 0.12));\r\n    }' + recurrenceCss + '\r\n\r\n    @keyframes'
);

// ─── P19: _closeCreateEventDialog resets recurrence state ───
patch('P19',
    '_closeCreateEventDialog(){this._showCreateEventDialog=null}',
    '_closeCreateEventDialog(){this._showCreateEventDialog=null,this._createRecurrenceType=null,this._createRecurrenceEndType="never"}'
);

// ─── P20: Today highlight — orange badge on number only ───
patch('P20',
    '.container .day.today {\r\n        background-color: #03a9f410;\r\n        border-radius: 12px;\r\n    }\r\n\r\n    .container .day.today .date .number {\r\n        color: var(--skylight-accent, #03a9f4);\r\n        font-weight: bold;\r\n    }',
    '.container .day.today .date .number {\r\n        background-color: #f0a030;\r\n        color: #fff;\r\n        font-weight: bold;\r\n        border-radius: 8px;\r\n        display: inline-flex;\r\n        align-items: center;\r\n        justify-content: center;\r\n        min-width: 1.4em;\r\n        padding: 2px 6px;\r\n    }'
);

// ─── P21: Bold black time ───
patch('P21',
    '.container .day .events .event .time {\r\n        color: var(--secondary-text-color, #aaaaaa);\r\n        margin: 0 0 3px 0;\r\n    }',
    '.container .day .events .event .time {\r\n        color: var(--primary-text-color, #333);\r\n        margin: 0 0 3px 0;\r\n        font-weight: bold;\r\n    }'
);

// ─── P22: Location color black ───
patch('P22',
    '.container .day .events .event .location {\r\n        margin: 3px 0 0 0;\r\n        --mdc-icon-size: var(--event-icon-size);\r\n    }',
    '.container .day .events .event .location {\r\n        margin: 3px 0 0 0;\r\n        --mdc-icon-size: var(--event-icon-size);\r\n        color: var(--primary-text-color, #333);\r\n    }'
);

// Write output
const outPath = path.join(__dirname, 'dist', 'skylight-family-calendar-card.js');
fs.writeFileSync(outPath, buf);
console.log('\nPatched file written to:', outPath);
console.log('New size:', buf.length);
