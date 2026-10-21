import type { ThemeCategory } from '@/types'

/** Display data for the three theme categories (colors follow the core book: Self red, Mythos purple, Noise blue). */
export const CATEGORY_META: Record<ThemeCategory, {
  label: string
  color: string
  motivation: 'IDENTITY' | 'RITUAL' | 'ITCH'
  blurb: string
  motivationHelp: string
}> = {
  self: {
    label: 'SELF',
    color: 'var(--self)',
    motivation: 'IDENTITY',
    blurb: 'Self themes are your personal identity — who you are, who you know, what you’ve lived through.',
    motivationHelp: 'Identity: a statement you uphold to stay in touch with this part of yourself. Acting against it (or failing to uphold it) lets you mark Decay.',
  },
  mythos: {
    label: 'MYTHOS',
    color: 'var(--mythos)',
    motivation: 'RITUAL',
    blurb: 'Mythos themes are legendary powers granted by a Source — and your relationship with it.',
    motivationHelp: 'Ritual: what you must perform to keep your connection with your Source. Neglecting it lets you mark Decay.',
  },
  noise: {
    label: 'NOISE',
    color: 'var(--noise)',
    motivation: 'ITCH',
    blurb: 'Noise themes are superhuman technology — augmentations, cutting-edge gear, cyberspace, drones.',
    motivationHelp: 'Itch: a technological impulse you have to scratch. Resisting it lets you mark Decay.',
  },
}
