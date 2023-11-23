import firebase from 'firebase/app'
import 'firebase/auth' // On ne donne pas un nom a ce module car Firebase est suffisamment intelligent pour étendre le noyau.
import 'firebase/firestore' // ne plus utiliser 'firbase/database' c'était pour firebase temps réel.
import 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_API_ID
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

// db.enablePersistence().catch((error) => {
//   console.log(`Firebase persistence error ${error.code}`)
// })

const userCollection = db.collection('user')
const songsCollection = db.collection('songs')
const commentsCollection = db.collection('comments')

export { auth, db, userCollection, storage, songsCollection, commentsCollection }
