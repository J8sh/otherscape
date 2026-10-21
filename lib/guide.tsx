import Link from 'next/link'

/**
 * Player-facing rules guide. Written in our own words as a quick reference;
 * page numbers point to the Metro :Otherscape core book for the full rules.
 */

export function Tip({ children, title = 'TIP' }: { children: React.ReactNode; title?: string }) {
  return (
    <aside className="guide-callout" style={{ borderColor: 'var(--accent-lime)' }}>
      <div className="font-display tracking-widest text-sm" style={{ color: 'var(--accent-lime)' }}>{title}</div>
      <div>{children}</div>
    </aside>
  )
}

export function Example({ children }: { children: React.ReactNode }) {
  return (
    <aside className="guide-callout" style={{ borderColor: 'var(--accent-cyan)' }}>
      <div className="font-display tracking-widest text-sm" style={{ color: 'var(--accent-cyan)' }}>EXAMPLE</div>
      <div>{children}</div>
    </aside>
  )
}

export function OnTheSite({ children }: { children: React.ReactNode }) {
  return (
    <aside className="guide-callout" style={{ borderColor: 'var(--mythos)' }}>
      <div className="font-display tracking-widest text-sm" style={{ color: 'var(--mythos)' }}>ON THIS SITE</div>
      <div>{children}</div>
    </aside>
  )
}

export interface GuideTopic {
  slug: string
  title: string
  summary: string
  pages?: string
  group: 'basics' | 'play' | 'growth' | 'site'
  body: React.ReactNode
}

export const GUIDE_GROUPS: { key: GuideTopic['group']; title: string }[] = [
  { key: 'basics', title: 'Start here' },
  { key: 'play', title: 'At the table' },
  { key: 'growth', title: 'Growth & change' },
  { key: 'site', title: 'Using this site' },
]

export const GUIDE: GuideTopic[] = [
  {
    slug: 'how-to-play',
    title: 'How a Session Flows',
    summary: 'Scenes, the spotlight, and the three-beat loop: the MC sets the scene, a player acts, consequences land.',
    pages: 'pp. 76–83',
    group: 'basics',
    body: (
      <>
        <p>
          :Otherscape is played scene by scene. The <b>MC</b> (Master of Ceremonies) describes the world and its dangers; each
          player controls one character (a PC). Together the PCs form a <b>crew</b>.
        </p>
        <h2>The loop</h2>
        <ol>
          <li><b>Establish.</b> The MC describes where you are, what’s at stake, the <b>Challenges</b> in the way (people, hazards, mysteries) and any <b>Threats</b> — things about to happen to you. Then she hands someone the spotlight: “What do you do?”</li>
          <li><b>Player action.</b> You describe what your character does. If it’s both dramatic and uncertain, you roll. If the details matter, you also choose Effects.</li>
          <li><b>Consequences.</b> If you missed, got a mixed hit, or ignored a Threat, the MC delivers Consequences — story twists, or statuses and tags that hurt you. Sometimes you can roll to mitigate them.</li>
        </ol>
        <p>Repeat until the scene is resolved, then cut to the next one.</p>
        <h2>The spotlight</h2>
        <p>
          The MC decides who acts next. A good rule of thumb: nobody gets a second turn before everyone has had one. Challenges
          don’t take turns — they act through Threats and Consequences, and the MC never rolls dice.
        </p>
        <Tip>
          Perceiving what’s plainly visible, moving around, and talking are usually just narration — no roll needed — until something
          is actually at stake.
        </Tip>
      </>
    ),
  },
  {
    slug: 'making-a-character',
    title: 'Making a Character',
    summary: 'Two ways in: build fast from a character trope, or write every theme yourself from the themebook questions.',
    pages: 'pp. 174–195',
    group: 'basics',
    body: (
      <>
        <p>
          A character is <b>four themes</b>, a <b>loadout</b>, and a few relationships. Each theme mixes power tags (what you’re good at),
          a weakness, and a motivation. Pick a path below — both end in the same kind of sheet.
        </p>
        <h2>Quick build: from a trope</h2>
        <p>Best for your first game, or when you just want to play.</p>
        <ol>
          <li><b>Pick a character trope.</b> A trope is a ready-made character idea that bundles three theme kits.</li>
          <li><b>Pick your fourth kit</b> from the trope’s three options — or any kit whose theme type you don’t already have.</li>
          <li><b>Turn each kit into a theme:</b> take the kit’s first (title) tag, choose two more power tags and one weakness, and copy the kit’s Identity, Ritual or Itch as the motivation.</li>
          <li><b>Flesh it out:</b> a name, a look, a few details. Keep it light — more appears during play.</li>
        </ol>
        <OnTheSite>
          On a new sheet, open <b>START FROM A TROPE</b> in the setup checklist. It builds all four themes from the kits with starter tags (and the trope’s suggested loadout) — then swap in the tags you prefer from each theme card’s kit list.
        </OnTheSite>
        <h2>Custom build: answer the questions</h2>
        <p>More involved, fully yours.</p>
        <ol>
          <li><b>Concept.</b> Think about what your character does with their time, where they come from, how they use tech, whether a Source (a mythic power) touched them, and who keeps them grounded.</li>
          <li><b>Choose four theme types</b> to match the four strongest parts of that concept — any mix of Self, Mythos and Noise. Avoid doubling up a type unless the clash is the point.</li>
          <li><b>Answer the themebook questions.</b> For each theme, answer the first power question plus two more, and one weakness question. The answers become your tags; the motivation question gives your Identity, Ritual or Itch.</li>
          <li><b>Choose a loadout:</b> three power tags (gear) and one weakness for your loadout theme.</li>
        </ol>
        <Tip>
          A good power tag names something <b>useful</b> — ask “what actions would this help?” If the answer is “none” or “it only hurts me”,
          it isn’t a power tag. Agree with the MC on what each tag covers before play — the note button (pen) beside any theme tag
          records what you agreed, and the dice roller shows it.
        </Tip>
        <OnTheSite>
          Pick any kit for the theme type, then rewrite its tags. Each theme card has a <b>WRITE YOUR OWN TAGS</b> panel listing that
          themebook’s questions, with a + button to add a tag for each answer.
        </OnTheSite>
        <h2>Either way, finish with</h2>
        <ul>
          <li><b>Something extra (optional):</b> on one theme you may add one more power tag — but then add one more weakness there too.</li>
          <li><b>Essence:</b> your balance of Self, Mythos and Noise themes decides your Essence and its Special.</li>
          <li><b>Relationships:</b> one relationship tag toward each crewmate — how you feel about them, or what they are to you. Check it with their player.</li>
          <li><b>Crew theme:</b> together, build the crew’s shared theme (three power tags and a weakness).</li>
        </ul>
        <OnTheSite>
          The <b>setup checklist</b> at the top of a new sheet tracks every step, Essence is worked out for you from your themes, and the crew card
          lives on the campaign page. See <Link href="/guide/themebooks">Themebooks &amp; Kits</Link> for every theme type’s questions and kits.
        </OnTheSite>
      </>
    ),
  },
  {
    slug: 'session-zero',
    title: 'Session Zero: Setting Up a Series',
    summary: 'Before the first job: agree on the concept, the Megacity, the characters and the crew — then play one ordinary night.',
    pages: 'pp. 145–159',
    group: 'basics',
    body: (
      <>
        <p>
          A <b>series</b> is your ongoing campaign. Its first session is a group conversation more than a game: you decide together what
          the story is about, then build the world and the crew. Going fast with ready-made options takes about 15 minutes; building
          everything yourselves can fill a whole session.
        </p>
        <h2>1. The series concept</h2>
        <p>Three questions shape everything else:</p>
        <ul>
          <li><b>What is the game about?</b> A moral question, a technology (say, cloning), or a set of myths you want at the center.</li>
          <li><b>Who is the crew?</b> What kind of people, what keeps them together, what jobs they take, and who they’re up against.</li>
          <li><b>What is the Megacity like?</b> Settled in the next step.</li>
        </ul>
        <p>Possible focuses include runaway tech and broken morals, corporate intrigue, exploring ruins, deep cyberspace, or gangs, cults and subcultures.</p>
        <h2>Lines &amp; veils</h2>
        <p>
          While you talk concept, agree on boundaries. A <b>line</b> is content that won’t appear at all. A <b>veil</b> is content that can
          happen, but off-screen — you cut away. Revisit them whenever someone needs to.
        </p>
        <h2>2. The Megacity</h2>
        <p>Use a ready-made city, one the MC prepared, or build one together. It isn’t just scenery — it pushes back and remembers.</p>
        <h2>3. The characters</h2>
        <p>Each player makes a character — quick from a trope or custom from the themebook questions. See <Link href="/guide/making-a-character">Making a Character</Link>.</p>
        <h2>4. The crew theme</h2>
        <p>Where do your jobs come from? Who are your contacts, what agency (if any) backs you, and what support do you get? Turn the answers into the crew’s tags.</p>
        <h2>5. A night in the Megacity</h2>
        <p>
          A low-stakes warm-up. The MC picks an ordinary night and asks where everyone is and what they’re doing. Play a few short,
          casual scenes — friends, rivals, daily hassles — to learn the characters and the neighborhood and to try a few rolls. Nothing
          has to go perfectly; it’s a rehearsal.
        </p>
        <OnTheSite>
          The MC creates the campaign and shares its <b>invite link</b>. The concept, city and boundaries go in <b>Series notes</b> on the
          campaign page, where everyone can read them. The crew card there has <b>crew kits</b> for a ready-made crew theme.
        </OnTheSite>
      </>
    ),
  },
  {
    slug: 'tags',
    title: 'Tags',
    summary: 'Short descriptors instead of stats. Every relevant tag is worth ±1 Power.',
    pages: 'pp. 72–75, 89',
    group: 'basics',
    body: (
      <>
        <p>
          Your character isn’t numbers — it’s <b>tags</b>: short phrases like <i>street samurai</i>, <i>mono-edge knife</i> or <i>trust issues</i>.
          If something matters in the story, it gets a tag.
        </p>
        <h2>Kinds of tags</h2>
        <ul>
          <li><b>Power tags</b> — permanent strengths on your themes. Each relevant one gives an action <b>+1 Power</b>.</li>
          <li><b>Weakness tags</b> — permanent flaws. Each relevant one is <b>−1 Power</b>, but it marks an upgrade box on its theme, so weaknesses help you grow.</li>
          <li><b>Loadout tags</b> — gear and access you have to pack before a job. See <Link href="/guide/loadout">Loadout</Link>.</li>
          <li><b>Story tags</b> — temporary things in the scene: <i>heavy rain</i>, <i>stolen keycard</i>, <i>summoned spirit</i>. They help or hurt case by case.</li>
          <li><b>Statuses</b> — conditions with a tier from 1 to 6, like <i>wounded-3</i>. See <Link href="/guide/statuses">Statuses</Link>.</li>
        </ul>
        <h2>Only relevant tags count</h2>
        <p>
          A tag adds Power only if it’s <b>directly</b> relevant: <i>marksman</i> helps you shoot; <i>charming</i> doesn’t. If a tag is only
          indirectly useful (<i>smart</i> while shooting), take a separate action first to turn it into a directly useful tag —
          like spotting an <i>exposed weak point</i>. The MC has the final say, so keep the game moving and argue later.
        </p>
        <h2>Burning tags</h2>
        <p>
          A <b>burned</b> power tag can’t be used until it’s recovered (by a Restore action, in downtime, or when the story says so).
          A burned story tag is simply gone. You can choose to burn one positive tag in an action for <b>+3 Power</b> instead of +1.
        </p>
        <Tip>Three specific tags beat one vague one: a <i>sniper rifle</i> with a <i>thermal scope</i> and <i>armor-piercing rounds</i> is +3 when all three apply.</Tip>
        <OnTheSite>Tap the <b>flame</b> on any tag slot to burn it; tap again to recover it. The ★ marks a theme’s title tag.</OnTheSite>
      </>
    ),
  },
  {
    slug: 'themes',
    title: 'Themes, Motivation & the Crew',
    summary: 'Four themes make a character: Self, Mythos and Noise — each with a motivation, upgrades and decay.',
    pages: 'pp. 70–75, 175–177',
    group: 'basics',
    body: (
      <>
        <p>Every character has <b>four themes</b> — their major aspects — plus a loadout theme for gear and a character card.</p>
        <h2>Three categories</h2>
        <ul>
          <li><b style={{ color: 'var(--self)' }}>Self</b> — who you are: Affiliation, Assets, Expertise, Horizon, Personality, Troubled Past. Motivation: an <b>Identity</b> you uphold.</li>
          <li><b style={{ color: 'var(--mythos)' }}>Mythos</b> — powers from a mythic Source: Artifact, Companion, Esoterica, Exposure. Motivation: a <b>Ritual</b> you must perform.</li>
          <li><b style={{ color: 'var(--noise)' }}>Noise</b> — superhuman tech: Augmentation, Cutting Edge, Cyberspace, Drones. Motivation: an <b>Itch</b> you have to scratch.</li>
        </ul>
        <h2>What’s on a theme card</h2>
        <ul>
          <li>A <b>title tag</b> — the first power tag, which names the theme and defines everything else on it.</li>
          <li>Two more <b>power tags</b> and one <b>weakness tag</b> to start (more come with upgrades).</li>
          <li>The <b>motivation</b> line.</li>
          <li>An <b>Upgrade</b> track and a <b>Decay</b> track, three boxes each — see <Link href="/guide/evolution">Growth & Evolution</Link>.</li>
          <li>On the back: <b>Theme Specials</b> you unlock with upgrades.</li>
        </ul>
        <h2>The crew theme</h2>
        <p>
          The crew shares one theme card. Anyone can invoke its tags, but a crew power tag <b>burns</b> as soon as it’s used (and
          can’t be burned for the +3 bonus). The crew’s motivation binds everyone: if anyone acts against it, mark crew Decay.
          At the end of each session, recover one crew power tag per crew member.
        </p>
        <h2>Crew relationships</h2>
        <p>
          On your character card you hold one relationship tag for each other PC. Invoke it like any tag — it burns when used.
          The MC can invoke it against you; when that happens, mark an upgrade on the crew theme. Burned relationship tags come
          back at the end of the session, and you can rewrite them if the relationship changed.
        </p>
        <OnTheSite>Add a theme from the Theme Book (112 ready-made kits). Use ✎ on a theme to add more of its kit’s tags later.</OnTheSite>
      </>
    ),
  },
  {
    slug: 'themebooks',
    title: 'Themebooks & Kits',
    summary: 'Browse all 14 theme types, their 112 ready-made kits and their Theme Specials.',
    pages: 'pp. 196–251',
    group: 'basics',
    body: null, // rendered by /guide/themebooks
  },
  {
    slug: 'actions',
    title: 'Taking Action & Rolling',
    summary: 'Count Power, roll 2d6 + Power: 10+ strong hit, 7–9 mixed hit, 6 or less a miss.',
    pages: 'pp. 84–95',
    group: 'play',
    body: (
      <>
        <h2>1 · Narrate</h2>
        <p>Say what your character does. If it’s routine or the outcome is certain, the MC just tells you what happens.</p>
        <h2>2 · Count Power and roll</h2>
        <p>When the action is dramatic <i>and</i> uncertain, count its <b>Power</b>:</p>
        <ul>
          <li><b>+1</b> for every directly helpful tag — yours, your target’s, or the environment’s.</li>
          <li><b>−1</b> for every directly hindering tag.</li>
          <li><b>+ the tier</b> of the single best helpful status, <b>− the tier</b> of the single worst hindering status.</li>
          <li>Burn one positive tag for <b>+3</b> instead of +1, if you’re willing to lose it for a while.</li>
        </ul>
        <p>Roll two six-sided dice and add Power:</p>
        <ul>
          <li><b style={{ color: 'var(--accent-lime)' }}>10+ strong hit</b> — it works. No Consequences. You may take Consequences anyway for an even better result.</li>
          <li><b style={{ color: '#ffd166' }}>7–9 mixed hit</b> — it works, but with Consequences.</li>
          <li><b style={{ color: 'var(--danger)' }}>6 or less, a miss</b> — it fails or backfires, and Consequences follow.</li>
        </ul>
        <p>Double 1s always miss. Double 6s always hit strong.</p>
        <h2>3 · Choose Effects (tracked outcomes)</h2>
        <p>
          When the MC wants to measure exactly how well you did, spend your Power on <Link href="/guide/effects">Effects</Link>.
          On a hit, you always get at least 1 Power to spend, even if your Power was 0 or less.
        </p>
        <Example>
          You fire at a guard with <i>marksman</i>, <i>assault rifle</i> and <i>targeting app</i> (+3). The guard is <i>behind-cover-2</i> (−2).
          Power 1. You roll 5 + 4 + 1 = 10: a strong hit. Spend 1 Power on Attack: the guard takes <i>wounded-1</i>.
        </Example>
        <h2>Helping each other</h2>
        <p>
          Either lend one of your tags to a crewmate’s roll (+1 if relevant; it can’t be burned for the bonus), or take your own
          action first to set them up with tags or statuses. Not both.
        </p>
        <OnTheSite>Use the <Link href="/roller">Dice roller</Link> to count Power and roll; from your sheet it can also burn tags and mark upgrades for you.</OnTheSite>
      </>
    ),
  },
  {
    slug: 'effects',
    title: 'Effects',
    summary: 'What you can buy with Power: Attack, Disrupt, Influence, Weaken, Bestow, Create, Enhance, Restore and more.',
    pages: 'pp. 90–95',
    group: 'play',
    body: null, // rendered by /guide/effects
  },
  {
    slug: 'actions-database',
    title: 'Action Ideas',
    summary: 'Searchable index of the Action Database: what to roll for disarming, hacking, chases, persuasion and 100+ more.',
    group: 'play',
    body: null, // rendered by /guide/actions-database
  },
  {
    slug: 'consequences',
    title: 'Consequences & Mitigation',
    summary: 'How the MC hits back — and how you roll to soften the blow.',
    pages: 'pp. 98–102',
    group: 'play',
    body: (
      <>
        <p>
          Consequences arrive when you roll a miss or mixed hit, when your action naturally causes them, or when you leave a
          Threat unanswered. The MC decides them; she never rolls.
        </p>
        <h2>Narrative consequences</h2>
        <p>Story twists you can’t roll against: the situation escalates, a new Challenge arrives, something you wanted slips away, or the future gets bleaker.</p>
        <h2>Consequences with Effects</h2>
        <p>The MC can give you statuses, add story tags against you, remove your helpful statuses or tags, or burn your power tags — and do the reverse for her Challenges.</p>
        <h2>Mitigating</h2>
        <p>
          If you could reasonably defend yourself, the MC lets you roll to <b>mitigate</b>. Count Power from tags that help you
          resist and roll as usual:
        </p>
        <ul>
          <li><b>Miss:</b> take everything.</li>
          <li><b>Hit:</b> spend Power to block it — 1 Power per incoming status tier, 2 Power per tag gained or lost. A strong hit gives +1 extra Power to spend.</li>
        </ul>
        <Tip title="NO DOUBLE DIPPING">A tag or status you used in the action can’t be used again to mitigate that same action’s Consequences.</Tip>
      </>
    ),
  },
  {
    slug: 'statuses',
    title: 'Statuses',
    summary: 'Tiered conditions from 1 (mild) to 6 (lethal). How they stack, shrink, and take you out.',
    pages: 'pp. 103–109',
    group: 'play',
    body: (
      <>
        <p>A status is a temporary condition with a <b>tier</b> from 1 to 6: <i>wounded-3</i>, <i>alert-2</i>, <i>hacked-4</i>.</p>
        <table>
          <thead><tr><th>Tier</th><th>Intensity</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Mild</td></tr><tr><td>2</td><td>Minor</td></tr><tr><td>3</td><td>Major</td></tr>
            <tr><td>4</td><td>Dramatic</td></tr><tr><td>5</td><td>Incapacitating</td></tr><tr><td>6</td><td>Lethal or permanently transformative</td></tr>
          </tbody>
        </table>
        <h2>On a roll</h2>
        <p>Only the extremes count: add your <b>best</b> relevant helpful status, subtract your <b>worst</b> relevant hindering one.</p>
        <h2>Limits</h2>
        <p>
          For PCs, every status has a Limit of <b>5</b>: at tier 5 you’re overcome by it (out cold, under control, can’t act socially…),
          and tier 6 is permanent — death or a deep transformation. Challenges each have their own Limits.
        </p>
        <h2>Stacking</h2>
        <p>
          Taking a status you already have (or a similar one) <b>stacks</b>: mark the new tier’s box. If that box is already marked,
          mark the next empty box above it. The status’s tier is always its highest mark.
        </p>
        <Example><i>wounded-4</i> plus another <i>wounded-4</i> marks tier 5 → <i>wounded-5</i>. A third hit at 4 jumps to <i>wounded-6</i>.</Example>
        <h2>Reducing</h2>
        <p>Removing tiers slides <b>every</b> mark down that many boxes; marks pushed below 1 disappear.</p>
        <Example><i>confident</i> with marks at 2 and 4, reduced by 1 → marks at 1 and 3, so <i>confident-3</i>.</Example>
        <h2>Special kinds</h2>
        <ul>
          <li><b>Compelling</b> statuses (charmed, enraged, hacked) push you toward a directive: they hinder every action against it, and at 5 you can’t even try.</li>
          <li><b>Polar</b> opposites (hostile/friendly) cancel each other out tier for tier.</li>
          <li><b>Progress</b> statuses track a process — a ritual, a chase, a countdown — and trigger something when they reach their Limit.</li>
        </ul>
        <OnTheSite>Status cards have STACK and REDUCE buttons that follow these rules exactly, or tap tier boxes to mark them by hand.</OnTheSite>
      </>
    ),
  },
  {
    slug: 'loadout',
    title: 'Loadout & Gear',
    summary: 'Pack your gear before the job: Loading Up, wildcards, flaws, and Loading Off.',
    pages: 'pp. 114–117, 252–271',
    group: 'play',
    body: (
      <>
        <p>
          Your <b>loadout theme</b> holds gear and access you don’t carry all the time — stashed weapons, a hacker contact, a favor.
          Loadout tags are power tags that start <b>burnt</b> (unpacked). Characters begin with three.
        </p>
        <h2>Loading Up</h2>
        <p>Before a job the MC calls a Loading Up moment. You get <b>1 Loading Up Power</b>, plus:</p>
        <ul>
          <li>+1 for each power tag that helps you pack and carry (<i>toolbelt</i>, <i>tons of RAM</i>…);</li>
          <li>any bonus from loadout upgrades, or Power you spent in downtime.</li>
        </ul>
        <p>Spend it to un-burn tags (<b>1 Power each</b>) or to buy a <b>wildcard</b> (2 Power): an empty slot you fill with any of your loadout tags later in the job — you packed it all along.</p>
        <h2>Flaws</h2>
        <p>Each piece of gear can carry one flaw (a weakness tag). Invoking it is −1 Power and marks an upgrade on the loadout theme.</p>
        <h2>Loading Off</h2>
        <p>When the job ends, every loadout tag is burnt again. Pack them again next time.</p>
        <h2>Getting more gear</h2>
        <p>Loot from a job, buy, craft or hire (Create: 2 Power per tag), or keep a story tag you picked up by writing it into your loadout.</p>
        <OnTheSite>The loadout card counts Power used as you un-burn tags, tracks wildcards, and has a Load Off button.</OnTheSite>
      </>
    ),
  },
  {
    slug: 'scale',
    title: 'Scale',
    summary: 'Fighting a gang, warding a house, summoning a giant: how size and numbers change Power.',
    pages: 'pp. 118–120',
    group: 'play',
    body: (
      <>
        <p>
          <b>Scale</b> measures how big something is, in size or numbers. PCs are always Scale 0; the crew together is Scale 1.
          The difference between two sides is the <b>Scale gap</b>.
        </p>
        <table>
          <thead><tr><th>Scale</th><th>Size or area</th><th>Number</th></tr></thead>
          <tbody>
            <tr><td>0</td><td>A person</td><td>One</td></tr>
            <tr><td>1</td><td>A room</td><td>A few</td></tr>
            <tr><td>2</td><td>A house</td><td>Up to a dozen or so</td></tr>
            <tr><td>3</td><td>A skyscraper</td><td>Several dozen</td></tr>
            <tr><td>4</td><td>A city block</td><td>A host — army, swarm, horde</td></tr>
          </tbody>
        </table>
        <h2>Against bigger Challenges</h2>
        <p>For each step a Challenge is bigger than you, you lose 1 Power acting against it — and its Consequences hit one tier harder.</p>
        <h2>Scaling your own action</h2>
        <p>
          To affect more than one person-sized target — a fireball over a room, buffing the whole crew, summoning a giant — set the
          target Scale before counting Power and subtract the gap. Big allies or tools (a drone swarm, a cruise missile) can close
          or even flip the gap in your favor. Tags shared by most of the targets (everyone <i>diving for cover</i>) count on the roll.
        </p>
        <Example>A lone enforcer (0) attacking a small gang (1) loses 1 Power. Firing a personal cruise missile (2) at that gang gains 1 instead.</Example>
        <OnTheSite>The dice roller has a <b>Scale gap</b> stepper: minus when the target is bigger, plus when you are.</OnTheSite>
      </>
    ),
  },
  {
    slug: 'power-options',
    title: 'Power Options',
    summary: 'Burning for Power, rolling with Self/Mythos/Noise, and Going Out in a Blaze.',
    pages: 'pp. 121–123',
    group: 'play',
    body: (
      <>
        <h2>Burn a tag for Power</h2>
        <p>Once per action, burn one of your positive tags to make it worth <b>+3</b> instead of +1. It stays burned until recovered. Crew tags and helpers’ tags can’t be burned this way.</p>
        <h2>Roll with Self, Mythos or Noise</h2>
        <p>
          For actions about humanity, the mythic, or technology <i>in general</i> — sensing a Source, understanding strange tech,
          resisting a change to who you are — you may use the <b>number of themes</b> you have of that type as your Power instead
          of counting tags. Negative tags and statuses still apply.
        </p>
        <h2>Go Out in a Blaze</h2>
        <p>
          When you need something beyond your character’s abilities, push past every limit. Describe the outcome you want; the
          MC sets a price and you agree which theme is at stake. Roll 2d6 + the number of themes of that theme’s type (nothing else counts).
        </p>
        <table>
          <thead><tr><th>Degree</th><th>For example</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td>Significant</td><td>Beat an equal foe; survive a tough spot</td><td>Burn all tags in a theme (only 2 on a strong hit)</td></tr>
            <tr><td>No Return</td><td>Beat a stronger foe; survive a dire spot</td><td>Replace a theme</td></tr>
            <tr><td>Ultimate</td><td>Beat a mighty foe; survive the hopeless</td><td>Take a tier-6 status</td></tr>
            <tr><td>Inescapable</td><td>Hold off an army or an Avatar; save someone from the impossible</td><td>Tier-6 status, whatever you roll</td></tr>
          </tbody>
        </table>
        <p>A strong hit pays the price one step lower; a mixed hit succeeds and pays in full; a miss fails <i>and</i> pays. These Consequences can’t be mitigated.</p>
      </>
    ),
  },
  {
    slug: 'downtime',
    title: 'Downtime & the Credit Roll',
    summary: 'Between scenes and sessions: recover, prepare, bond — and reset relationships.',
    pages: 'pp. 124–125',
    group: 'play',
    body: (
      <>
        <h2>Downtime</h2>
        <p>When the crew catches a breather, each player narrates what their character does and picks one benefit:</p>
        <ul>
          <li><b>Mark an upgrade box</b> on any one of your themes or the crew theme, <i>or</i></li>
          <li><b>3 Power</b> to spend on Effects without rolling — heal and recover (burnt tags cost only 1 each), prepare or Load Up, spend quality time to create a relationship tag, or research (Discover).</li>
        </ul>
        <OnTheSite>Use the <b>DOWNTIME</b> button on your sheet: pick a theme — or the crew theme — to mark an upgrade on, or spend 3 Power recovering burned tags, your own or the crew’s (1 each), and healing statuses (1 per tier).</OnTheSite>
        <h2>The Credit Roll</h2>
        <p>At the end of each session, talk through what happened, then:</p>
        <ul>
          <li>Restore all burnt crew relationship tags, and rewrite any relationships that changed.</li>
          <li>Recover one crew power tag for each member of the crew.</li>
        </ul>
        <OnTheSite>MCs have a <b>Credit Roll</b> button in Table Tools on the campaign page that does both, and a <b>Load Off</b> button for the end of a job.</OnTheSite>
      </>
    ),
  },
  {
    slug: 'evolution',
    title: 'Growth, Decay & Evolution',
    summary: 'Upgrades, replacing themes, Essence, Evolution points and Moments of Evolution.',
    pages: 'pp. 131–141',
    group: 'growth',
    body: (
      <>
        <h2>Upgrades</h2>
        <p>Mark a box on a theme’s Upgrade track when:</p>
        <ul>
          <li>one of its weakness tags is invoked (by you or the MC), whatever the roll;</li>
          <li>you choose it as your downtime benefit;</li>
          <li>you make a hard choice, sacrificing something to honor that theme’s motivation;</li>
          <li>you achieve a major goal tied to its motivation, or a Special says so.</li>
        </ul>
        <p>On the third box the theme gains an <b>upgrade</b> and the track resets. Choose one: a new power tag (from the same kit or themebook), add/rewrite/remove a weakness tag, a theme Special, clear the theme’s Decay, or mark 1 Evolution point.</p>
        <h2>Decay and replacing themes</h2>
        <p>
          When you act against a theme’s Identity, neglect its Ritual, or resist its Itch, you may mark <b>Decay</b>. It’s your call —
          and a powerful storytelling tool. On the third Decay mark the theme is <b>replaced</b>:
        </p>
        <ol>
          <li>Lose the theme and everything on it.</li>
          <li>Gain Evolution points: 1, plus 1 per power tag beyond three, per weakness tag beyond one, and per theme Special it had.</li>
          <li>Create a new <b>nascent</b> theme: just a title tag and one weakness tag. Until it has three power tags, each upgrade mark on it gives a new power tag instead.</li>
          <li>Re-check your Essence — it may change.</li>
        </ol>
        <h2>Essence</h2>
        <p>Your Essence depends on which categories your four themes cover, and grants an Essence Special:</p>
        <ul>
          <li><b>Nexus</b> — Self, Mythos and Noise.</li>
          <li><b>Spiritualist</b> — Self and Mythos. <b>Cyborg</b> — Self and Noise. <b>Transhuman</b> — Mythos and Noise.</li>
          <li><b>Real</b> — only Self. <b>Singularity</b> — only Noise.</li>
          <li><b>Avatar</b> — only Mythos, all from one Source. <b>Conduit</b> — only Mythos, from different Sources.</li>
        </ul>
        <h2>Evolution</h2>
        <p>
          Evolution points fill a five-circle track. When it fills, you gain a <b>Moment of Evolution</b> (each can be taken once):
          a new type of Essence, a second broad power tag, a Veteran Special (three times), retirement, reshaping the setting, or a
          total rebuild of the character.
        </p>
        <OnTheSite>Theme cards walk you through upgrades and replacement, and add Evolution points to your character card automatically. Your Essence and its Special update as you change themes.</OnTheSite>
      </>
    ),
  },
  {
    slug: 'running-the-game',
    title: 'Running the Game (for MCs)',
    summary: 'Framing scenes, making Threats, pacing tension, hard choices, and turning up the difficulty.',
    pages: 'pp. 78–83, 126, 136–137, 272–279',
    group: 'play',
    body: (
      <>
        <h2>Frame every scene</h2>
        <ul>
          <li><b>What’s here</b> — the place, who’s present, what’s already happening.</li>
          <li><b>The stakes</b> — what the crew wants here, or must prevent.</li>
          <li><b>Challenges</b> — what stands in the way: guards, locks, a mystery, a clock.</li>
          <li><b>Threats</b> — what those Challenges are visibly about to do. End with “What do you do?”</li>
        </ul>
        <h2>Threats make the game tick</h2>
        <p>
          Challenges don’t take turns — they act through Threats and, if ignored, Consequences. Make Threats specific and on-screen
          (“the drone swings its turret toward you”, not “it prepares to attack”). Consequences should follow a Threat or a missed
          roll; out of nowhere they feel unfair. If a Threat from an earlier scene went unanswered, you may open the next scene with
          its Consequence (a hard open).
        </p>
        <h2>Control the pace</h2>
        <p>
          Fewer Threats per beat means a calm, exploratory scene; several at once forces the crew to choose what to deal with and what
          to absorb. Rotate the spotlight so nobody acts twice before everyone has acted once.
        </p>
        <h2>Quick or tracked?</h2>
        <p>
          Resolve a conflict in one roll when it isn’t the focus; track it with Effects and Limits when you want to watch it blow by
          blow. Either works for any conflict — choose based on what deserves screen time.
        </p>
        <h2>Offer hard choices</h2>
        <p>
          Characters grow when two things they care about collide: a Ritual against an Identity, an Itch against the job. Pick one
          character’s motivation to pressure each session; the player decides whether it’s worth marking Decay.
        </p>
        <h2>If it’s too easy</h2>
        <ul>
          <li>Be stricter about which tags are directly relevant.</li>
          <li>Add Threats, bigger Scale, Challenges with defensive tags, or several Challenges at once.</li>
          <li>Hit harder on mixed hits; deal higher statuses and burn tags more often.</li>
          <li>Turn on optional rules: a lower PC Limit, Enhance at 2 Power per tier, or a power tag cap.</li>
        </ul>
        <OnTheSite>
          Build Challenges with Threats on the campaign page, keep <b>Table View</b> open to watch statuses and deal Consequences,
          run <b>Credit Roll</b> at the end of each session, and set optional rules under <b>Optional Rules</b>.
        </OnTheSite>
      </>
    ),
  },
  {
    slug: 'challenges',
    title: 'Challenges (for MCs)',
    summary: 'Building and tracking enemies, obstacles and countdowns with Limits, tags, Threats and Specials.',
    pages: 'pp. 78, 96–97, 106–109, 294–300',
    group: 'play',
    body: (
      <>
        <p>
          A <b>Challenge</b> is anything in the crew’s way: a gang enforcer, a vault door, a collapsing tunnel, a rival’s offer.
          Simple ones are just a quick roll. Important ones get a <b>profile</b> so you can track them blow by blow.
        </p>
        <h2>Parts of a profile</h2>
        <ul>
          <li><b>Role</b> — what it’s for in the scene: attacker, barrier, countdown, mystery, pursuer, target, watcher, temptation, or an asset to protect.</li>
          <li><b>Limits</b> — the ways it can be overcome and how hard each is: <i>hurt-or-subdue:3</i>, <i>convince:4</i>, <i>banish:5</i>. 2 is easy, 6 incredibly hard; “–” means immune. A <b>progress Limit</b> counts toward something happening instead (<i>alarm:3</i>, <i>ritual:5</i>).</li>
          <li><b>Base tags & statuses</b> — what it brings to the fight (<i>body armor</i>, <i>firewalled-2</i>). They make the crew’s rolls harder; the crew can strip them with Weaken.</li>
          <li><b>Specials</b> — its own rules: “when this happens, do that.”</li>
          <li><b>Threats → Consequences</b> — what it’s visibly about to do, and what happens if nobody stops it.</li>
        </ul>
        <h2>Overcoming a Challenge</h2>
        <p>
          When the crew’s Effects give it a status that counts toward a Limit, track the tier. Reaching the Limit overcomes it —
          it stops being a problem this scene. Going past it makes the outcome permanent (destroyed, dead, converted for good).
        </p>
        <Tip>Players don’t automatically know Limits — they discover them by studying the Challenge or by trial and error.</Tip>
        <OnTheSite>MCs build Challenges on the campaign page (start from a template), link statuses to Limits, and watch them fill. The eye button reveals a Challenge to players; the gauge button also reveals its Limits. Threats, Specials and notes stay MC-only.</OnTheSite>
      </>
    ),
  },
  {
    slug: 'glossary',
    title: 'Glossary',
    summary: 'Quick definitions for the game’s jargon.',
    pages: 'p. 62',
    group: 'basics',
    body: (
      <dl className="guide-glossary">
        {[
          ['Challenge', 'Anything standing in the PCs’ way: an enemy, a locked door, a mystery, a hazard. Tough ones have Limits.'],
          ['Consequence', 'What the MC does to you after a miss, a mixed hit, or an ignored Threat.'],
          ['Crew', 'The PCs as a team, with a shared crew theme card.'],
          ['Decay', 'Marks on a theme for neglecting its motivation. Three replaces the theme.'],
          ['Effect', 'What you buy with Power on a hit: statuses, tags, details, extra feats.'],
          ['Essence', 'Your character’s nature, from their mix of Self, Mythos and Noise themes.'],
          ['Itch / Identity / Ritual', 'The motivation of a Noise / Self / Mythos theme.'],
          ['Limit', 'How much of a status something can take. PCs: 5 overcomes, 6 is permanent.'],
          ['Loadout', 'Your fifth theme: gear you pack before a job.'],
          ['MC', 'Master of Ceremonies — the game master.'],
          ['Megacity', 'The sprawling city where your series is set.'],
          ['Mythos / Source', 'A legend made real, and the object, place, ritual or being it’s bound to.'],
          ['Nascent theme', 'A brand-new replacement theme with only its title tag (until it grows to three power tags).'],
          ['Noise', 'The overload of modern technology and media — and the superhuman tech it brings.'],
          ['Power', 'The number you add to 2d6, and spend on Effects.'],
          ['Scale', 'How much bigger one side of a conflict is than the other; it shifts Power.'],
          ['Spotlight', 'Your turn to act.'],
          ['Status', 'A temporary condition with a tier from 1 to 6.'],
          ['Story tag', 'A temporary tag from the scene; expires when the story says so.'],
          ['Threat', 'What a Challenge is about to do. Ignore it and it becomes a Consequence.'],
          ['Title tag', 'A theme’s first power tag, which names and defines it.'],
          ['Upgrade', 'Three marks on a theme’s Upgrade track; buys a tag, a Special, or Evolution.'],
        ].map(([term, def]) => (
          <div key={term}><dt>{term}</dt><dd>{def}</dd></div>
        ))}
      </dl>
    ),
  },
  {
    slug: 'whats-new',
    title: 'What’s New',
    summary: 'Recent additions to the site, newest first.',
    group: 'site',
    body: (
      <>
        <h2>October 2026</h2>
        <ul>
          <li><b>Crew tags in the roller.</b> Invoke the crew theme’s tags when you roll. Using a crew power tag burns it; a crew weakness — or a relationship tag the MC invokes against you — marks the crew’s upgrade.</li>
          <li><b>Downtime for the crew.</b> Mark the crew theme’s upgrade, or spend Power recovering burned crew tags.</li>
          <li><b>Tag notes.</b> Record what a tag covers with the pen beside it — handy when agreeing on interpretations with your MC.</li>
          <li><b>Restore deleted characters</b> from the campaign page for 30 days.</li>
          <li><b>Undo / redo</b> on every character sheet (⌘Z / Ctrl+Z).</li>
          <li><b>Write your own tags.</b> Theme and crew cards list their themebook’s questions, plus Identity / Ritual / Itch ideas from the kits.</li>
          <li><b>Your characters</b> quick links on the Campaigns page.</li>
          <li><b>Phone roller bar</b> keeps Power and the roll button in reach.</li>
          <li><b>Find a tag</b> in the roller: a search box filters long tag lists (try “crew”).</li>
          <li>The Theme Book marks theme types you already have, with a note on doubling up.</li>
          <li>Pop-up alerts are now gentle notices in the corner; downtime tells you what it changed, and the roller remembers whether you share rolls.</li>
          <li>New guide pages: <Link href="/guide/making-a-character">Making a Character</Link> and <Link href="/guide/session-zero">Session Zero</Link>.</li>
        </ul>
      </>
    ),
  },
  {
    slug: 'using-the-site',
    title: 'Roles, Invites & Sharing',
    summary: 'How campaigns, MCs, players and spectators work on this site.',
    group: 'site',
    body: (
      <>
        <h2>Campaign roles</h2>
        <ul>
          <li><b>MC</b> — runs the campaign: edits its details, the crew card and every character; manages members and the invite link. Whoever creates a campaign is its MC (and owner).</li>
          <li><b>Player</b> — creates and edits their own characters, updates the shared crew card during play, and can read everyone else’s sheets.</li>
          <li><b>Spectator</b> — can read the crew and every sheet, but can’t change anything.</li>
        </ul>
        <p>Site <b>admins</b> can see every campaign and manage accounts (promote, disable, reset passwords). The first account created is the admin.</p>
        <h2>Inviting your crew</h2>
        <ol>
          <li>Open your campaign; the <b>Members</b> panel shows the invite link and code.</li>
          <li>Send it to your players. They sign up (or sign in) and land in your campaign as players.</li>
          <li>Change anyone’s role from the same panel. Make a new link at any time to stop the old one working.</li>
        </ol>
        <h2>Saving</h2>
        <p>Everything saves automatically a moment after you stop typing — watch for “Saved” at the top of a sheet. Changed something by mistake? The undo and redo arrows next to it (or ⌘Z / Ctrl+Z) step your sheet back and forward. Deleted a character? It waits under <b>Recently deleted</b> on the campaign page for 30 days.</p>
        <h2>Handy shortcuts</h2>
        <ul>
          <li><b>Your characters</b> on the Campaigns page jump straight to your sheets.</li>
          <li>The <b>ROLL</b> button on a sheet opens the dice roller with your tags, the crew’s tags and your statuses ready to tap. On a phone, Power and the roll button stay pinned at the bottom; on a computer, press <b>R</b> to open it.</li>
          <li>The pen beside a tag records what it covers; the roller shows that note under the tag.</li>
          <li><b>Export</b> saves a sheet to a file you can import into another campaign; <b>Print</b> (on a computer) gives a paper copy.</li>
        </ul>
      </>
    ),
  },
]

export const GUIDE_BY_SLUG = Object.fromEntries(GUIDE.map(t => [t.slug, t])) as Record<string, GuideTopic>
