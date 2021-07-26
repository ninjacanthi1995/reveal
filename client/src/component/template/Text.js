import React, {useState} from 'react';
import { Rnd } from 'react-rnd';
import { Input } from 'antd';

const { TextArea } = Input;

const Text = () => {
  const [size, setSize] = useState({width: 200, height: "unset"});
  const [position, setPosition] = useState({x:0, y:0});
  const [value, setValue] = useState("");



  return (
    <Rnd 
      onKeyDown={e => console.log(`e.key`, e.key)}
      bounds="parent"
      size={size}
      position={position}
      onDragStop={(e, newPosition) => {
        setPosition({ x: newPosition.x, y: newPosition.y }) 
      }}
      onResizeStop={(e, direction, ref, delta, newPosition) => {
        const refChild = ref.getElementsByTagName('textarea')[0]
        const childHeight = parseInt(refChild.style.height, 10)
        setSize({ width: ref.style.width, height: childHeight + 2 });
        setPosition(newPosition) 
      }}
      style={{border:'1px dashed gray'}}
    >
      <TextArea 
        placeholder="Enter your text" 
        autoSize
        bordered={false}
        value={value}
        onChange={e => {
          const childHeight = parseInt(e.target.style.height, 10)
          setSize({ width: size.width, height: childHeight + 2 });
          setValue(e.target.value)
        }}
      /> 
    </Rnd>
  );
}

export default Text;

