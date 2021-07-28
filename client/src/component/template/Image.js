import React, {useState} from 'react';
import { Rnd } from 'react-rnd';
import { useDispatch } from 'react-redux';
import { Menu, Dropdown } from 'antd';
import { DeleteOutlined, DragOutlined } from '@ant-design/icons';


const Text = ({element, type, index}) => {
  const dispatch = useDispatch()
  const { size, position, imagePreview } = element

  const [visible, setVisible] = useState(false);
  const handleVisibleChange = flag => {
    setVisible(flag)
  };

  const updateElement = (size, position) => {
    dispatch({
      type: 'updateElement',
      index,
      elementType: type,
      element:{
        size,
        position,
        imagePreview
      }
    })
  }

  const styles = {
    rnd:{
      zIndex: 1, 
      border: visible && '1px dashed gray'
    },
    menu:{
      display: "flex",
      padding: "0 4px",
      width: "fit-content",
      margin: "auto"
    },
    dragIcon:{
      display: visible ? "block" : "none",
      position: 'absolute',
      backgroundColor: "white",
      padding: 5,
      borderRadius: 20,
      cursor: "all-scroll",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }
  }

  const menu = (
    <Menu style={styles.menu}>
      <Menu.Item key="delete" onClick={()=> dispatch({type: 'deleteElement', index})}>
        <DeleteOutlined  style={{color: "red" }} />
      </Menu.Item>
    </Menu>
  );

  return (
    <Rnd
      bounds="parent"
      lockAspectRatio={true}
      size={size}
      dragHandleClassName='dragIcon'
      position={position}
      onDragStop={(e, newPosition) => {
        setVisible(false)
        updateElement(size, { x: newPosition.x, y: newPosition.y }) 
      }}
      onResizeStop={(e, direction, ref, delta, newPosition) => {
        updateElement({ width: ref.style.width, height: ref.style.height }, newPosition) 
      }}
      style={styles.rnd}
    >
      <Dropdown 
        overlay={menu} 
        placement="topCenter" 
        trigger={['click']}
        onVisibleChange={handleVisibleChange}
        visible={visible}
      >
        <div style={{position: "relative"}}>
          <DragOutlined className="dragIcon" style={styles.dragIcon} />
          <img src={imagePreview} height={size.height} alt="" />
        </div>
      </Dropdown>
    </Rnd>
  );
}

export default Text;

