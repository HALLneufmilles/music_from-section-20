export default {
  formatTime(time) {
    const minutes = Math.floor(time / 60) || 0
    const seconds = Math.round(time - minutes * 60 || 0)

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}` // Si la variable secondes est inférieure à dix, nous ajouterons un zéro avant d'ajouter le nombre de secondes. Sinon, rien n'est ajouté. Une fois cela fait, nous ajoutons le nombre de secondes.
  }
}
