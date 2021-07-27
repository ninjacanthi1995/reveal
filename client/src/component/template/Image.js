import React from 'react';
import { Rnd } from 'react-rnd';
import { useDispatch } from 'react-redux';

const src = "/reveal.png"


const Text = ({element, type, index}) => {
  const dispatch = useDispatch()
  const { size, position } = element

  const updateElement = (size, position) => {
    dispatch({
      type: 'updateElement',
      index,
      elementType: type,
      element:{
        size,
        position,
      }
    })
  }

  const styles = {
    image:{
      height: size.height,
      width: size.width,
      backgroundImage: `url(${src})`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain"
    }
  }

  return (
    <Rnd
      bounds="parent"
      size={size}
      position={position}
      onDragStop={(e, newPosition) => {
        updateElement(size, { x: newPosition.x, y: newPosition.y }) 
      }}
      onResizeStop={(e, direction, ref, delta, newPosition) => {
        console.log(`ref`, ref)
        updateElement({ width: ref.style.width, height: ref.style.height }, newPosition) 
      }}
      style={{border:'1px dashed gray'}}
    >
      <div style={styles.image}></div>
    </Rnd>
  );
}

export default Text;

