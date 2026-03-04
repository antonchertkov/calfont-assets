// ─────────────────────────────────────────────────────────────────────────────
//  CALFONT — TONE LIBRARY
//  Loaded before calfont-engine.js. Engine reads window.CF.tones on init.
//
//  TO ADD A TONE:
//    Add a new key to the object below. The key is used internally.
//    label  → what appears in the UI when cycling tones
//    titles → pool of meeting names randomly drawn for each block
//
//  TO EDIT A TONE:
//    Just edit the titles array. Changes take effect on next page load.
//
//  TO REMOVE A TONE:
//    Delete its key entirely. The engine handles any number of tones.
//
//  ORDER:
//    Tones cycle in the order they appear here.
// ─────────────────────────────────────────────────────────────────────────────

window.CF = window.CF || {};

window.CF.tones = {

  STANDARD: {
    label: 'STANDARD',
    titles: [
      'Check-In with Client',
      'Kick-off',
      'Alignment with Steve',
      'Sprint Workshop',
      'Team Introduction',
      'Standup',
      'Quarterly Review',
      '1:1 with Manager',
      'Product Sync',
      'Stakeholder Update',
      'Design Review',
      'All Hands',
      'Retro',
      'Planning Session',
      'Client Call',
      'Strategy Meeting',
      'OKR Review',
      'Onboarding',
      'Tech Deep Dive',
      'Brand Alignment',
      'Budget Review',
      'Roadmap Sync',
      'Feasibility Workshop',
    ]
  },

  HOPEFUL: {
    label: 'HOPEFUL',
    titles: [
      'Me Time',
      'Taking a Break',
      'Going for a Walk',
      'Coffee Date',
      'Gym',
      'Working from Home',
      'Read a Book',
      'Lunch with a Friend',
      'No Meetings Please',
      'Focus Block',
      'Digital Detox',
      'Creative Time',
      'Mindful Moment',
      'Fresh Air',
      'Power Nap',
      'Garden Break',
      'Journaling',
      'Cook Something Nice',
      'Call Mum',
      'Do Nothing',
      'Stretch Break',
      'Bike Ride',
      'Long Lunch',
    ]
  },

  PARODY: {
    label: 'PARODY',
    titles: [
      'Go Cry',
      'Ignoring Slack Messages',
      'Not Available',
      'Browse LinkedIn for New Job',
      'Important Smoke Break',
      'Pretend to Work',
      'Stare at Wall',
      'Avoid Everyone',
      'Fake Commute',
      'Reply Later (Never)',
      'Doomscrolling',
      'Apply to 10 Jobs',
      'Question Life Choices',
      'Rethink Career',
      'Be Perceived',
      'Touch Grass',
      'Existential Lunch',
      'Hide in Bathroom',
      'Update CV Again',
      'Cry but Make it Scrum',
      'Silent Resignation',
      'Ctrl+Z My Career',
      'Out of Office (Forever)',
    ]
  },

  VACATION: {
    label: 'VACATION',
    titles: [
      'Morning Espresso',
      'Aperol Spritz Break',
      'Gelato Research',
      'Roman Sunset Walk',
      'Pasta Quality Control',
      'Vespa City Ride',
      'Antipasti Hour',
      'Colosseum Stroll',
      'Trastevere Wandering',
      'Dolce Vita Time',
      'Pizza Tasting',
      'Market in Campo',
      'Tiramisu Evaluation',
      'Wine in Monti',
      'Roman Holiday',
      'Fountain Coin Toss',
      'Golden Hour Piazza',
      'Olive Oil Sampling',
      'Panini Lunch Break',
      'Lazy Roman Afternoon',
      'Balcony Espresso',
      'Evening Aperitivo',
      'Secret Gelato Spot',
      'Roaming Roman Streets',
      'Lunch in Trastevere',
      'Sunset over Tiber',
      'Spritz with Friends',
      'Vatican Day Off',
      'Cappuccino & Cornetto',
      'Late Night Carbonara',
      'Get Dream-job offer',
    ]
  },


  
  // ── ADD NEW TONES BELOW ───────────────────────────────────────────────────
  //
  // Example:
  //
  // CORPORATE: {
  //   label: 'CORPORATE',
  //   titles: [
  //     'Synergy Session',
  //     'Move the Needle',
  //     'Low-Hanging Fruit Review',
  //     'Boil the Ocean Workshop',
  //     'Circle Back',
  //     'Take This Offline',
  //     'Bandwidth Check',
  //   ]
  // },

};
