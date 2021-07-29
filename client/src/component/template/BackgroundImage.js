import React, {useState} from 'react';
import { Rnd } from 'react-rnd';
import { useDispatch } from 'react-redux';
import { Menu, Dropdown, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const Text = ({element, type, index}) => {
  const dispatch = useDispatch()
  const { size, position, imagePreview } = element
  const {bgPosition, bgSize} = element.style

  const [visible, setVisible] = useState(false);
  const handleVisibleChange = flag => {
    setVisible(flag)
  };

  const updateElement = (size, position, bgSize, bgPosition) => {
    dispatch({
      type: 'updateElement',
      index,
      elementType: type,
      element:{
        size,
        position,
        imagePreview,
        style:{
          bgPosition,
          bgSize
        }
      }
    })
  }

  const styles = {
    image:{
      height: "100%",
      width: "100%",
      backgroundImage: `url(${imagePreview})`,
      backgroundPosition: bgPosition,
      backgroundRepeat: "no-repeat",
      backgroundSize: bgSize,
    },
    menu:{
      display: "flex",
      padding: "0 4px",
      width: "fit-content",
      margin: "auto"
    },
  }

  const menu = (
    <Menu style={styles.menu}>
      <Menu.Item key="size">
        <Select size="small" defaultValue={bgSize} bordered={false} onChange={sizeValue => {
          updateElement(size, position, sizeValue, bgPosition)
        }}>
          <Option value={"contain"}>contain</Option>
          <Option value={"cover"}>cover</Option>
        </Select>
      </Menu.Item>
      <Menu.Item key="position">
        <Select size="small" defaultValue={bgPosition} bordered={false} onChange={positionValue => {
          updateElement(size, position, bgSize, positionValue)
        }}>
          <Option value={"bottom"}>bottom</Option>
          <Option value={"top"}>top</Option>
          <Option value={"center"}>center</Option>
          <Option value={"left"}>left</Option>
          <Option value={"right"}>right</Option>
        </Select>
      </Menu.Item>
      <Menu.Item key="delete" onClick={()=> dispatch({type: 'deleteElement', index})}>
        <DeleteOutlined  style={{color: "red" }} />
      </Menu.Item>
    </Menu>
  );

  return (
    <Rnd
      bounds="parent"
      size={size}
      position={position}
      onDragStop={(e, newPosition) => {
        if(newPosition.x !== position.x || newPosition.y !== position.y) setVisible(false)
        updateElement(size, { x: newPosition.x, y: newPosition.y }, bgSize, bgPosition) 
      }}
      onResizeStop={(e, direction, ref, delta, newPosition) => {
        updateElement({ width: ref.style.width, height: ref.style.height }, newPosition, bgSize, bgPosition) 
      }}
      style={visible && {border:'1px dashed gray'}}
    >
      <Dropdown 
        overlay={menu} 
        placement="topCenter" 
        trigger={['click']}
        onVisibleChange={handleVisibleChange}
        visible={visible}
      >
        <div style={styles.image}></div>
      </Dropdown>
    </Rnd>
  );
}

export default Text;

