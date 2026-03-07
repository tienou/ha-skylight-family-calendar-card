# Skylight Family Calendar Card

![Skylight Family Calendar](examples/screenshots/main_view.jpeg)

A Skylight-inspired family calendar card for Home Assistant. Displays events from multiple calendars with a beautiful touchscreen-friendly interface, weather integration, and full event management (create, edit, delete).

## Inspirations & Credits

This project builds upon and is inspired by:

- **[FamousWolf/week-planner-card](https://github.com/FamousWolf/week-planner-card)** by Rudy Gnodde -- the foundational calendar rendering engine, event display logic, and navigation system
- **[mohesles/my-skylight-calendar](https://github.com/mohesles/my-skylight-calendar)** -- the original DIY Skylight calendar concept and dashboard design for Home Assistant
- **[Skylight](https://www.skylightframe.com/)**, **[Cozyla](https://www.cozyla.com/)**, and **[Hearth](https://www.hearth.com/)** -- commercial smart home calendars that inspired the aesthetic and user experience

## Features

- Date, time, and weather header (Skylight-style)
- Calendar filter buttons to show/hide individual calendars
- View selector: Today, Tomorrow, Week, Biweek, Month
- Event creation, editing, and deletion (with recurrence support)
- Weather forecast per day + current weather in header
- Month/week navigation with arrows
- Calendar legend with toggle
- Multi-day event display modes
- Responsive layout with configurable columns
- Compact mode
- Full GUI configuration editor
- Customizable texts for localization
- HACS compatible

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant
2. Go to Frontend
3. Click the three dots menu and select "Custom repositories"
4. Add `https://github.com/tienou/ha-skylight-family-calendar-card` with category "Lovelace"
5. Install "Skylight Family Calendar Card"
6. Restart Home Assistant

### Manual

1. Download `skylight-family-calendar-card.js` from the [latest release](https://github.com/tienou/ha-skylight-family-calendar-card/releases)
2. Copy it to `config/www/skylight-family-calendar-card.js`
3. Add the resource in your dashboard:

```yaml
resources:
  - url: /local/skylight-family-calendar-card.js?version=1.0.0
    type: module
```

## Configuration

### Basic example

```yaml
type: custom:skylight-family-calendar-card
title: Family Calendar
locale: en
defaultView: Week
startingDay: monday
showHeader: true
weather:
  entity: weather.home
  showCondition: true
  showTemperature: true
  showLowTemperature: true
calendars:
  - entity: calendar.family
    name: Family
    icon: mdi:calendar-heart
    color: "#4A90E2"
  - entity: calendar.work
    name: Work
    icon: mdi:briefcase
    color: "#E27D4A"
```

### Configuration options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | - | Card title |
| `locale` | string | `en` | Language locale |
| `defaultView` | string | `Week` | Default view (Today/Tomorrow/Week/Biweek/Month) |
| `startingDay` | string | `monday` | First day of the week |
| `showHeader` | boolean | `true` | Show the date/time/weather header |
| `views` | list | all | Which view buttons to show |
| `calendars` | list | required | Calendar entities to display |
| `weather` | object | - | Weather entity and display options |
| `defaultCalendar` | string | - | Default calendar for event creation |
| `showNavigation` | boolean | `false` | Show month navigation arrows |
| `showLegend` | boolean | `false` | Show calendar legend |
| `legendToggle` | boolean | `false` | Click legend to toggle calendars |
| `compact` | boolean | `false` | Compact display mode |
| `showTime` | boolean | `false` | Show event times |
| `showTitle` | boolean | `true` | Show event titles |
| `showDescription` | boolean | `false` | Show event descriptions |
| `showLocation` | boolean | `false` | Show event locations |
| `showDayName` | boolean | `false` | Show day names |
| `showDate` | boolean | `false` | Show date in event details |
| `showCalendarName` | boolean | `false` | Show calendar name in details |
| `hidePastEvents` | boolean | `false` | Hide past events |
| `hideWeekend` | boolean | `false` | Hide weekend days |
| `combineSimilarEvents` | boolean | `false` | Combine duplicate events |
| `updateInterval` | number | `60` | Update interval in seconds |

### Calendar options

| Option | Type | Description |
|--------|------|-------------|
| `entity` | string | Calendar entity ID (required) |
| `name` | string | Display name |
| `color` | string | Color (hex) |
| `icon` | string | MDI icon |
| `filter` | string | Regex to filter events |

## Optional Theme

An optional Skylight theme with the Ovo font is included in `themes/skylight.yaml`. Copy it to your Home Assistant themes directory for a more authentic Skylight look.

## License

MIT License

Copyright (c) 2024 Rudy Gnodde (week-planner-card)
Copyright (c) 2024 mohesles (my-skylight-calendar)
Copyright (c) 2025 Etienne Gaillard (ha-skylight-family-calendar-card)
