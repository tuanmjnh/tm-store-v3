export function getRandom (number = 10, increase = 0) {
  Math.floor(Math.random() * number) + increase
}

export function getRndInteger (min = 0, max = 10) {
  return Math.floor(Math.random() * (max - min)) + min
}
