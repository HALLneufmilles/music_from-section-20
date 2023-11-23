import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ManageView from '@/views/ManageView.vue'
// ***Gardien de route : Section 12-152: Solution 2***
// ***Gardien de route : Section 12-155 ***
import useUserStore from '@/stores/user'
import SongView from '@/views/SongView.vue'

const routes = [
  {
    name: 'home',
    path: '/', // "/" représente marque la position juste
    // après le nom de domaine. Ex: domaine.com/about
    // Pour une page d'accueil, Ex: domaine.com/
    component: HomeView
  },
  {
    name: 'about',
    path: '/about',
    component: AboutView
  },
  {
    name: 'manage',
    //alias: '/manage',
    path: '/manage-music',
    component: ManageView,
    // ***Gardien de route : Section 12-152: Solution 2***
    // beforeEnter: (to, from, next) => {
    //   const store = useUserStore()
    //   if (store.userLoggedIn) {
    //     next()
    //   } else {
    //     next({ name: 'home' })
    //   }
    // },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/manage',
    redirect: { name: 'manage' }
  },
  {
    name: 'song',
    path: '/song/:id', // ce path dans la barre d'adresse appelle le composant 'SongView'.
    component: SongView
  },
  {
    // Route générique, si aucune chemin ne correspond
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' } // Ou page 404
  }
]

const router = createRouter({
  // import.meta  contient des informations d'environnement et d'autres propriétés spécifiques à Vite.
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// ***Gardien de route : Section 12-151: Solution 1***
// router.beforeEach((to, from, next) => {
//   console.log('Global Guard')
//   console.log(to, from)
//   next()
// })

// ***Gardien de route : Section 12-155 ***
router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    // Si la route en cours n'est pas srveillée
    next() // On peut resté sur la page
    return // Fin de la fonction
  }

  // Si la route en cours est surveillée
  const store = useUserStore()
  if (store.userLoggedIn) {
    // Si l'utilisateur est connecté
    next() // On peut resté sur la page
  } else {
    next({ name: 'home' }) // Sinon, on redirige vers 'home'.
  }
})

export default router
