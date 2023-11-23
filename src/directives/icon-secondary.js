export default {
  beforeMount(el, binding) {
    // eslint-disable-next-line no-unused-vars
    let iconClass = `fa fa-${binding.value.icon} text-green-400 text-xl`

    if (binding.value.right) {
      // eslint-disable-next-line no-const-assign
      iconClass += ' float-right'
    }

    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}
