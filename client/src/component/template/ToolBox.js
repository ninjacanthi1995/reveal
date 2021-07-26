import React, {useState} from 'react';
import { Menu, Button } from 'antd';
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

const { SubMenu } = Menu;
const rootSubmenuKeys = ['addElement', 'addVariable'];

const ToolBox = () => {
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

  return (
    <div style={styles.toolBox}>
        <Button type="primary" onClick={()=>setCollapsed(!collapsed)} style={{ marginBottom: 16 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
        </Button>
        <Menu
          style={{overflowY: "scroll"}}
          defaultSelectedKeys={['1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          openKeys={openKeys} 
          onOpenChange={onOpenChange}
        >
          <SubMenu key="addElement" icon={<AppstoreAddOutlined />} title="Ajouter un élément">
            <Menu.Item key="text" icon={<FontSizeOutlined />}>Texte</Menu.Item>
            <Menu.Item key="image" icon={<PictureOutlined />}>Image</Menu.Item>
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
    width: 256,
    maxHeight: "calc(100vh - 190px)"
  }
}