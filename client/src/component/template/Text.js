<<<<<<< HEAD
// import React, {useState} from 'react';
// import { Rnd } from 'react-rnd';
// import { Input } from 'antd';

// const { TextArea } = Input;

// const Text = () => {
//   const [size, setSize] = useState({width: 200, height: "unset"});
//   const [position, setPosition] = useState({x:0, y:0});
//   const [value, setValue] = useState("");
=======
import React, {useState} from 'react';
import { Rnd } from 'react-rnd';
import { Input, Menu, Dropdown, Select, Badge } from 'antd';
import { useDispatch } from 'react-redux';
import { 
  BoldOutlined, 
  ItalicOutlined, 
  UnderlineOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import colors from '../../helpers/colors';

const { TextArea } = Input;
const { Option } = Select;

>>>>>>> 4467e118142358952d925db937dde6f123e12c32

const Text = ({element, type, index}) => {
  const dispatch = useDispatch()
  const { size, position, value } = element
  const {bold, italic, underline, color, fontSize} = element.style

  const textStyle = {
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline ? "underline" : "none",
    color: color,
    fontSize: fontSize,
    height: fontSize*2
  }

  const [visible, setVisible] = useState(false);
  const handleVisibleChange = flag => {
    setVisible(flag)
  };

  const updateElement = (size, position, value, bold, italic, underline, color, fontSize) => {
    dispatch({
      type: 'updateElement',
      index,
      elementType: type,
      element:{
        size,
        position,
        value,
        style:{
          bold,
          italic,
          underline,
          color,
          fontSize
        }
      }
    })
  }

  const menu = (
    <Menu style={styles.menu}>
      <Menu.Item key="bold" onClick={()=> updateElement(size, position, value, !bold, italic, underline, color, fontSize)}>
        <BoldOutlined style={{color: bold ? colors.green : colors.violet }} />
      </Menu.Item>
      <Menu.Item key="italic" onClick={()=> updateElement(size, position, value, bold, !italic, underline, color, fontSize)}>
      <ItalicOutlined style={{color: italic ? colors.green : colors.violet }} />
      </Menu.Item>
      <Menu.Item key="underline" onClick={()=> updateElement(size, position, value, bold, italic, !underline, color, fontSize)}>
        <UnderlineOutlined style={{color: underline ? colors.green : colors.violet }} />
      </Menu.Item>
      <Menu.Item key="color">
        <Select size="small" defaultValue={<Badge color={color}/>} bordered={false} onChange={colorValue => {
          updateElement(size, position, value, bold, italic, underline, colorValue, fontSize)
        }}>
          <Option value="black">
            <Badge color={"black"}/>
          </Option>
          <Option value="green">
            <Badge color={"green"}/>
          </Option>
          <Option value="blue">
            <Badge color={"blue"}/>
          </Option>
          <Option value="red">
            <Badge color={"red"}/>
          </Option>
          <Option value="yellow">
            <Badge color={"yellow"}/>
          </Option>
        </Select>
      </Menu.Item>
      <Menu.Item key="size">
        <Select size="small" defaultValue={14} bordered={false} onChange={fontSizeValue => {
          updateElement({ width: size.width, height: fontSizeValue*2 }, position, value, bold, italic, underline, color, fontSizeValue)
        }}>
          <Option value={12}>12</Option>
          <Option value={14}>14</Option>
          <Option value={16}>16</Option>
          <Option value={18}>18</Option>
          <Option value={20}>20</Option>
          <Option value={22}>22</Option>
          <Option value={24}>24</Option>
          <Option value={26}>26</Option>
          <Option value={28}>28</Option>
          <Option value={30}>30</Option>
          <Option value={32}>32</Option>
        </Select>
      </Menu.Item>
      <Menu.Item key="delete" onClick={()=> dispatch({type: 'deleteElement', index: index})}>
        <DeleteOutlined  style={{color: "red" }} />
      </Menu.Item>
    </Menu>
  );

<<<<<<< HEAD
//   return (
//     <Rnd 
//       onKeyDown={e => console.log(`e.key`, e.key)}
//       bounds="parent"
//       size={size}
//       position={position}
//       onDragStop={(e, newPosition) => {
//         setPosition({ x: newPosition.x, y: newPosition.y }) 
//       }}
//       onResizeStop={(e, direction, ref, delta, newPosition) => {
//         const refChild = ref.getElementsByTagName('textarea')[0]
//         const childHeight = parseInt(refChild.style.height, 10)
//         setSize({ width: ref.style.width, height: childHeight + 2 });
//         setPosition(newPosition) 
//       }}
//       style={{border:'1px dashed gray'}}
//     >
//       <TextArea 
//         placeholder="Enter your text" 
//         autoSize
//         bordered={false}
//         value={value}
//         onChange={e => {
//           const childHeight = parseInt(e.target.style.height, 10)
//           setSize({ width: size.width, height: childHeight + 2 });
//           setValue(e.target.value)
//         }}
//       /> 
//     </Rnd>
//   );
// }

// export default Text;
=======
  return (
    <Rnd
      bounds="parent"
      size={size}
      position={position}
      onDragStop={(e, newPosition) => {
        updateElement(size, { x: newPosition.x, y: newPosition.y }, value, bold, italic, underline, color, fontSize) 
      }}
      onResizeStop={(e, direction, ref, delta, newPosition) => {
        const refChild = ref.getElementsByTagName('textarea')[0]
        const childHeight = parseInt(refChild.style.height, 10)
        updateElement({ width: ref.style.width, height: childHeight + 2 }, newPosition, value, bold, italic, underline, color, fontSize) 
      }}
      style={{border:'1px dashed gray'}}
    >
      <Dropdown 
        overlay={menu} 
        placement="topCenter" 
        trigger={['click']}
        onVisibleChange={handleVisibleChange}
        visible={visible}
      >
        <TextArea 
          placeholder="Enter your text" 
          autoSize
          id={`${type}${index}`}
          style={textStyle}
          bordered={false}
          value={value}
          onChange={e => {
            const childHeight = parseInt(e.target.style.height, 10)
            updateElement({ width: size.width, height: childHeight + 2 }, position, e.target.value, bold, italic, underline, color, fontSize) 
          }}
        /> 
      </Dropdown>
    </Rnd>
  );
}

const styles = {
  menu:{
    display: "flex",
    padding: "0 4px",
    width: "fit-content",
    margin: "auto"
  }
}

export default Text;
>>>>>>> 4467e118142358952d925db937dde6f123e12c32

