import { FamilyCalendarCard } from './card';
import { FamilyCalendarCardEditor } from "./editor";
import { version } from '../package.json';

// Duplicate-resource guard: if our element is ALREADY defined before this module
// registers it, another copy of the card is loaded too — almost always a leftover
// `ha-skylight-family-calendar-card` Lovelace resource from before the repo was
// renamed. That stale copy wins the element registration and masks this version
// (symptom: "updates never apply"). Warn so the user removes the old resource.
if (customElements.get('family-calendar-card') || customElements.get('skylight-family-calendar-card')) {
    console.warn(
        '[Family Calendar Card] A duplicate/older copy of this card is already loaded — you likely ' +
        'have a leftover "ha-skylight-family-calendar-card" resource from before the repo rename. ' +
        'Remove it in Settings → Dashboards → (⋮) Resources, then reload. ' +
        `(this build: v${version})`
    );
}

// Primary (current) element names.
if (!customElements.get('family-calendar-card')) {
    customElements.define('family-calendar-card', FamilyCalendarCard);
}
if (!customElements.get('family-calendar-card-editor')) {
    customElements.define('family-calendar-card-editor', FamilyCalendarCardEditor);
}

// Backward-compatible aliases for the previous element names, so dashboards still
// using `custom:skylight-family-calendar-card` keep working after the rename. A
// custom-element constructor can only be registered to ONE tag, so each alias is
// a trivial subclass that inherits everything from the renamed class.
class SkylightFamilyCalendarCardCompat extends FamilyCalendarCard {}
class SkylightFamilyCalendarCardEditorCompat extends FamilyCalendarCardEditor {}
if (!customElements.get('skylight-family-calendar-card')) {
    customElements.define('skylight-family-calendar-card', SkylightFamilyCalendarCardCompat);
}
if (!customElements.get('skylight-family-calendar-card-editor')) {
    customElements.define('skylight-family-calendar-card-editor', SkylightFamilyCalendarCardEditorCompat);
}

window.customCards = window.customCards || [];
window.customCards.push({
    type: 'family-calendar-card',
    name: 'Family Calendar Card',
    description: 'A family calendar card with weather, event management, and touchscreen-friendly UI.',
    // Adds a help link in the frontend card editor.
    documentationURL: 'https://github.com/tienou/family-calendar-card',
    // Suggest this card when the user picks a calendar.* entity in the card picker.
    getEntitySuggestion: (hass, entityId) => {
        if (entityId.split('.')[0] !== 'calendar') {
            return null;
        }
        return {
            config: {
                type: 'custom:family-calendar-card',
                calendars: [{ entity: entityId }],
            },
        };
    },
});

console.info(
    `%c FAMILY-CALENDAR %c v${version} `,
    'color: white; background: #4A90E2; font-weight: 700;',
    'color: #4A90E2; background: white; font-weight: 700;',
);
