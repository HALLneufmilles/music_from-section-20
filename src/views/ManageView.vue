<template>
  <main>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <app-upload :addSong="addSong" />
        </div>
        <div class="col-span-2">
          <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title">{{ $t('manage.mysongs') }}</span>
              <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
            </div>
            <div class="p-6">
              <!-- Composition Items -->
              <app-compositionitem
                v-for="(song, i) in songs"
                :key="song.docID"
                :song="song"
                :updateSong="updateSong"
                :index="i"
                :removeSong="removeSong"
                :updateUnsaveFlag="updateUnsaveFlag"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
//***Gardien de route : Section 12-153: Solution 3***
//import useUserStore from '@/stores/user'
import AppUpload from '@/components/AppUpload.vue'
import AppCompositionitem from '@/components/AppCompositionitem.vue'
import { songsCollection, auth } from '@/includes/firebase'

export default {
  name: 'ManageView',
  components: { AppUpload, AppCompositionitem },
  data() {
    return {
      songs: [],
      unsavedFlag: false
    }
  },
  async created() {
    const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()

    snapshot.forEach(this.addSong)
  },
  methods: {
    updateSong(i, values) {
      // modifie les nouvelles données à l'écran.
      this.songs[i].modified_name = values.modified_name
      this.songs[i].genre = values.genre
    },
    removeSong(i) {
      // Supprime l'item (la chason) de l'écran.
      this.songs.splice(i, 1)
    },
    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id
      }
      this.songs.push(song)
    },
    updateUnsaveFlag(value) {
      this.unsavedFlag = value
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next()
    } else {
      const leave = confirm('You have unsaved changes. Are you sure you want to leave ?')
      next(leave)
    }
  }
  //***Gardien de route : Section 12-153: Solution 3***
  // beforeRouteEnter(to, from, next) {
  //   const store = useUserStore()
  //   if (store.userLoggedIn) {
  //     next()
  //   } else {
  //     next({ name: 'home' })
  //   }
  // }
}
</script>
