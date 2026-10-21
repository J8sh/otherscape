import type { ThemeType } from '@/types'

/**
 * Character tropes for rapid creation (core book pp. 177–189): three theme
 * kits that define the trope, plus three to choose the fourth from, and
 * (where listed) starter loadout tags. Kit names match lib/themeBook.ts.
 */
export interface CharacterTrope {
  name: string
  kits: { kit: string; type: ThemeType }[]
  choose: { kit: string; type: ThemeType }[]
  loadout: string[]
}

export const TROPES: CharacterTrope[] = [
  {
    "name": "Corpo-War Sniper",
    "kits": [
      {
        "kit": "Chipped Weapon Mastery",
        "type": "Augmentation"
      },
      {
        "kit": "Meticulous Planner",
        "type": "Personality"
      },
      {
        "kit": "Trained Killer",
        "type": "Expertise"
      }
    ],
    "choose": [
      {
        "kit": "Corporate Citizenship",
        "type": "Affiliation"
      },
      {
        "kit": "Invisibility Helm",
        "type": "Artifact"
      },
      {
        "kit": "Zeroed Identity",
        "type": "Cyberspace"
      }
    ],
    "loadout": [
      "sniper rifle (requires setup) with AR sight",
      "climbing gear"
    ]
  },
  {
    "name": "Farseeing Spy",
    "kits": [
      {
        "kit": "Covert Agent",
        "type": "Expertise"
      },
      {
        "kit": "Information Broker",
        "type": "Cyberspace"
      },
      {
        "kit": "Scrying Crystals",
        "type": "Artifact"
      }
    ],
    "choose": [
      {
        "kit": "Enhanced Senses",
        "type": "Augmentation"
      },
      {
        "kit": "Safehouse",
        "type": "Assets"
      },
      {
        "kit": "Spy Satellites",
        "type": "Drones"
      }
    ],
    "loadout": []
  },
  {
    "name": "High-Tech Shinobi",
    "kits": [
      {
        "kit": "Animate Shadows",
        "type": "Exposure"
      },
      {
        "kit": "Heist Gear",
        "type": "Assets"
      },
      {
        "kit": "Trained Killer",
        "type": "Expertise"
      }
    ],
    "choose": [
      {
        "kit": "Cloaking Jumpsuit",
        "type": "Cutting Edge"
      },
      {
        "kit": "Criminal Syndicate",
        "type": "Affiliation"
      },
      {
        "kit": "Hero's Sword",
        "type": "Artifact"
      }
    ],
    "loadout": []
  },
  {
    "name": "Harnessing Wiz",
    "kits": [
      {
        "kit": "Boosted Mental Capacity",
        "type": "Augmentation"
      },
      {
        "kit": "Builder of Worlds",
        "type": "Cyberspace"
      },
      {
        "kit": "Code Arsenal",
        "type": "Assets"
      }
    ],
    "choose": [
      {
        "kit": "Corpse Animation",
        "type": "Esoterica"
      },
      {
        "kit": "Hacker Collective",
        "type": "Affiliation"
      },
      {
        "kit": "Meticulous Planner",
        "type": "Personality"
      }
    ],
    "loadout": []
  },
  {
    "name": "Adrenaline-Spiked Drone Pilot",
    "kits": [
      {
        "kit": "Mobile Weapons Platform",
        "type": "Drones"
      },
      {
        "kit": "Reflex Booster Implants",
        "type": "Augmentation"
      },
      {
        "kit": "Thrillseeker",
        "type": "Personality"
      }
    ],
    "choose": [
      {
        "kit": "Cybernetic Hijacker",
        "type": "Cyberspace"
      },
      {
        "kit": "Get Rich & Famous",
        "type": "Horizon"
      },
      {
        "kit": "Possessed Vehicle",
        "type": "Artifact"
      }
    ],
    "loadout": []
  },
  {
    "name": "Chromed-Up \"Ogre\"",
    "kits": [
      {
        "kit": "Armored Juggernaut",
        "type": "Augmentation"
      },
      {
        "kit": "Guns & More Guns",
        "type": "Assets"
      },
      {
        "kit": "Tough as Nails",
        "type": "Personality"
      }
    ],
    "choose": [
      {
        "kit": "Criminal Syndicate",
        "type": "Affiliation"
      },
      {
        "kit": "Exoskeleton Suit",
        "type": "Cutting Edge"
      },
      {
        "kit": "Hero's Sword",
        "type": "Artifact"
      }
    ],
    "loadout": []
  },
  {
    "name": "Data Raider",
    "kits": [
      {
        "kit": "Cryptographic Skeleton Key",
        "type": "Cutting Edge"
      },
      {
        "kit": "Code Arsenal",
        "type": "Assets"
      },
      {
        "kit": "Raised in Cyberspace",
        "type": "Troubled Past"
      }
    ],
    "choose": [
      {
        "kit": "Get Rich & Famous",
        "type": "Horizon"
      },
      {
        "kit": "Information Broker",
        "type": "Cyberspace"
      },
      {
        "kit": "Zeroed Identity",
        "type": "Cyberspace"
      }
    ],
    "loadout": []
  },
  {
    "name": "Hovercycle Gearhead",
    "kits": [
      {
        "kit": "Experimental Vehicle",
        "type": "Cutting Edge"
      },
      {
        "kit": "Tech Gremlin",
        "type": "Companion"
      },
      {
        "kit": "Tinkerer",
        "type": "Expertise"
      }
    ],
    "choose": [
      {
        "kit": "Hidden Gadgets",
        "type": "Augmentation"
      },
      {
        "kit": "RC Racing Star",
        "type": "Drones"
      },
      {
        "kit": "Street Gang",
        "type": "Affiliation"
      }
    ],
    "loadout": []
  },
  {
    "name": "Roboticist Entrepreneur",
    "kits": [
      {
        "kit": "Android Servants",
        "type": "Drones"
      },
      {
        "kit": "Exoskeleton Suit",
        "type": "Cutting Edge"
      },
      {
        "kit": "Push Technology Further",
        "type": "Horizon"
      }
    ],
    "choose": [
      {
        "kit": "Cybernetic Hijacker",
        "type": "Cyberspace"
      },
      {
        "kit": "Money To Burn",
        "type": "Assets"
      },
      {
        "kit": "Speak with Machines",
        "type": "Exposure"
      }
    ],
    "loadout": []
  },
  {
    "name": "Hyper-Destructive Vandal",
    "kits": [
      {
        "kit": "Rebel Without A Cause",
        "type": "Personality"
      },
      {
        "kit": "Street Gang",
        "type": "Affiliation"
      },
      {
        "kit": "Survived the Streets",
        "type": "Troubled Past"
      }
    ],
    "choose": [
      {
        "kit": "Advanced Railgun",
        "type": "Cutting Edge"
      },
      {
        "kit": "Hero's Sword",
        "type": "Artifact"
      },
      {
        "kit": "Trained Monsters",
        "type": "Companion"
      }
    ],
    "loadout": [
      "stolen firearm",
      "local fence (corp police heat)",
      "hotwired car"
    ]
  },
  {
    "name": "Mnemonic Data Courier",
    "kits": [
      {
        "kit": "Boosted Mental Capacity",
        "type": "Augmentation"
      },
      {
        "kit": "Motorcycle",
        "type": "Assets"
      },
      {
        "kit": "Thrillseeker",
        "type": "Personality"
      }
    ],
    "choose": [
      {
        "kit": "Angelic Wings",
        "type": "Exposure"
      },
      {
        "kit": "Criminal Syndicate",
        "type": "Affiliation"
      },
      {
        "kit": "Synthetic Guard Dog",
        "type": "Drones"
      }
    ],
    "loadout": [
      "bulletproof vest (partial coverage)",
      "a wad of cash",
      "tracking jammer"
    ]
  },
  {
    "name": "Bleeding Heart Street Surgeon",
    "kits": [
      {
        "kit": "Caregiver",
        "type": "Personality"
      },
      {
        "kit": "Med Techie",
        "type": "Expertise"
      },
      {
        "kit": "Live Honorably",
        "type": "Horizon"
      }
    ],
    "choose": [
      {
        "kit": "Med Wagon",
        "type": "Drones"
      },
      {
        "kit": "Potion Craft",
        "type": "Esoterica"
      },
      {
        "kit": "Self-Healing",
        "type": "Cutting Edge"
      }
    ],
    "loadout": [
      "high-voltage taser",
      "pop-up personal barricade (heavy)",
      "extra meds"
    ]
  },
  {
    "name": "Grizzled Bodyguard",
    "kits": [
      {
        "kit": "Synthetic Guard Dog",
        "type": "Drones"
      },
      {
        "kit": "Tough As Nails",
        "type": "Personality"
      },
      {
        "kit": "Warrior's Instincts",
        "type": "Exposure"
      }
    ],
    "choose": [
      {
        "kit": "Criminal Syndicate",
        "type": "Affiliation"
      },
      {
        "kit": "Impressive Physique",
        "type": "Expertise"
      },
      {
        "kit": "Law Enforcement",
        "type": "Affiliation"
      }
    ],
    "loadout": []
  },
  {
    "name": "God-Honored Warrior",
    "kits": [
      {
        "kit": "Exact Revenge",
        "type": "Horizon"
      },
      {
        "kit": "Advanced Railgun",
        "type": "Cutting Edge"
      },
      {
        "kit": "Impressive Physique",
        "type": "Expertise"
      }
    ],
    "choose": [
      {
        "kit": "Armored Juggernaut",
        "type": "Augmentation"
      },
      {
        "kit": "Legendary Sidekick",
        "type": "Companion"
      },
      {
        "kit": "War God's Armor",
        "type": "Artifact"
      }
    ],
    "loadout": []
  },
  {
    "name": "Sorcerous Gunslinger",
    "kits": [
      {
        "kit": "Get Rich & Famous",
        "type": "Horizon"
      },
      {
        "kit": "Gunslinger",
        "type": "Expertise"
      },
      {
        "kit": "Weapon Witching",
        "type": "Esoterica"
      }
    ],
    "choose": [
      {
        "kit": "Arcane Construct",
        "type": "Companion"
      },
      {
        "kit": "Guns & More Guns",
        "type": "Assets"
      },
      {
        "kit": "Survived the Streets",
        "type": "Troubled Past"
      }
    ],
    "loadout": []
  },
  {
    "name": "Egyptian Lector Priest",
    "kits": [
      {
        "kit": "Corpse Animation",
        "type": "Esoterica"
      },
      {
        "kit": "Self-Healing",
        "type": "Cutting Edge"
      },
      {
        "kit": "Tragic Loss",
        "type": "Troubled Past"
      }
    ],
    "choose": [
      {
        "kit": "Aura of Authority",
        "type": "Exposure"
      },
      {
        "kit": "Forbidden Cult",
        "type": "Affiliation"
      },
      {
        "kit": "Guardian Spirit",
        "type": "Companion"
      }
    ],
    "loadout": []
  },
  {
    "name": "Spirit-Bending Monk",
    "kits": [
      {
        "kit": "Attain Enlightenment",
        "type": "Horizon"
      },
      {
        "kit": "Caregiver",
        "type": "Personality"
      },
      {
        "kit": "Spirit Summoning",
        "type": "Esoterica"
      }
    ],
    "choose": [
      {
        "kit": "Angelic Wings",
        "type": "Exposure"
      },
      {
        "kit": "Elemental Body",
        "type": "Exposure"
      },
      {
        "kit": "Neighborhood Hero",
        "type": "Affiliation"
      }
    ],
    "loadout": []
  },
  {
    "name": "Hermetic Sigil Scribe",
    "kits": [
      {
        "kit": "Victim of Otherworldly Forces",
        "type": "Troubled Past"
      },
      {
        "kit": "Warding Signs",
        "type": "Esoterica"
      },
      {
        "kit": "Wizard's Staff",
        "type": "Artifact"
      }
    ],
    "choose": [
      {
        "kit": "Explore The Hidden Places",
        "type": "Horizon"
      },
      {
        "kit": "Magical Guide",
        "type": "Companion"
      },
      {
        "kit": "Safehouse",
        "type": "Assets"
      }
    ],
    "loadout": []
  },
  {
    "name": "Face-Changing Escort",
    "kits": [
      {
        "kit": "Guardian Spirit",
        "type": "Companion"
      },
      {
        "kit": "Performer",
        "type": "Personality"
      },
      {
        "kit": "Survived the Streets",
        "type": "Troubled Past"
      }
    ],
    "choose": [
      {
        "kit": "Covert Agent",
        "type": "Expertise"
      },
      {
        "kit": "Hidden Gadgets",
        "type": "Augmentation"
      },
      {
        "kit": "Mask of the Trickster God",
        "type": "Artifact"
      }
    ],
    "loadout": []
  },
  {
    "name": "Journalist Hacker",
    "kits": [
      {
        "kit": "Eliminate Corruption",
        "type": "Horizon"
      },
      {
        "kit": "Intrusion Specialist",
        "type": "Cyberspace"
      },
      {
        "kit": "Spy Satellites",
        "type": "Drones"
      }
    ],
    "choose": [
      {
        "kit": "Investigator",
        "type": "Expertise"
      },
      {
        "kit": "Keeper of Secrets",
        "type": "Personality"
      },
      {
        "kit": "Target of the Government",
        "type": "Troubled Past"
      }
    ],
    "loadout": []
  },
  {
    "name": "Broken Detective",
    "kits": [
      {
        "kit": "Investigator",
        "type": "Expertise"
      },
      {
        "kit": "Law Enforcement",
        "type": "Affiliation"
      },
      {
        "kit": "Tragic Loss",
        "type": "Troubled Past"
      }
    ],
    "choose": [
      {
        "kit": "Enhanced Senses",
        "type": "Augmentation"
      },
      {
        "kit": "Risk-Taker's Luck Charm",
        "type": "Artifact"
      },
      {
        "kit": "Supernatural Pet",
        "type": "Companion"
      }
    ],
    "loadout": []
  },
  {
    "name": "Clever Money-Tracer",
    "kits": [
      {
        "kit": "Information Broker",
        "type": "Cyberspace"
      },
      {
        "kit": "Midas Touch",
        "type": "Exposure"
      },
      {
        "kit": "Money to Burn",
        "type": "Assets"
      }
    ],
    "choose": [
      {
        "kit": "Fortune Telling",
        "type": "Esoterica"
      },
      {
        "kit": "Investigator",
        "type": "Expertise"
      },
      {
        "kit": "Meticulous Planner",
        "type": "Personality"
      }
    ],
    "loadout": []
  },
  {
    "name": "Ice-Cold Handler",
    "kits": [
      {
        "kit": "Aura of Authority",
        "type": "Exposure"
      },
      {
        "kit": "Get Rich & Famous",
        "type": "Horizon"
      },
      {
        "kit": "Meticulous Planner",
        "type": "Personality"
      }
    ],
    "choose": [
      {
        "kit": "Boosted Mental Capacity",
        "type": "Augmentation"
      },
      {
        "kit": "Criminal Syndicate",
        "type": "Affiliation"
      },
      {
        "kit": "Spy Satellites",
        "type": "Drones"
      }
    ],
    "loadout": []
  },
  {
    "name": "Silver-Tongued Executive",
    "kits": [
      {
        "kit": "Corporate Citizenship",
        "type": "Affiliation"
      },
      {
        "kit": "Devil's Bargains",
        "type": "Esoterica"
      },
      {
        "kit": "Ruthless Executive",
        "type": "Expertise"
      }
    ],
    "choose": [
      {
        "kit": "Android Servants",
        "type": "Drones"
      },
      {
        "kit": "Impossibly Good Looks",
        "type": "Augmentation"
      },
      {
        "kit": "Money to Burn",
        "type": "Assets"
      }
    ],
    "loadout": []
  },
  {
    "name": "Oldtech Reviver",
    "kits": [
      {
        "kit": "Junk Collection",
        "type": "Assets"
      },
      {
        "kit": "Speak with Machines",
        "type": "Exposure"
      },
      {
        "kit": "Tinkerer",
        "type": "Expertise"
      }
    ],
    "choose": [
      {
        "kit": "Cloud of Nanites",
        "type": "Cutting Edge"
      },
      {
        "kit": "Counterculture",
        "type": "Affiliation"
      },
      {
        "kit": "Cyberspace Ruins Explorer",
        "type": "Cyberspace"
      }
    ],
    "loadout": []
  },
  {
    "name": "Exurban Nomadic Scout",
    "kits": [
      {
        "kit": "Disaster Survivor",
        "type": "Troubled Past"
      },
      {
        "kit": "Swarm of Probes",
        "type": "Drones"
      },
      {
        "kit": "Tough as Nails",
        "type": "Personality"
      }
    ],
    "choose": [
      {
        "kit": "Enhanced Senses",
        "type": "Augmentation"
      },
      {
        "kit": "Gunslinger",
        "type": "Expertise"
      },
      {
        "kit": "Possessed Vehicle",
        "type": "Artifact"
      }
    ],
    "loadout": []
  },
  {
    "name": "Noise-Terrorist Shaman",
    "kits": [
      {
        "kit": "Break the System",
        "type": "Horizon"
      },
      {
        "kit": "Floral Overgrowth",
        "type": "Exposure"
      },
      {
        "kit": "Nature Spirit",
        "type": "Companion"
      }
    ],
    "choose": [
      {
        "kit": "Potion Craft",
        "type": "Esoterica"
      },
      {
        "kit": "Animalistic Modifications",
        "type": "Augmentation"
      },
      {
        "kit": "Escaped Servitude",
        "type": "Troubled Past"
      }
    ],
    "loadout": []
  },
  {
    "name": "Radical Political Operative",
    "kits": [
      {
        "kit": "Boosted Mental Capacity",
        "type": "Augmentation"
      },
      {
        "kit": "Break The System",
        "type": "Horizon"
      },
      {
        "kit": "Influencer",
        "type": "Cyberspace"
      }
    ],
    "choose": [
      {
        "kit": "Aura of Authority",
        "type": "Exposure"
      },
      {
        "kit": "Counterculture",
        "type": "Affiliation"
      },
      {
        "kit": "Explosives",
        "type": "Assets"
      }
    ],
    "loadout": [
      "AR spray paint",
      "face-hiding garment (limited field of vision)",
      "booster boots"
    ]
  },
  {
    "name": "Techno-Rapture Minister",
    "kits": [
      {
        "kit": "Cybernetic Hijacker",
        "type": "Cyberspace"
      },
      {
        "kit": "Performer",
        "type": "Personality"
      },
      {
        "kit": "Speak With Machines",
        "type": "Exposure"
      }
    ],
    "choose": [
      {
        "kit": "Android Servants",
        "type": "Drones"
      },
      {
        "kit": "Attain Enlightenment",
        "type": "Horizon"
      },
      {
        "kit": "Forbidden Cult",
        "type": "Affiliation"
      }
    ],
    "loadout": []
  },
  {
    "name": "Mercurial Fashion Icon",
    "kits": [
      {
        "kit": "Impossibly Good Looks",
        "type": "Augmentation"
      },
      {
        "kit": "Trendsetter",
        "type": "Personality"
      },
      {
        "kit": "Mask of the Trickster God",
        "type": "Artifact"
      }
    ],
    "choose": [
      {
        "kit": "Evil Eye",
        "type": "Esoterica"
      },
      {
        "kit": "Influencer",
        "type": "Cyberspace"
      },
      {
        "kit": "Money to Burn",
        "type": "Assets"
      }
    ],
    "loadout": []
  },
  {
    "name": "Lab-Grown Supersoldier",
    "kits": [
      {
        "kit": "Guns & More Guns",
        "type": "Assets"
      },
      {
        "kit": "Science Experiment",
        "type": "Troubled Past"
      },
      {
        "kit": "Self-Healing",
        "type": "Cutting Edge"
      }
    ],
    "choose": [
      {
        "kit": "Animalistic Modifications",
        "type": "Augmentation"
      },
      {
        "kit": "Exact Revenge",
        "type": "Horizon"
      },
      {
        "kit": "Impressive Physique",
        "type": "Expertise"
      }
    ],
    "loadout": []
  },
  {
    "name": "Uploaded Scientist",
    "kits": [
      {
        "kit": "Boosted Mental Capacity",
        "type": "Augmentation"
      },
      {
        "kit": "Post-Human Intelligence",
        "type": "Cyberspace"
      },
      {
        "kit": "Push Technology Further",
        "type": "Horizon"
      }
    ],
    "choose": [
      {
        "kit": "Force Fields",
        "type": "Cutting Edge"
      },
      {
        "kit": "Hacker Collective",
        "type": "Affiliation"
      },
      {
        "kit": "Speak With Machines",
        "type": "Exposure"
      }
    ],
    "loadout": []
  },
  {
    "name": "Renegade Android",
    "kits": [
      {
        "kit": "Armored Juggernaut",
        "type": "Augmentation"
      },
      {
        "kit": "Code Arsenal",
        "type": "Assets"
      },
      {
        "kit": "Escaped Servitude",
        "type": "Troubled Past"
      }
    ],
    "choose": [
      {
        "kit": "Break the System",
        "type": "Horizon"
      },
      {
        "kit": "Covert Agent",
        "type": "Expertise"
      },
      {
        "kit": "Giant Construction Robot",
        "type": "Drones"
      }
    ],
    "loadout": []
  }
]
