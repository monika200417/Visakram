/** Material tones for The Visakram Way's shaded solids — gradient stops per face, lit from the upper right. */

export type WayTone = 'concrete' | 'stone' | 'dark' | 'glass' | 'timber' | 'gold' | 'foam'

type Stops = readonly [string, string]
type Tone = { top: Stops; l: Stops; r: Stops; opacity?: number }

export const tones: Record<WayTone, Tone> = {
  concrete: { top: ['#b9b3a5', '#8d887c'], l: ['#54524c', '#33322e'], r: ['#a8a090', '#79746a'] },
  stone: { top: ['#ddd4c1', '#c0b7a4'], l: ['#9d9587', '#7a7367'], r: ['#d6cdbb', '#ada594'] },
  dark: { top: ['#3d3c37', '#282723'], l: ['#1d1c19', '#121210'], r: ['#34312c', '#211f1c'] },
  glass: {
    top: ['#9bb3ae', '#4a6360'],
    l: ['#1f2a28', '#181614'],
    r: ['#3a4f4c', '#a9c0bb'],
    opacity: 0.78,
  },
  timber: { top: ['#94603c', '#744a2b'], l: ['#5e3c25', '#44291a'], r: ['#a86f45', '#80502f'] },
  foam: { top: ['#f1e8d6', '#d6c7a8'], l: ['#9a8d72', '#6f634c'], r: ['#e8dcc8', '#bfae8d'] },
  gold: { top: ['#c4441f', '#c4441f'], l: ['#8a2f14', '#5a1c0b'], r: ['#c4441f', '#c4441f'] },
}

export const faceDir = {
  top: { x1: 0, y1: 0, x2: 1, y2: 1 },
  l: { x1: 0, y1: 0, x2: 0, y2: 1 },
  r: { x1: 0, y1: 0, x2: 0.4, y2: 1 },
} as const

export const toneFill = (tone: WayTone, face: 'top' | 'l' | 'r') => `url(#way-${tone}-${face})`
