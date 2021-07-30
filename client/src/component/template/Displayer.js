import React from 'react';
import { useSelector } from 'react-redux';

import Text from './Text'
import Image from './Image'
import BackgroundImage from './BackgroundImage'

const Displayer = () => {
  const templateElements = useSelector(state => state.templateElements)
  const elementList = templateElements.map((element, index) => {
    if(element.type === "text" || element.type === "dynamic"){
      return <Text 
        key={index}
        element={element.element}
        type={element.type} 
        index={index} />
    }else if(element.type === "image"){
      return <Image 
        key={index}
        element={element.element}
        type={element.type} 
        index={index}
      />
    }else if(element.type === "imageBackground"){
      return <BackgroundImage 
        key={index}
        element={element.element}
        type={element.type} 
        index={index}
      />
    }else{
      return null
    }
  })

  return (
    <div style={styles.displayer}>
      {templateElements.length !== 0 && elementList}
    </div>
  );
}

const width = 70
const height = width/29.7*21

const styles = {
  displayer:{
    margin: "auto",
    width: `${width}vw`,
    height: `${height}vw`,
    backgroundColor: "white",
    position: "relative"
  }
}

export default Displayer;
