import { defineStore } from 'pinia'

export default defineStore('modal', {
  state: () => ({
    isOpen: false
  }),
  getters: {
    // chaque Getter reçoit l'objet 'state'.
    hiddenClass(state) {
      return !state.isOpen ? 'hidden' : ''
    }
  }
})

// soluton alternative
//modal.js
// import { defineStore } from 'pinia'

// export const useModalStore = defineStore('modal', {
//   state: () => ({
//     isOpen: false
//   })
// })
