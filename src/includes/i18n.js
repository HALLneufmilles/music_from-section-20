import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'

export default createI18n({
  locale: 'en', // langue par défaut
  falbackLocale: 'en', // langue de repli si une langue demandée n'existe pas.
  messages: {
    // objet qui doit contenir toutes les traductions, Ici une seul pour l'exemple
    en,
    fr
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency', // pour le format monnaie
        currency: 'USD' // pour trouver le code: A partir "numberFormat" lien doc2, clicker en dessous de CONSTRUCTOR, descendre jusqu'a "currency" pour obtenir la liste des codes.
      }
    },
    ja: {
      currency: {
        style: 'currency', // pour le format monnaie
        currency: 'JPY' // pour trouver le code: A partir "numberFormat" lien doc2, clicker en dessous de CONSTRUCTOR, descendre jusqu'a "currency" pour obtenir la liste des codes.
      }
    }
  }
})
