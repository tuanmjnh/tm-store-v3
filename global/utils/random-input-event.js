const types = ['mouseDown', 'mouseUp', 'mouseEnter', 'mouseLeave', 'contextMenu', 'mouseWheel', 'mouseMove', 'keyDown', 'keyUp']
const modifiers = ['shift', 'control', 'alt', 'meta', 'isKeypad', 'isAutoRepeat', 'leftButtonDown', 'middleButtonDown', 'rightButtonDown', 'capsLock', 'numLock', 'left', 'right']
const Keys = [
  'k', // pause
  'm', // must
  't', // mode
  'f', // full screen
  'j', // back 10s
  'l' // next 10s
  // 'shift+n' // next
]

export function random(first, last) {
  const random = Math.floor((Math.random() * last) + first)
  return random
}

export function sendInput({ window, keyCode, type, rdFirst, rdLast }) {
  setTimeout(() => {
    window.webContents.sendInputEvent({ type: type | 'keyDown', keyCode: keyCode })
  }, random(rdFirst | 3000, rdLast | 50000))
}

export function sendInputEvent({ window, keyCode, type }) {
  sendInput({ window: window, keyCode: keyCode, type: type | 'keyDown' })
}

export function sendInputRandom({ window, type, rdFirst, rdLast }) {
  const keyCode = Keys[random(0, 5)]
  if (keyCode === 'k') sendInput({ window: window, keyCode: keyCode, type: type | 'keyDown', rdFirst: rdFirst | 3000, rdLast: rdLast | 50000 })
  sendInput({ window: window, keyCode: keyCode, type: type | 'keyDown' })
}

export function randomSendInput({ window, type, rdFirst, rdLast }) {
  const times = random(1, 12)
  for (let i = 0; i < times.length; i++) {
    sendInputRandom({ window: window, type: type | 'keyDown', rdFirst: rdFirst | 3000, rdLast: rdLast | 50000 })
  }
}
