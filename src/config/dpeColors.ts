export const DPE_COLORS: Record<string, string> = {
  A: '#319834',
  B: '#33cc31',
  C: '#cbfc33',
  D: '#fbea00',
  E: '#f0b400',
  F: '#ec6731',
  G: '#d7221f',
}

export const DPE_BADGE_BG: Record<string, string> = {
  A: 'bg-[#319834]',
  B: 'bg-[#33cc31] text-slate-900',
  C: 'bg-[#cbfc33] text-slate-900',
  D: 'bg-[#fbea00] text-slate-900',
  E: 'bg-[#f0b400] text-slate-900',
  F: 'bg-[#ec6731]',
  G: 'bg-[#d7221f]',
}

export const LEGEND_ITEMS = [
  { label: 'A', range: '≤ 70', color: '#319834' },
  { label: 'B', range: '71–110', color: '#33cc31' },
  { label: 'C', range: '111–180', color: '#cbfc33' },
  { label: 'D', range: '181–250', color: '#fbea00' },
  { label: 'E', range: '251–330', color: '#f0b400' },
  { label: 'F', range: '331–420', color: '#ec6731' },
  { label: 'G', range: '> 420', color: '#d7221f' },
]

export function getDPEColor(etiquette: string): string {
  return DPE_COLORS[etiquette] || '#64748b'
}
