<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">{{ $t('manage.upload') }}</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { storage, auth, songsCollection } from '@/includes/firebase'

export default {
  name: 'AppUpload',
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel()
    })
  },
  props: ['addSong'],
  data() {
    return {
      is_dragover: false,
      uploads: []
    }
  },
  methods: {
    upload($event) {
      this.is_dragover = false

      // files est une Filelist.
      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files]
      console.log(files)

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          // vérification du type MIME du fichier.
          return
        }

        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            variant: 'bg-red-400',
            icon: 'fas fa-times',
            text_class: 'text-red-400'
          })
          return
        }
        // ********** upload du fichier dans STORAGE *******************
        // On récupère l'adresse du bucket de Firebase qu'on retrouve dans:
        // firebase.js / firebaseConfig / storageBucket: music-9df63.appspot.com.
        const storageRef = storage.ref() // music-9df63.appspot.com
        // La bonne pratique est de créer un répertoire enfant pour les fichiers de l'appli:
        const songsRef = storageRef.child(`songs/${file.name}`) // music-9df63.appspot.com/songs/exemple.mp3
        const task = songsRef.put(file)

        const uploadIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: file.name,
            variant: 'bg-blue-400',
            icon: 'fas fa-spinner fa-spin',
            text_class: ''
          }) - 1
        // push(), retourne la valeur length du tableau. On veut récupérer l'index de
        // la task ajoutée qui sera length-1 puisque pus() ajoute à la fin du tableau.

        // on(), restera active pour chaque fichier, tant qu'il n'aura pas fini d'être téléchargé et
        // se délenchera avec un nouveau snapshot (intentané) à chaque changement (progression, annulé, terminé).
        // Ici, il est important d'utiliser une fonction fléchée car nous avons besoin du context
        // du composant (englobant) pour this.
        task.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.uploads[uploadIndex].current_progress = progress
            // const upload = this.uploads.find((u) => u.name === file.name)
            // if (upload) {
            //   upload.current_progress = progress
            // }
          },
          (error) => {
            this.uploads[uploadIndex].variant = 'bg-red-400'
            this.uploads[uploadIndex].icon = 'fas fa-times'
            this.uploads[uploadIndex].text_class = 'text-red-400'
            console.log(error)
          },

          // ************ upload des données du fichier dans FIRESTORE ***********************
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0
            }

            song.url = await task.snapshot.ref.getDownloadURL()
            const songRef = await songsCollection.add(song)
            console.log('songRef : ', songRef)
            const songSnapshot = await songRef.get()
            console.log('songSnapshot : ', songSnapshot)

            this.addSong(songSnapshot)

            this.uploads[uploadIndex].variant = 'bg-green-400'
            this.uploads[uploadIndex].icon = 'fas fa-check'
            this.uploads[uploadIndex].text_class = 'text-green-400'
          }
        )
      })
    }
  }
}
</script>
