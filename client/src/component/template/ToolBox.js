import React, {useState} from 'react';
import { Menu, Button } from 'antd';
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;
const rootSubmenuKeys = ['sub1', 'sub2'];

const ToolBox = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [openKeys, setOpenKeys] = useState(['sub1']);
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
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            Option 1
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Option 2
          </Menu.Item>
          <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
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



// class App extends React.Component {
//   render() {
//     return (
//       <div style={{ width: 256 }}>
//         <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
//           {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
//         </Button>
//         <Menu
//           defaultSelectedKeys={['1']}
//           defaultOpenKeys={['sub1']}
//           mode="inline"
//           theme="dark"
//           inlineCollapsed={this.state.collapsed}
//         >
//           <Menu.Item key="1" icon={<PieChartOutlined />}>
//             Option 1
//           </Menu.Item>
//           <Menu.Item key="2" icon={<DesktopOutlined />}>
//             Option 2
//           </Menu.Item>
//           <Menu.Item key="3" icon={<ContainerOutlined />}>
//             Option 3
//           </Menu.Item>
//           <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
//             <Menu.Item key="5">Option 5</Menu.Item>
//             <Menu.Item key="6">Option 6</Menu.Item>
//             <Menu.Item key="7">Option 7</Menu.Item>
//             <Menu.Item key="8">Option 8</Menu.Item>
//           </SubMenu>
//           <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
//             <Menu.Item key="9">Option 9</Menu.Item>
//             <Menu.Item key="10">Option 10</Menu.Item>
//             <SubMenu key="sub3" title="Submenu">
//               <Menu.Item key="11">Option 11</Menu.Item>
//               <Menu.Item key="12">Option 12</Menu.Item>
//             </SubMenu>
//           </SubMenu>
//         </Menu>
//       </div>
//     );
//   }
// }