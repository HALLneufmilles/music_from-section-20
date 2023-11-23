<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_message }}
      </div>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            name="modified_name"
            @input="updateUnsaveFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            name="genre"
            @input="updateUnsaveFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection, storage } from '@/includes/firebase'

export default {
  name: 'AppCompositionitem',
  props: {
    song: {
      type: Object,
      required: true
    },
    updateSong: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    removeSong: {
      type: Function,
      required: true
    },
    updateUnsaveFlag: {
      type: Function
    }
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces'
      },
      in_submission: false, // desactive le bouton Submit
      show_alert: false, // Afficher le message alert
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! Updating song infos.'
    }
  },
  methods: {
    async edit(values) {
      // édite les nouvelles données dans Firebase
      this.in_submission = true
      this.show_alert = true
      this.alert_variant = 'bg-blue-500'
      this.alerte_message = 'Please wait! Updating song infos.'

      try {
        await songsCollection.doc(this.song.docID).update(values)
      } catch (error) {
        this.in_submission = false // Arrete la submission
        this.alert_variant = 'bg-red-500'
        this.alert_message = 'Something went wrong! Try again later.'
        return
      }

      this.updateSong(this.index, values) // met à jour les données de l'item sur l'écran.
      // La fonction vient de "ManageView.vue".
      this.updateUnsaveFlag(false)

      this.in_submission = false
      this.alert_variant = 'bg-green-500'
      this.alert_message = 'Succes!'
    },
    // Suprime la chanson de Firebase
    async deleteSong() {
      // Suppression de "storage": Pour atteindre la chanson dans Storage, on re-fabrique son url,
      // comme on l'avait fait dans le composant "AppUpload.vue":
      const storageRef = storage.ref()
      const songsRef = storageRef.child(`songs/${this.song.original_name}`)
      await songsRef.delete()

      // Suppression de Firestore:
      await songsCollection.doc(this.song.docID).delete()

      // suppression de son affichage à l'écran. La fonction vient de "ManageView.vue".
      this.removeSong(this.index)
    }
  }
}
</script>
