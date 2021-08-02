import React, {useState} from 'react';
import { Rnd } from 'react-rnd';
import { useDispatch } from 'react-redux';
import { Menu, Dropdown } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';


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
      position: 'absolute',
      backgroundColor: "transparent",
      cursor: "all-scroll",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    }
  }

  const menu = (
    <Menu style={styles.menu}>
      <Menu.Item key="delete" onClick={()=> dispatch({type: 'deleteElement', index})}>
        <DeleteOutlined  style={{color: "red" }} />
      </Menu.Item>
    </Menu>
  );
  const qrcode_menu = (
    <Menu style={styles.menu}>
      <Menu.Item key="info">
        Cet élément ne peut être supprimé
      </Menu.Item>
    </Menu>
  );

  return (
    <Rnd
      bounds="parent"
      lockAspectRatio={true}
      size={{width: size.width+2, height: size.height+2}}
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
        overlay={type === "image" ? menu : qrcode_menu} 
        placement="topCenter" 
        trigger={['click']}
        onVisibleChange={handleVisibleChange}
        visible={visible}
      >
        <div style={{position: "relative"}}>
          <div className="dragIcon" style={styles.dragIcon}></div>
          <img src={imagePreview} height={size.height} alt="" />
        </div>
      </Dropdown>
    </Rnd>
  );
}

export default Text;

