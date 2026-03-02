//
// calfont-presets.js
//
// Starter glyphs loaded when CalFont opens for the first time.
// Edit this file freely — it never affects calfont-engine.js.
//
// FORMAT: human-readable HH:MM — same as the session JSON export.
// Each entry: { col, from, to, title, outlined }
// col   : column index (1 = leftmost column of the glyph)
// from  : start time "HH:MM"
// to    : end time   "HH:MM"
// title : calendar meeting label shown inside the block
// outlined: true = outlined style, false = filled style
//
// To add a new glyph, copy an existing entry and edit.
// Upload this file to GitHub alongside calfont-engine.js.
// No engine changes needed.
//

window.CF = window.CF || {};

window.CF.presets = {
  "H": [
    {
      "col": 1,
      "from": "09:00",
      "to": "17:00",
      "title": "Brand Alignment",
      "outlined": false
    },
    {
      "col": 1,
      "from": "09:15",
      "to": "09:45",
      "title": "Alignment with Steve",
      "outlined": false
    },
    {
      "col": 1,
      "from": "11:45",
      "to": "13:15",
      "title": "Standup",
      "outlined": false
    },
    {
      "col": 2,
      "from": "11:15",
      "to": "13:00",
      "title": "Design Review",
      "outlined": false
    },
    {
      "col": 2,
      "from": "11:30",
      "to": "17:00",
      "title": "Onboarding",
      "outlined": false
    },
    {
      "col": 2,
      "from": "12:00",
      "to": "17:00",
      "title": "Feasibility Workshop",
      "outlined": false
    }
  ],
  "E": [
    {
      "col": 1,
      "from": "09:00",
      "to": "17:00",
      "title": "1:1 with Manager",
      "outlined": false
    },
    {
      "col": 1,
      "from": "15:15",
      "to": "17:00",
      "title": "Design Review",
      "outlined": false
    },
    {
      "col": 1,
      "from": "09:00",
      "to": "10:45",
      "title": "Planning Session",
      "outlined": false
    },
    {
      "col": 2,
      "from": "09:00",
      "to": "10:45",
      "title": "Kick-off",
      "outlined": false
    },
    {
      "col": 1,
      "from": "12:15",
      "to": "13:30",
      "title": "1:1 with Manager",
      "outlined": false
    },
    {
      "col": 2,
      "from": "12:15",
      "to": "13:30",
      "title": "Standup",
      "outlined": false
    },
    {
      "col": 2,
      "from": "15:15",
      "to": "17:00",
      "title": "Sprint Workshop",
      "outlined": false
    }
  ],
  "L": [
    {
      "col": 1,
      "from": "09:00",
      "to": "15:15",
      "title": "Standup",
      "outlined": false
    },
    {
      "col": 1,
      "from": "15:30",
      "to": "17:00",
      "title": "Brand Alignment",
      "outlined": false
    },
    {
      "col": 2,
      "from": "15:00",
      "to": "17:00",
      "title": "Feasibility Workshop",
      "outlined": false
    }
  ],
  "!": [
    {
      "col": 1,
      "from": "09:00",
      "to": "14:30",
      "title": "Stakeholder Update",
      "outlined": false
    },
    {
      "col": 1,
      "from": "15:15",
      "to": "17:00",
      "title": "1:1 with Manager",
      "outlined": false
    }
  ],
  "P": [
    {
      "col": 1,
      "from": "09:00",
      "to": "17:00",
      "title": "Retro",
      "outlined": false
    },
    {
      "col": 2,
      "from": "09:00",
      "to": "10:15",
      "title": "Roadmap Sync",
      "outlined": false
    },
    {
      "col": 2,
      "from": "09:15",
      "to": "13:30",
      "title": "Planning Session",
      "outlined": false
    },
    {
      "col": 2,
      "from": "12:15",
      "to": "13:45",
      "title": "Strategy Meeting",
      "outlined": false
    },
    {
      "col": 2,
      "from": "09:45",
      "to": "13:00",
      "title": "Design Review",
      "outlined": false
    },
    {
      "col": 1,
      "from": "09:00",
      "to": "10:15",
      "title": "Team Introduction",
      "outlined": false
    },
    {
      "col": 1,
      "from": "12:15",
      "to": "13:45",
      "title": "Budget Review",
      "outlined": false
    }
  ]
};
