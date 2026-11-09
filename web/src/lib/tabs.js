// Teclado de abas (WAI-ARIA): setas, Home e End movem o foco e escolhem a aba.
export function tabKeys(e, ids, current, select, vertical = false) {
  const keys = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']
  let i = ids.indexOf(current)
  if (e.key === keys[0]) i = (i - 1 + ids.length) % ids.length
  else if (e.key === keys[1]) i = (i + 1) % ids.length
  else if (e.key === 'Home') i = 0
  else if (e.key === 'End') i = ids.length - 1
  else return
  e.preventDefault()
  select(ids[i])
  requestAnimationFrame(() => document.getElementById(`tab-${ids[i]}`)?.focus())
}
