import * as R from 'ramda'

export function onMouseEnter() {
  const win = require('electron').remote.getCurrentWindow()
  win.setIgnoreMouseEvents(false)
}

export function onMouseLeave() {
  const win = require('electron').remote.getCurrentWindow()
  win.setIgnoreMouseEvents(true, {
    forward: true
  })
}

export function toTopZIndex(target) {
  const { parentElement } = target
  const { children } = parentElement

  const tools = Array.from(children)

  const maxIndex = Math.max.apply(
    Math,
    tools.map((t) => parseInt(t.style.zIndex || '0', 10))
  )

  const nextIndex = maxIndex + 1

  const top = R.find(R.equals(target), tools)
  top.style.zIndex = nextIndex
}

export function onMouseDown(e) {
  const { currentTarget } = e
  toTopZIndex(currentTarget)
}

export function startListeningToIgnoreMouseEvents(el) {
  el.addEventListener('mouseenter', onMouseEnter)
  el.addEventListener('mouseleave', onMouseLeave)
}

export function stopListeningToIgnoreMouseEvents(el) {
  el.removeEventListener('mouseenter', onMouseEnter)
  el.removeEventListener('mouseleave', onMouseLeave)
}

export function startListeningAndSwapZIndex(el) {
  el.addEventListener('mousedown', onMouseDown)
}

export function stopListeningAndSwapZIndex(el) {
  el.addEventListener('mousedown', onMouseDown)
}
