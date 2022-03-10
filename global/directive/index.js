export const trim = {
  mounted (el, binding) {
    const vm = binding.instance
    el.addEventListener('keyup', (e) => {
      e.target.value = e.target.value.trim()
      vm.$emit('onUpdate:modelValue', e.target.value)
    })
  }
}

export const lowerCase = {
  // bind (el, binding, vnode) {
  // const handler = function(e) {
  //   if (e.target.value) e.target.value = e.target.value.trim()
  //   console.log(e.target.value)
  //   // if (e.target.value.length > maxChars) {
  //   // e.target.value = e.target.value.substr(0, maxChars)
  //   // vnode.elm.dispatchEvent(new CustomEvent('input')) // added this
  //   // }
  // }
  // el.addEventListener('input', handler)

  //   el.addEventListener('keyup', (e) => {
  //     if (e.target.value) {
  //       e.target.value = e.target.value.toLowerCase()
  //       vnode.componentInstance.$emit('input', e.target.value)
  //     }
  //   }, true)
  // }

  mounted (el, binding) {
    const vm = binding.instance
    el.addEventListener('keyup', (e) => {
      e.target.value = e.target.value.toLowerCase()
      vm.$emit('onUpdate:modelValue', e.target.value)
    }, true)
  }
}

export const uppercase = {
  // mounted (el, binding) {
  //   const vm = binding.instance
  //   let target = null

  //   el.addEventListener('keyup', (e) => {
  //     target = e.target
  //     e.target.value = e.target.value.toUpperCase()
  //     vm.$emit('onUpdate:modelValue', e.target.value)
  //   }, true)
  // },
  mounted (el, binding, vnode) {
    // let vm = vnode.context;
    const vm = binding.instance
    // el.dispatchEvent('update:modelValue', 'sdg')
    el.addEventListener('keyup', (e) => {
      // e.target.value = e.target.value.toUpperCase()
      // vm.$emit('update:modelValue', 'sdg')
    })
  }
}

export const upperCaseFirst = {
  mounted (el, binding) {
    const vm = binding.instance
    el.addEventListener('keyup', (e) => {
      e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
      vm.$emit('onUpdate:modelValue', e.target.value)
    })
  }
}

export const upperCaseSpace = {
  mounted (el, binding) {
    const vm = binding.instance
    el.addEventListener('keyup', (e) => {
      const arr = e.target.value.trim().split(' ')
      e.target.value = ''
      for (let i = 0; i < arr.length; i++) {
        e.target.value += arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
        if (i < arr.length - 1) e.target.value += ' '
      }
      vm.$emit('onUpdate:modelValue', e.target.value)
    })
  }
}
