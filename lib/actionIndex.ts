/**
 * Index of the :Otherscape Action Database supplement: every action entry by
 * name, chapter and section, with the Effects its success usually uses and
 * the page to find it on. (The entries themselves — example tags, extra
 * feats and Consequences — are in the book.) Generated from the book's
 * table of contents; entries with no Effects listed point elsewhere.
 */
export interface ActionEntry {
  name: string
  chapter: string
  section: string
  page: number
  effects: string[]
}

export const ACTION_INDEX: ActionEntry[] = [
  {
    "name": "Area Attacks",
    "chapter": "Combat",
    "section": "Direct Attacks",
    "page": 12,
    "effects": [
      "Attack"
    ]
  },
  {
    "name": "Hand-to-Hand Attacks",
    "chapter": "Combat",
    "section": "Direct Attacks",
    "page": 12,
    "effects": [
      "Attack"
    ]
  },
  {
    "name": "Homing Ranged Attacks",
    "chapter": "Combat",
    "section": "Direct Attacks",
    "page": 13,
    "effects": []
  },
  {
    "name": "Multiple Attacks",
    "chapter": "Combat",
    "section": "Direct Attacks",
    "page": 13,
    "effects": []
  },
  {
    "name": "Precision Attacks",
    "chapter": "Combat",
    "section": "Direct Attacks",
    "page": 13,
    "effects": []
  },
  {
    "name": "Ranged Attacks",
    "chapter": "Combat",
    "section": "Direct Attacks",
    "page": 13,
    "effects": [
      "Attack"
    ]
  },
  {
    "name": "Restraining an Opponent",
    "chapter": "Combat",
    "section": "Direct Attacks",
    "page": 14,
    "effects": [
      "Disrupt",
      "Attack"
    ]
  },
  {
    "name": "Surprise Attacks and Silent Kills",
    "chapter": "Combat",
    "section": "Direct Attacks",
    "page": 14,
    "effects": []
  },
  {
    "name": "Two-weapon Fighting",
    "chapter": "Combat",
    "section": "Direct Attacks",
    "page": 14,
    "effects": [
      "Disrupt",
      "Attack"
    ]
  },
  {
    "name": "Attacks to Hold Off or Spur Opponents",
    "chapter": "Combat",
    "section": "Tactical Attacks",
    "page": 15,
    "effects": []
  },
  {
    "name": "Disarming and Sundering Gear",
    "chapter": "Combat",
    "section": "Tactical Attacks",
    "page": 15,
    "effects": [
      "Weaken",
      "Influence",
      "Disrupt"
    ]
  },
  {
    "name": "Feinting and Distracting Attacks",
    "chapter": "Combat",
    "section": "Tactical Attacks",
    "page": 16,
    "effects": []
  },
  {
    "name": "Impairing Attacks",
    "chapter": "Combat",
    "section": "Tactical Attacks",
    "page": 16,
    "effects": [
      "Disrupt",
      "Weaken"
    ]
  },
  {
    "name": "Trick Shots",
    "chapter": "Combat",
    "section": "Tactical Attacks",
    "page": 17,
    "effects": [
      "Create",
      "Influence"
    ]
  },
  {
    "name": "Analyzing the Battlefield",
    "chapter": "Combat",
    "section": "Combat Support",
    "page": 18,
    "effects": [
      "Discover",
      "Disrupt"
    ]
  },
  {
    "name": "Assisting an Ally",
    "chapter": "Combat",
    "section": "Combat Support",
    "page": 18,
    "effects": [
      "Enhance",
      "Bestow"
    ]
  },
  {
    "name": "Assuming a Battle Stance",
    "chapter": "Combat",
    "section": "Combat Support",
    "page": 19,
    "effects": [
      "Enhance"
    ]
  },
  {
    "name": "Improvised Weapons",
    "chapter": "Combat",
    "section": "Combat Support",
    "page": 19,
    "effects": [
      "Create"
    ]
  },
  {
    "name": "Preparing an Attack",
    "chapter": "Combat",
    "section": "Combat Support",
    "page": 20,
    "effects": [
      "Enhance"
    ]
  },
  {
    "name": "Leadership",
    "chapter": "Combat",
    "section": "Combat Support",
    "page": 20,
    "effects": [
      "Influence",
      "Enhance",
      "Restore"
    ]
  },
  {
    "name": "Tactical Teamwork",
    "chapter": "Combat",
    "section": "Combat Support",
    "page": 20,
    "effects": []
  },
  {
    "name": "Treating Injuries",
    "chapter": "Combat",
    "section": "Combat Support",
    "page": 20,
    "effects": [
      "Restore",
      "Discover"
    ]
  },
  {
    "name": "Forcing an Opponent to Move",
    "chapter": "Combat",
    "section": "Combat Movement",
    "page": 21,
    "effects": [
      "Disrupt",
      "Weaken"
    ]
  },
  {
    "name": "Moving Around the Battlefield",
    "chapter": "Combat",
    "section": "Combat Movement",
    "page": 21,
    "effects": [
      "Enhance"
    ]
  },
  {
    "name": "Retreating From Combat",
    "chapter": "Combat",
    "section": "Combat Movement",
    "page": 22,
    "effects": []
  },
  {
    "name": "Vehicle Combat",
    "chapter": "Combat",
    "section": "Combat Movement",
    "page": 22,
    "effects": []
  },
  {
    "name": "Blocking or Soaking an Attack",
    "chapter": "Combat",
    "section": "Combat Defense",
    "page": 22,
    "effects": []
  },
  {
    "name": "Dodging an Attack",
    "chapter": "Combat",
    "section": "Combat Defense",
    "page": 23,
    "effects": [
      "Mitigate"
    ]
  },
  {
    "name": "Taking Cover",
    "chapter": "Combat",
    "section": "Combat Defense",
    "page": 23,
    "effects": [
      "Create"
    ]
  },
  {
    "name": "Accessing Data",
    "chapter": "Cyberspace",
    "section": "Data, Network, and Coding",
    "page": 29,
    "effects": [
      "Discover",
      "Create"
    ]
  },
  {
    "name": "Connecting to a Node",
    "chapter": "Cyberspace",
    "section": "Data, Network, and Coding",
    "page": 29,
    "effects": []
  },
  {
    "name": "Data Forgery",
    "chapter": "Cyberspace",
    "section": "Data, Network, and Coding",
    "page": 29,
    "effects": [
      "Create"
    ]
  },
  {
    "name": "Disconnecting",
    "chapter": "Cyberspace",
    "section": "Data, Network, and Coding",
    "page": 30,
    "effects": []
  },
  {
    "name": "Protecting Data or Programs",
    "chapter": "Cyberspace",
    "section": "Data, Network, and Coding",
    "page": 30,
    "effects": [
      "Enhance"
    ]
  },
  {
    "name": "Repairing Data or Programs",
    "chapter": "Cyberspace",
    "section": "Data, Network, and Coding",
    "page": 31,
    "effects": [
      "Restore"
    ]
  },
  {
    "name": "Scanning the Network",
    "chapter": "Cyberspace",
    "section": "Data, Network, and Coding",
    "page": 31,
    "effects": [
      "Discover"
    ]
  },
  {
    "name": "Tracing Data or Signal",
    "chapter": "Cyberspace",
    "section": "Data, Network, and Coding",
    "page": 32,
    "effects": [
      "Advance"
    ]
  },
  {
    "name": "Writing a New Program",
    "chapter": "Cyberspace",
    "section": "Data, Network, and Coding",
    "page": 32,
    "effects": [
      "Create",
      "Advance"
    ]
  },
  {
    "name": "Blocking a Digital Attack",
    "chapter": "Cyberspace",
    "section": "Hacking",
    "page": 33,
    "effects": [
      "Mitigate"
    ]
  },
  {
    "name": "Crashing a Node or a Program",
    "chapter": "Cyberspace",
    "section": "Hacking",
    "page": 33,
    "effects": [
      "Attack"
    ]
  },
  {
    "name": "Disrupting Device Functionality",
    "chapter": "Cyberspace",
    "section": "Hacking",
    "page": 34,
    "effects": [
      "Disrupt",
      "Weaken",
      "Set Back",
      "Advance",
      "Influence",
      "Attack"
    ]
  },
  {
    "name": "Overriding or Fooling a Security Device or Program",
    "chapter": "Cyberspace",
    "section": "Hacking",
    "page": 34,
    "effects": []
  },
  {
    "name": "Taking Control Over a Node or a Program",
    "chapter": "Cyberspace",
    "section": "Hacking",
    "page": 35,
    "effects": []
  },
  {
    "name": "Altering the VR Environment",
    "chapter": "Cyberspace",
    "section": "VR Modeling",
    "page": 36,
    "effects": [
      "Bestow",
      "Weaken"
    ]
  },
  {
    "name": "Creating VR Constructs",
    "chapter": "Cyberspace",
    "section": "VR Modeling",
    "page": 36,
    "effects": [
      "Create"
    ]
  },
  {
    "name": "Customizing an Avatar",
    "chapter": "Cyberspace",
    "section": "VR Modeling",
    "page": 37,
    "effects": [
      "Bestow",
      "Enhance"
    ]
  },
  {
    "name": "Moving in VR",
    "chapter": "Cyberspace",
    "section": "VR Modeling",
    "page": 37,
    "effects": [
      "Bestow"
    ]
  },
  {
    "name": "Harnessing a Brain",
    "chapter": "Cyberspace",
    "section": "Harnessing",
    "page": 38,
    "effects": [
      "Bestow"
    ]
  },
  {
    "name": "Taking Actions in VR While Harnessed",
    "chapter": "Cyberspace",
    "section": "Harnessing",
    "page": 39,
    "effects": []
  },
  {
    "name": "Chases",
    "chapter": "Exploration & Survival",
    "section": "Navigating Danger",
    "page": 42,
    "effects": [
      "Advance",
      "Disrupt",
      "Enhance",
      "Mitigate"
    ]
  },
  {
    "name": "Creating and Removing Hazards and Obstacles",
    "chapter": "Exploration & Survival",
    "section": "Navigating Danger",
    "page": 43,
    "effects": []
  },
  {
    "name": "Scavenging",
    "chapter": "Exploration & Survival",
    "section": "Navigating Danger",
    "page": 43,
    "effects": [
      "Create",
      "Disrupt",
      "Weaken"
    ]
  },
  {
    "name": "Scouting and Guarding",
    "chapter": "Exploration & Survival",
    "section": "Navigating Danger",
    "page": 44,
    "effects": [
      "Discover",
      "Enhance"
    ]
  },
  {
    "name": "Sneaking Past a Threat",
    "chapter": "Exploration & Survival",
    "section": "Navigating Danger",
    "page": 44,
    "effects": [
      "Advance"
    ]
  },
  {
    "name": "Surviving Environmental Hazards",
    "chapter": "Exploration & Survival",
    "section": "Navigating Danger",
    "page": 44,
    "effects": []
  },
  {
    "name": "Travel and Survival in Dangerous Environments",
    "chapter": "Exploration & Survival",
    "section": "Navigating Danger",
    "page": 45,
    "effects": []
  },
  {
    "name": "Mental and Physical Resilience and Recovery",
    "chapter": "Exploration & Survival",
    "section": "Medicine, Health, and Recovery",
    "page": 46,
    "effects": []
  },
  {
    "name": "Performance Enhancement",
    "chapter": "Exploration & Survival",
    "section": "Medicine, Health, and Recovery",
    "page": 46,
    "effects": [
      "Bestow",
      "Mitigate",
      "Restore",
      "Discover",
      "Create"
    ]
  },
  {
    "name": "Treating Injuries and Other Conditions",
    "chapter": "Exploration & Survival",
    "section": "Medicine, Health, and Recovery",
    "page": 47,
    "effects": []
  },
  {
    "name": "Aiding Others with Mythos Powers",
    "chapter": "Mythos",
    "section": "Using Mythic Powers",
    "page": 50,
    "effects": []
  },
  {
    "name": "Attacking with Mythos Powers",
    "chapter": "Mythos",
    "section": "Using Mythic Powers",
    "page": 50,
    "effects": []
  },
  {
    "name": "Divination or Magical Senses",
    "chapter": "Mythos",
    "section": "Using Mythic Powers",
    "page": 50,
    "effects": [
      "Bestow",
      "Create",
      "Enhance"
    ]
  },
  {
    "name": "Finding and Focusing on a Specific Ability",
    "chapter": "Mythos",
    "section": "Using Mythic Powers",
    "page": 50,
    "effects": []
  },
  {
    "name": "Granting Abilities to People or Items",
    "chapter": "Mythos",
    "section": "Using Mythic Powers",
    "page": 51,
    "effects": []
  },
  {
    "name": "Healing with Mythos Powers",
    "chapter": "Mythos",
    "section": "Using Mythic Powers",
    "page": 51,
    "effects": [
      "Restore",
      "Discover",
      "Create",
      "Weaken"
    ]
  },
  {
    "name": "Manipulating Others with Mythos Powers",
    "chapter": "Mythos",
    "section": "Using Mythic Powers",
    "page": 52,
    "effects": []
  },
  {
    "name": "Moving and Evading with Mythos Powers",
    "chapter": "Mythos",
    "section": "Using Mythic Powers",
    "page": 52,
    "effects": []
  },
  {
    "name": "Protecting with Mythos Powers",
    "chapter": "Mythos",
    "section": "Using Mythic Powers",
    "page": 52,
    "effects": []
  },
  {
    "name": "Shapeshifting and Transformations",
    "chapter": "Mythos",
    "section": "Using Mythic Powers",
    "page": 52,
    "effects": []
  },
  {
    "name": "Shaping the Environment with Mythos Powers",
    "chapter": "Mythos",
    "section": "Using Mythic Powers",
    "page": 52,
    "effects": []
  },
  {
    "name": "Communing with a Mythos",
    "chapter": "Mythos",
    "section": "Mythoi & Sources",
    "page": 53,
    "effects": [
      "Discover"
    ]
  },
  {
    "name": "Identifying a Source",
    "chapter": "Mythos",
    "section": "Mythoi & Sources",
    "page": 54,
    "effects": [
      "Discover",
      "Advance"
    ]
  },
  {
    "name": "Banishing a Conjuration",
    "chapter": "Mythos",
    "section": "Conjuring & Companions",
    "page": 55,
    "effects": [
      "Attack"
    ]
  },
  {
    "name": "Commanding a Conjuration",
    "chapter": "Mythos",
    "section": "Conjuring & Companions",
    "page": 56,
    "effects": [
      "Influence",
      "Mitigate",
      "Weaken",
      "Disrupt"
    ]
  },
  {
    "name": "Summoning a Conjuration",
    "chapter": "Mythos",
    "section": "Conjuring & Companions",
    "page": 57,
    "effects": [
      "Create"
    ]
  },
  {
    "name": "Countering, Dispelling, or Disenchanting Mythos Powers and Sources",
    "chapter": "Mythos",
    "section": "The Arcane Arts",
    "page": 57,
    "effects": []
  },
  {
    "name": "Performing Magical Rituals",
    "chapter": "Mythos",
    "section": "The Arcane Arts",
    "page": 58,
    "effects": [
      "Advance",
      "Enhance"
    ]
  },
  {
    "name": "Sourcecraft",
    "chapter": "Mythos",
    "section": "The Arcane Arts",
    "page": 59,
    "effects": []
  },
  {
    "name": "Warding",
    "chapter": "Mythos",
    "section": "The Arcane Arts",
    "page": 59,
    "effects": [
      "Enhance",
      "Attack"
    ]
  },
  {
    "name": "Making a Purchase",
    "chapter": "Social Interactions",
    "section": "Business Transactions",
    "page": 62,
    "effects": [
      "Create"
    ]
  },
  {
    "name": "Negotiating a Fee",
    "chapter": "Social Interactions",
    "section": "Business Transactions",
    "page": 63,
    "effects": [
      "Enhance"
    ]
  },
  {
    "name": "Paying for a Service",
    "chapter": "Social Interactions",
    "section": "Business Transactions",
    "page": 64,
    "effects": []
  },
  {
    "name": "Selling Stuff",
    "chapter": "Social Interactions",
    "section": "Business Transactions",
    "page": 64,
    "effects": [
      "Enhance",
      "Bestow"
    ]
  },
  {
    "name": "Competitions",
    "chapter": "Social Interactions",
    "section": "In-person Interactions",
    "page": 65,
    "effects": [
      "Advance",
      "Set Back"
    ]
  },
  {
    "name": "Deception",
    "chapter": "Social Interactions",
    "section": "In-person Interactions",
    "page": 66,
    "effects": [
      "Influence",
      "Create",
      "Advance"
    ]
  },
  {
    "name": "Gathering Support and Resources",
    "chapter": "Social Interactions",
    "section": "In-person Interactions",
    "page": 67,
    "effects": []
  },
  {
    "name": "Making an Impression",
    "chapter": "Social Interactions",
    "section": "In-person Interactions",
    "page": 67,
    "effects": [
      "Influence",
      "Enhance"
    ]
  },
  {
    "name": "Getting Close to Someone",
    "chapter": "Social Interactions",
    "section": "In-person Interactions",
    "page": 68,
    "effects": []
  },
  {
    "name": "Negotiation",
    "chapter": "Social Interactions",
    "section": "In-person Interactions",
    "page": 68,
    "effects": [
      "Create"
    ]
  },
  {
    "name": "Manipulating Public Opinion",
    "chapter": "Social Interactions",
    "section": "In-person Interactions",
    "page": 68,
    "effects": [
      "Influence"
    ]
  },
  {
    "name": "Outsourcing a Job",
    "chapter": "Social Interactions",
    "section": "In-person Interactions",
    "page": 69,
    "effects": [
      "Attack",
      "Disrupt",
      "Influence",
      "Weaken",
      "Bestow",
      "Create",
      "Enhance",
      "Restore",
      "Advance",
      "Set Back",
      "Discover"
    ]
  },
  {
    "name": "Persuasion",
    "chapter": "Social Interactions",
    "section": "In-person Interactions",
    "page": 70,
    "effects": [
      "Influence"
    ]
  },
  {
    "name": "Preparing an Approach",
    "chapter": "Social Interactions",
    "section": "In-person Interactions",
    "page": 71,
    "effects": [
      "Enhance"
    ]
  },
  {
    "name": "Resisting Social or Emotional Manipulation",
    "chapter": "Social Interactions",
    "section": "In-person Interactions",
    "page": 71,
    "effects": []
  },
  {
    "name": "Helping and Supporting",
    "chapter": "Social Interactions",
    "section": "Teamwork",
    "page": 72,
    "effects": [
      "Bestow"
    ]
  },
  {
    "name": "Leadership",
    "chapter": "Social Interactions",
    "section": "Teamwork",
    "page": 73,
    "effects": [
      "Influence",
      "Enhance",
      "Restore"
    ]
  },
  {
    "name": "Team Preparations",
    "chapter": "Social Interactions",
    "section": "Teamwork",
    "page": 73,
    "effects": [
      "Bestow",
      "Enhance",
      "Restore",
      "Influence"
    ]
  },
  {
    "name": "Avoiding Attention and Staying Anonymous",
    "chapter": "Spycraft",
    "section": "Clandestine Operations",
    "page": 76,
    "effects": []
  },
  {
    "name": "Breaking and Entering",
    "chapter": "Spycraft",
    "section": "Clandestine Operations",
    "page": 76,
    "effects": []
  },
  {
    "name": "Infiltration",
    "chapter": "Spycraft",
    "section": "Clandestine Operations",
    "page": 76,
    "effects": [
      "Advance"
    ]
  },
  {
    "name": "Losing a Tail",
    "chapter": "Spycraft",
    "section": "Clandestine Operations",
    "page": 76,
    "effects": [
      "Restore"
    ]
  },
  {
    "name": "Sneaking and Hiding",
    "chapter": "Spycraft",
    "section": "Clandestine Operations",
    "page": 77,
    "effects": [
      "Enhance",
      "Disrupt"
    ]
  },
  {
    "name": "Surveilling",
    "chapter": "Spycraft",
    "section": "Clandestine Operations",
    "page": 78,
    "effects": [
      "Discover",
      "Enhance"
    ]
  },
  {
    "name": "Conversational Inquiry",
    "chapter": "Spycraft",
    "section": "Intel Gathering",
    "page": 79,
    "effects": [
      "Discover",
      "Create"
    ]
  },
  {
    "name": "Reconnaissance",
    "chapter": "Spycraft",
    "section": "Intel Gathering",
    "page": 79,
    "effects": [
      "Discover",
      "Create"
    ]
  },
  {
    "name": "Researching a Topic",
    "chapter": "Spycraft",
    "section": "Intel Gathering",
    "page": 80,
    "effects": [
      "Discover",
      "Create"
    ]
  },
  {
    "name": "Searching and Investigating a Scene",
    "chapter": "Spycraft",
    "section": "Intel Gathering",
    "page": 81,
    "effects": []
  },
  {
    "name": "Evaluating and Activating Tech",
    "chapter": "Tech & Gear",
    "section": "Operating Tech & Gear",
    "page": 84,
    "effects": [
      "Discover",
      "Advance"
    ]
  },
  {
    "name": "Operating a Drone",
    "chapter": "Tech & Gear",
    "section": "Operating Tech & Gear",
    "page": 85,
    "effects": []
  },
  {
    "name": "Programming a Drone",
    "chapter": "Tech & Gear",
    "section": "Operating Tech & Gear",
    "page": 85,
    "effects": [
      "Enhance",
      "Restore"
    ]
  },
  {
    "name": "Piloting",
    "chapter": "Tech & Gear",
    "section": "Operating Tech & Gear",
    "page": 86,
    "effects": [
      "Enhance",
      "Restore"
    ]
  },
  {
    "name": "Reloading and Recharging",
    "chapter": "Tech & Gear",
    "section": "Operating Tech & Gear",
    "page": 87,
    "effects": []
  },
  {
    "name": "Setting a Trap",
    "chapter": "Tech & Gear",
    "section": "Operating Tech & Gear",
    "page": 87,
    "effects": [
      "Create",
      "Bestow",
      "Advance"
    ]
  },
  {
    "name": "Building, Crafting, or Upgrading Tech",
    "chapter": "Tech & Gear",
    "section": "Technical Modifications",
    "page": 88,
    "effects": []
  },
  {
    "name": "Maintaining and Repairing Tech",
    "chapter": "Tech & Gear",
    "section": "Technical Modifications",
    "page": 89,
    "effects": [
      "Restore"
    ]
  },
  {
    "name": "Tampering with a Device",
    "chapter": "Tech & Gear",
    "section": "Technical Modifications",
    "page": 89,
    "effects": [
      "Disrupt",
      "Weaken"
    ]
  }
]
