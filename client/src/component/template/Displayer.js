import React from 'react';
import { useSelector } from 'react-redux';

import Text from './Text'

const Displayer = () => {
  const templateElements = useSelector(state => state.templateElements)
  const elementList = templateElements.map((element, index) => {
    if(element.type === "text"){
      return <Text />
    }
  })

  return (
    <div style={styles.displayer}>
      {templateElements.length !== 0 && elementList}
      {/* <Text /> */}
      
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
