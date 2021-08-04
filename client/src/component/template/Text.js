import React, {useState} from 'react';
import { Rnd } from 'react-rnd';
import { Input, Menu, Dropdown, Select, Badge } from 'antd';
import { useDispatch } from 'react-redux';
import { 
  BoldOutlined, 
  ItalicOutlined, 
  UnderlineOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import colors from '../../helpers/colors';

// INSERER REACT COLOR

const { TextArea } = Input;
const { Option } = Select;


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

  const fontSizeOptions = []
  for (let i = 12; i <= 50; i+=2) {
    fontSizeOptions.push(<Option key={i} value={i}>{i}</Option>)
  }
  
  const [visible, setVisible] = useState(false);
  const handleVisibleChange = flag => {
    setVisible(flag)
  };
  const rndStyle = {
    zIndex: 1, 
    border: visible && '1px dashed gray'
  }
  
  const updateElement = (size, position, value, bold, italic, underline, color, fontSize) => {
    dispatch({
      type: 'updateElement',
      index,
      elementType: type,
      element:{
        dynamicValue: type === "dynamic" && element.dynamicValue,
        name: type === "dynamic" && element.name,
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
          {fontSizeOptions}
        </Select>
      </Menu.Item>
      <Menu.Item key="delete" onClick={()=> {
          if(type === "dynamic"){
            dispatch({type: 'deleteRequiredElement', value})
          }
          dispatch({type: 'deleteElement', index})
        }}>
        <DeleteOutlined  style={{color: "red" }} />
      </Menu.Item>
    </Menu>
  );

  return (
    <Rnd
      bounds="parent"
      dragHandleClassName='dragIcon'
      size={size}
      position={position}
      onDragStop={(e, newPosition) => {
        if(newPosition.x !== position.x || newPosition.y !== position.y) setVisible(false)
        updateElement(size, { x: newPosition.x, y: newPosition.y }, value, bold, italic, underline, color, fontSize) 
      }}
      onResizeStop={(e, direction, ref, delta, newPosition) => {
        const refChild = ref.getElementsByTagName('textarea')[0]
        const childHeight = parseInt(refChild.style.height, 10)
        updateElement({ width: ref.style.width, height: childHeight + 2 }, newPosition, value, bold, italic, underline, color, fontSize) 
      }}
      style={rndStyle}
    >
      <Dropdown 
        overlay={menu} 
        placement="topCenter" 
        trigger={['click']}
        onVisibleChange={handleVisibleChange}
        visible={visible}
      >
        <TextArea 
          className="dragIcon"
          placeholder="Enter your text" 
          autoSize
          id={`${type}${index}`}
          style={textStyle}
          bordered={false}
          value={value}
          onChange={e => {
            const childHeight = parseInt(e.target.style.height, 10)
            if(type === "text") updateElement({ width: size.width, height: childHeight + 2 }, position, e.target.value, bold, italic, underline, color, fontSize) 
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

/* <Menu.Item key="dynamicValues">
  <Select size="small" defaultValue={'Valeur dynamique'} bordered={false} onChange={dynamicValue => {
    console.log(`dynamicValue`, dynamicValue)
    dispatch({type: "addRequiredElement", payload: dynamicValue})
    dynamicValue = value + "${" + dynamicValue + "}"
    updateElement(size, position, dynamicValue, bold, italic, underline, color, fontSize)
  }}>
    {dynamicValues.map(dynamicValue => {
      return <Option value={dynamicValue.value}>{dynamicValue.title}</Option>
    })}
  </Select>
</Menu.Item> */