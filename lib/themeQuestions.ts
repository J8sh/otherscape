import type { ThemeType } from '@/types'

/**
 * Prompts for building a theme from scratch (custom character creation,
 * core book pp. 190–195 and each themebook's first page, pp. 196–251).
 * Paraphrased in our own words. The first power question is the one every
 * theme answers — it becomes the title tag; answer two more, plus one
 * weakness question.
 */
export interface ThemeQuestions {
  power: string[]
  weakness: string[]
}

export const THEME_QUESTIONS: Record<ThemeType, ThemeQuestions> = {
  // ── Self ──
  Affiliation: {
    power: [
      'Which group are you part of?',
      'What’s the biggest perk of belonging?',
      'What skill did they teach you?',
      'What is the group famous for?',
      'What do you do for them, or with them?',
      'What gear or assets did they give you?',
      'How do you and they protect each other?',
      'What quality of yours got you in?',
      'How do you get away from them when you need to?',
      'How has belonging changed you most?',
    ],
    weakness: [
      'How does the group run your life?',
      'Who targets you because you belong?',
      'What bad habit did you pick up from them?',
      'How can strangers tell you’re one of them?',
    ],
  },
  Assets: {
    power: [
      'What material asset, or kind of asset, do you own?',
      'Name another asset or a standout piece of the collection.',
      'Which piece completes the set?',
      'How are your assets modded or improved?',
      'What skills did you build around them?',
      'What impressive feat can you pull off with them?',
      'How do you maintain, fix or get them back?',
      'How do you keep them safe?',
      'When are they most useful?',
      'Which item or feature shows off your style best?',
    ],
    weakness: [
      'What flaw do your assets have?',
      'How do you overuse or misuse them?',
      'What worries you about them?',
      'What weren’t they built to do?',
    ],
  },
  Expertise: {
    power: [
      'What is your field of expertise?',
      'What specialized skill did you develop within it?',
      'What’s the most useful tool of your trade?',
      'What can you do with it that others can’t?',
      'How do you handle trouble or danger on the job?',
      'What contacts do you still have in the field?',
      'What credentials do you hold?',
      'What attitude or tactic did the work teach you?',
      'How do you prepare before you get to work?',
      'What’s the cutting-edge side of your expertise?',
    ],
    weakness: [
      'How does your expertise skew how you see or treat people?',
      'Who or what regulates or limits your work?',
      'What’s the blind spot in your technique?',
      'When does your expertise fail or backfire?',
    ],
  },
  Horizon: {
    power: [
      'What goal drives you?',
      'What’s the most useful skill you built chasing it?',
      'What’s your main weapon or tool on this path?',
      'What’s your go-to tactic for getting there?',
      'How do you fend off those who would stop you?',
      'Where or how do you hide from your enemies?',
      'How have you trained or changed your body for it?',
      'What personal quality keeps you going?',
      'Who can you call on for help?',
      'What has the pursuit taught you?',
    ],
    weakness: [
      'How does the pursuit weigh on you or put you at risk?',
      'Who or what stands in your way?',
      'How has the goal changed you for the worse?',
      'What part of life do you neglect because of it?',
    ],
  },
  Personality: {
    power: [
      'What’s the core of who you are?',
      'What part of your persona helps you succeed or endure?',
      'How does it help you with people?',
      'What do you notice that others usually miss?',
      'What edge does it give you on a job or on the street?',
      'What item best expresses your style?',
      'What do people find attractive or impressive about you?',
      'What’s odd or surprising about you?',
      'What do you carry to feel safe?',
      'How do you change when things get tough?',
    ],
    weakness: [
      'Who rubs you the wrong way — or finds you unbearable?',
      'How does your personality get you in trouble?',
      'What situations throw you off?',
      'What do you avoid at all costs?',
    ],
  },
  'Troubled Past': {
    power: [
      'What in your past haunts or defines you?',
      'How did it make you stronger?',
      'What did you learn in order to adapt?',
      'How did it make you dangerous?',
      'What physical change came out of it?',
      'Who did you turn to for safety or comfort?',
      'What useful keepsake do you still have?',
      'What mental toughness or coping trick did you develop?',
      'What unusual knowledge did it give you?',
      'How do you fight anyone who would drag you back?',
    ],
    weakness: [
      'Who or what from your past still haunts you?',
      'What physical effects linger?',
      'What self-destructive habit did you develop?',
      'What sets off your worst memories?',
    ],
  },
  // ── Mythos ──
  Artifact: {
    power: [
      'What artifact of power do you carry?',
      'What mythic or magical property does it show?',
      'How does it protect you or others?',
      'What new sense or mental gift do you get while it’s active?',
      'How can it be turned against your foes?',
      'How does it help you travel or escape?',
      'What does it do on its own, without your guidance?',
      'What surprising power can it unleash?',
      'What can it turn into — or turn you into?',
      'What about you draws or binds it to you?',
    ],
    weakness: [
      'Who or what is it useless against?',
      'What drains, blocks or counters it?',
      'What makes it misbehave or refuse to cooperate?',
      'How do its powers cause you trouble?',
    ],
  },
  Companion: {
    power: [
      'What kind of companion helps you?',
      'What’s the main power or help it gives you?',
      'What is it good at doing for you?',
      'What form does it take to fight or hide?',
      'How does it defend itself, or you?',
      'How could it help you in a fight or at work?',
      'How does it heal, reform or recharge?',
      'What useful magical side effect does it create?',
      'How does it make you a better or stronger person?',
      'What’s the best thing about having it around?',
    ],
    weakness: [
      'When can’t it, or won’t it, help you?',
      'How does it make people react badly to you?',
      'What weakens its powers?',
      'How does it sometimes get in your way?',
    ],
  },
  Esoterica: {
    power: [
      'What esoteric secrets have you learned?',
      'What’s your most important spell or power?',
      'What skill or training underlies your art?',
      'What unusual ability is unique to your practice?',
      'What power lets you influence others?',
      'Which power or spell could you use to hurt someone?',
      'How could your powers defend you or others?',
      'How could they help you travel or escape?',
      'What can you learn or reveal through your art?',
      'What in your past or personality drives you to study it?',
    ],
    weakness: [
      'What requirements or limits does your art have?',
      'What could stop you from using your powers?',
      'How have your powers made you hard to deal with?',
      'What unwanted side effects does your magic have?',
    ],
  },
  Exposure: {
    power: [
      'What powers did your exposure give you?',
      'How did it change your body or let you transform?',
      'When are your powers stronger?',
      'What’s your most iconic or stylish power?',
      'What can you project, unleash, grow or emit?',
      'How did it make you harder to kill?',
      'How were your senses, instincts or body changed?',
      'How could your powers be used creatively?',
      'How do your powers help in everyday life?',
      'How does your personality shift when they’re active?',
    ],
    weakness: [
      'What unwanted effects did the exposure leave?',
      'What could block or cut you off from your Source?',
      'What weakness or limit came with your Source?',
      'Who are your natural predators or enemies in this form?',
    ],
  },
  // ── Noise ──
  Augmentation: {
    power: [
      'What does your augmentation give you, or make you?',
      'What’s its best-known or most useful function?',
      'What’s another feature of the tech?',
      'How does it make you a better fighter?',
      'How does it help on a job?',
      'How does it help you avoid danger or get away?',
      'How has it changed your mind for the better?',
      'What do you need to fix or maintain it?',
      'What lifestyle or routine does it let you keep?',
      'What social advantage does it give you?',
    ],
    weakness: [
      'How does it limit or harm your normal functions?',
      'What unwanted feedback does it give you?',
      'What’s glitchy or unreliable about it?',
      'What backlash do people give you for having it?',
    ],
  },
  'Cutting Edge': {
    power: [
      'What cutting-edge tech have you got?',
      'What is it famous — or infamous — for?',
      'How could it be used in an unexpected way?',
      'What makes it dangerous enough to be a weapon or threat?',
      'How could it get you out of a bad spot?',
      'What trick or maneuver can you pull with it?',
      'What information does it feed you?',
      'What knowledge or talent lets you control it?',
      'What circumstance or relationship got it into your hands?',
      'What gear or outfit do you wear to use it?',
    ],
    weakness: [
      'What’s its main limitation?',
      'What dangers come built in?',
      'What does overusing it do to your body or mind?',
      'What can’t it be used against?',
    ],
  },
  Cyberspace: {
    power: [
      'Who are you in cyberspace?',
      'What enviable cyberspace ability or asset do you have?',
      'What’s your core technical skill set?',
      'What special software or hardware do you run?',
      'How do you influence or hurt others online?',
      'How do you keep from being hacked or knocked offline?',
      'How do you manipulate information or raw data?',
      'What spectacular thing can you do in cyberspace?',
      'What illegal or covert online activity are you best at?',
      'How does your digital presence come across?',
    ],
    weakness: [
      'What real-world problems get in the way of your online life?',
      'How do your programs or devices misbehave?',
      'What digital weak spot could your enemies exploit?',
      'Who is after you because of what you do online?',
    ],
  },
  Drones: {
    power: [
      'What kind of drone tech do you use?',
      'What one task do your drones do best?',
      'What skill did you pick up to run them?',
      'How do you use them against others?',
      'What special sensors or programming do they have?',
      'What makes them tough or reliable?',
      'How can they carry you or things around?',
      'How can they be hidden or disguised?',
      'What can they transform into?',
      'Why do you rely on drones like these?',
    ],
    weakness: [
      'How do you obsess over your drones?',
      'When are they unwieldy or unruly?',
      'How does piloting them dull your own senses?',
      'What upkeep do they constantly need?',
    ],
  },
}
