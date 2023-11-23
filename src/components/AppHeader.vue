<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link class="text-white font-bold uppercase text-2xl mr-4" :to="{ name: 'home' }"
        >Music</router-link
      >
      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <router-link class="px-2 text-white" :to="{ name: 'about' }">{{
            $t('menu.about')
          }}</router-link>
          <!-- Navigation Links -->
          <li v-if="!userStore.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">{{
              $t('menu.log')
            }}</a>
          </li>
          <template v-else>
            <li>
              <!-- Ce lien redirigera les utilisateurs vers une page qui leur permettra de gérer leurs chansons.-->
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">{{
                $t('menu.manage')
              }}</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logOut">{{
                $t('menu.logout')
              }}</a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a class="px-2 text-white" href="#" @click.prevent="changeLocale">
              {{ currentLocale }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
// https://chat.openai.com/share/b9b4e85a-6e13-43a2-a05b-a9cf7b2dfb4f
// https://chat.openai.com/share/a692bb68-45e3-43aa-9bb5-0b5bf0607535
// On import les fonctionalités de "pinia" dans notre composant.
import { mapStores } from 'pinia'
// On import modal.js dans une variable qui doit toujours commencer par "use" !!
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'

export default {
  name: 'AppHeader',
  computed: {
    // On donne a manger à "pinia" notre ficher 'modal.js'.
    //"Pinia" retourne un objet commençant par l'ID du State :
    // "modal" dans modale.js (export default defineStore('modal', { ... )
    // ---> objet retourné : "modal" + Store = "modalStore".
    // "user" dans user.js (export default defineStore('user', { ... )
    // ---> objet retourné : "user" + Store = "userStore".
    ...mapStores(useModalStore, useUserStore),
    currentLocale() {
      return this.$i18n.locale === 'fr' ? 'French' : 'English'
    }
  },
  methods: {
    toggleAuthModal() {
      // On accède à la donnée 'isOpen' à partir de l'objet retourné par Pinia.
      this.modalStore.isOpen = !this.modalStore.isOpen
      // console.log(this.modalStore.isOpen)
    },
    logOut() {
      this.userStore.logOut()
      // console.log(this.$route)
      //this.$router.push({ name: 'home' })
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'home' })
      }
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === 'fr' ? 'en' : 'fr'
    }
  }
}

// Alternative qui fonctionne mais elle décrit moins ce qui se passe.
// import useModalStore from '@/stores/modal'

// export default {
//   name: 'AppHeader',
//   methods: {
//     toggleAuthModal() {
//       const modalStore = useModalStore()
//       modalStore.isOpen = !modalStore.isOpen
//       console.log(modalStore.isOpen)
//     }
//   }
// }
</script>
