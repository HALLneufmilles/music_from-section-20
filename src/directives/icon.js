export default {
  beforeMount(el, binding) {
    // const iconClass = 'fa fa-headphones-alt float-right text-green-400 text-xl'

    // eslint-disable-next-line no-unused-vars
    let iconClass = `fa fa-${binding.value} text-xl`
    // float-right
    if (binding.arg === 'full') {
      // eslint-disable-next-line no-const-assign
      iconClass = 'fa fa-microscope float-right text-green-400 text-xl'
    }

    if (binding.modifiers.right) {
      // eslint-disable-next-line no-const-assign
      iconClass += ' float-right'
    }

    if (binding.modifiers.yellow) {
      iconClass += ' text-yellow-400'
    } else {
      iconClass += ' text-green-400'
    }

    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}
