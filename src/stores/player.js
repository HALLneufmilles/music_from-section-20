import { defineStore } from 'pinia'
import { Howl } from 'howler'
import helper from '@/includes/helper'

export default defineStore('player', {
  state: () => ({
    current_song: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%'
  }),
  actions: {
    // async newSong(song) {
    //   this.current_song = song

    //   this.sound = new Howl({
    //     src: [song.url],
    //     html5: true // force l'audio html5
    //   })
    //   console.log(this.sound)
    //   this.sound.play()

    //   this.sound.on('play', () => {
    //     requestAnimationFrame(this.progress) // équivalant à setInterval() de javascript
    //   })
    // },
    async newSong(song) {
      if (this.sound.playing) {
        // Vérifier si une lecture est en cours
        if (this.current_song === song) {
          // Si la chanson est identique à celle en cours de lecture, mettre en pause ou reprendre
          this.toggleAudio()
        } else {
          // Si la chanson est différente, démarrer la nouvelle chanson
          this.current_song = song

          // Arrêter la chanson actuelle (si elle est en cours de lecture)
          if (this.sound.playing()) {
            this.sound.pause()
          }

          this.sound = new Howl({
            src: [song.url],
            html5: true // force l'audio html5
          })

          console.log(this.sound)
          this.sound.play()

          this.sound.on('play', () => {
            requestAnimationFrame(this.progress)
          })
        }
        return
      }

      // Si aucune lecture n'est en cours, démarrer la nouvelle chanson
      this.current_song = song

      this.sound = new Howl({
        src: [song.url],
        html5: true // force l'audio html5
      })

      console.log(this.sound)
      this.sound.play()

      this.sound.on('play', () => {
        requestAnimationFrame(this.progress)
      })
    },

    async toggleAudio() {
      if (!this.sound.playing) {
        return
      }

      if (this.sound.playing()) {
        this.sound.pause()
      } else {
        this.sound.play()
      }
    },
    progress() {
      // formatTime est importée du fichier helper.
      this.seek = helper.formatTime(this.sound.seek()) // On utilise la fonction seek() pour obtenir la position en secondes dans la vidéo.
      this.duration = helper.formatTime(this.sound.duration())

      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress)
      }
    },
    updateSeek(event) {
      if (!this.sound.playing) {
        return
      }
      const { x, width } = event.currentTarget.getBoundingClientRect()
      // "currentTarget" cible uniquement l'élément auquel appartient @click. S'est pour empécher la propagation de l'écouteur d'évènement à ses enfants. Ainsi on est sûr que l'élément pris en compte sera bien l'élément qui possède @click.
      // getBoundingClientRect retourne les dimension et la position de l'élément dans la fenêtre du navigateur(document), le tout dans un objet possédant les propriétés top, right, bottom, left, width, height, ainsi que x et y.
      const clickX = event.clientX - x // clientX renvoie la position en X par dans la fenêtre du navigateur(document), pas dans le containeur de la barre de progression
      // Pour obtenir la vraie valeur de clickX, il va falloir soustraire à la poistion en x du click dans la barre de progression par rapport au bord gauche de la fenêtre du navigateur, la valeur en x entre le côté gauche du de la fenêtre du navigateur et le côté gauche du containeur de la barre de progression.
      const percentage = clickX / width
      const seconds = this.sound.duration() * percentage // On converti le rapport clickX/width en secondes avec un produit en croix.
      //  duration/seconds équivaut à width/x => seconds = duration * clickX / width

      this.sound.seek(seconds) // cette fois seek() nous permet d'injecter une position en secondes au lieu de la récupérer comme dans la focntion progress()
      this.sound.once('seek', this.progress)
      // this.sound.once : Cette méthode est utilisée pour attacher un gestionnaire d'événement unique sur l'instance Howl nommée this.sound.
      //'seek' : Il s'agit de l'événement qui est surveillé. L'événement seek est déclenché par Howler.js lorsque la position de lecture du son est changée avec la méthode seek(). Cela peut être lors du déplacement manuel de la tête de lecture à un nouveau point dans le fichier audio.
      // this.progress : C'est la fonction qui est appelée une fois que l'événement seek se produit. Ell est responsable de la mise à jour des données de progression de la lecture, telles que le temps écoulé seek, la durée totale duration, et variable playerProgress utlisée danns le css AppPlayer.vue pour définier la largeur de la barre verte et la position de la bille .
    }
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        //console.log('state.sound.playing()', state.sound.playing())
        return state.sound.playing() // retourne 'true'
      }
      return false
    }
  }
})
