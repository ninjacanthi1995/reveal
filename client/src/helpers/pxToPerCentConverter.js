const xtcConverter = (px, width) => {
  const displayer = document.getElementById('displayer')
  if(width){
    console.log(`position Horizontale`, px)
    console.log(`displayer.offsetWidth`, displayer.offsetWidth)
    console.log(`percent`, px/displayer.offsetWidth*100)
    return `${px/displayer.offsetWidth*100}%`
  }else{
    console.log(`position Verticale`, px)
    console.log(`displayer.offsetHeight`, displayer.offsetHeight)
    console.log(`percent`, px/displayer.offsetHeight*100)
    return `${px/displayer.offsetHeight*100}%`
  }
}

export default xtcConverter