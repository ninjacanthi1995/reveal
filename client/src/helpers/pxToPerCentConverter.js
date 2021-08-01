const xtcConverter = (px, oldDimensions, widthOrHeight) => {
  // si oldDimensions n'est pas défini, le calcul est impossible, on renvoie donc seulement px
  // si px n'est pas un nombre, on lui retourne sa valeur
  if(!oldDimensions || typeof px !== "number") return px

  // px: la valeur en pixel enregistrée dans la db
  // oldDimensions: les dimensions du displayer sur lequel a été réalisé le template initialement
  // widthOrHeight: prend comme valeur "width" ou "height" et nous servira à savoir si on doit se baser sur la hauter ou la largeur de nos displayers

  // on récupère les largeurs et hauteurs du nouveau displayer
  const displayer = document.getElementById('displayer')
  const newDimensions = {width: displayer.offsetWidth, height: displayer.offsetHeight}

  // on retourne la valeur en px mise à jour en fonction des dimensions de l'ancien displayer par rapport au nouveau
  return px/oldDimensions[widthOrHeight]*newDimensions[widthOrHeight]
}

export default xtcConverter