/** Material tones for The Visakram Way's shaded solids — gradient stops per face, lit from the upper right. */

export type WayTone = 'concrete' | 'stone' | 'dark' | 'glass' | 'timber' | 'gold' | 'foam'

type Stops = readonly [string, string]
type Tone = { top: Stops; l: Stops; r: Stops; opacity?: number }

export const tones: Record<WayTone, Tone> = {
  concrete: { top: ['#b9b3a5', '#8d887c'], l: ['#54524c', '#33322e'], r: ['#a8a090', '#79746a'] },
  stone: { top: ['#ddd4c1', '#c0b7a4'], l: ['#9d9587', '#7a7367'], r: ['#d6cdbb', '#ada594'] },
  dark: { top: ['#3d3c37', '#282723'], l: ['#1d1c19', '#121210'], r: ['#34312c', '#211f1c'] },
  glass: {
    top: ['#e6cb8c', '#8a7038'],
    l: ['#2c251a', '#0b0a08'],
    r: ['#6e5430', '#e8c780'],
    opacity: 0.78,
  },
  timber: { top: ['#94603c', '#744a2b'], l: ['#5e3c25', '#44291a'], r: ['#a86f45', '#80502f'] },
  foam: { top: ['#f0e2a8', '#cdb870'], l: ['#a8975a', '#7d6e3c'], r: ['#e6d494', '#b9a35e'] },
  gold: { top: ['#f1dfae', '#c9a45c'], l: ['#8c6c30', '#5e4620'], r: ['#e0c685', '#a9843f'] },
}

export const faceDir = {
  top: { x1: 0, y1: 0, x2: 1, y2: 1 },
  l: { x1: 0, y1: 0, x2: 0, y2: 1 },
  r: { x1: 0, y1: 0, x2: 0.4, y2: 1 },
} as const

export const toneFill = (tone: WayTone, face: 'top' | 'l' | 'r') => `url(#way-${tone}-${face})`
