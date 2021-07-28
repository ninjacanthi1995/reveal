import React, {useState} from 'react';
// import { Menu, Button, Upload, message } from 'antd';
import { Menu, Button, message} from 'antd';
import {
  AppstoreAddOutlined,
  UserAddOutlined,
  FontSizeOutlined,
  PictureOutlined,
  FileImageOutlined,
  UserOutlined,
  BankOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';

const { SubMenu } = Menu;
const rootSubmenuKeys = ['addElement', 'addVariable'];

const ToolBox = () => {
  const dispatch = useDispatch()
  const [collapsed, setCollapsed] = useState(false)
  const [openKeys, setOpenKeys] = useState([]);
  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if(file){
      if(!file.type.includes("image")) message.error(`Nous n'acceptons pas ${file.name} car il n'est pas un .jpg ou .png 😔`);
      reader.onloadend = () => {
        dispatch({ type: 'addElements', elementType: "image", imagePreview: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div style={styles.toolBox}>
        <Button type="primary" onClick={()=>setCollapsed(!collapsed)} style={{ marginBottom: 16 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
        </Button>
        <Menu
          id="toolbox-menu"
          defaultSelectedKeys={['1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          openKeys={openKeys} 
          onOpenChange={onOpenChange}
        >
          <SubMenu key="addElement" icon={<AppstoreAddOutlined />} title="Ajouter un élément">
            <Menu.Item key="text" icon={<FontSizeOutlined />} onClick={()=> {dispatch({ type: 'addElements', elementType: "text" })}}>Texte</Menu.Item>
            <Menu.Item key="image" icon={<PictureOutlined />} onClick={()=> {
              document.getElementById('fileUpload').click()
            }}>
              Image
              <input style={{display: "none"}} type="file" name="fileUpload" id="fileUpload" onChange={(e) => handleImageChange(e)} />
            </Menu.Item>
            <Menu.Item key="bgImage" icon={<FileImageOutlined />}>Image de fond</Menu.Item>
          </SubMenu>
          <SubMenu key="addVariable" icon={<UserAddOutlined />} title="Ajouter une variable">
            <SubMenu key="student" icon={<UserOutlined />} title="Étudiant">
              <Menu.Item key="firstname">Prénom</Menu.Item>
              <Menu.Item key="lastname">Nom</Menu.Item>
              <Menu.Item key="birth_date">Date de Naissance</Menu.Item>
              <Menu.Item key="mention">Mention</Menu.Item>
            </SubMenu>
            <SubMenu key="school" icon={<BankOutlined />} title="École">
              <Menu.Item key="year">Année</Menu.Item>
              <Menu.Item key="cursus">Cursus</Menu.Item>
              <Menu.Item key="promo">Promo</Menu.Item>
            </SubMenu>
          </SubMenu>
        </Menu>
      </div>
  );
}
export default ToolBox;

const styles = {
  toolBox:{
    position: "fixed",
    maxHeight: "calc(100vh - 190px)",
    zIndex: 1
  }
}