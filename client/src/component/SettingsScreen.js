import React from "react";
import { Row, Col, Divider, List } from "antd";
import Navbar from "./Navbar";
import MyAccountScreen from "./MyAccountScreen";
// import { Layout } from "antd";
import { Link, useParams, useHistory } from "react-router-dom"

// const { Header, Sider, Content } = Layout;

export default function SettingsScreen() {
  const { tab } = useParams();
  let history = useHistory();

  const disconnect = () => {
    window.localStorage.removeItem('school_id')
    history.push("/");
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar></Navbar>
      <Row style={{ flexGrow: 2 }}>
        <Col span={6} style={{ height: "100%", marginLeft: "2%" }}>
          <List>
            <List.Item><Link to="/settings/account">Mon compte</Link></List.Item>
            <List.Item><Link to="/settings/collaborators">Mes collaborateurs</Link></List.Item>
            <List.Item><Link to="/settings/etablissement">Mon établissement</Link></List.Item>
          </List>
          <div style={{position: "absolute", bottom: 20, color: "red", cursor: "pointer"}} onClick={disconnect}>Déconnexion</div>
        </Col>
        <Divider type="vertical" style={{ height: "100%" }} />
        <Col span={17} style={{ height: "100%" }}>
          {tab === 'account' && <MyAccountScreen />}
        </Col>
      </Row>
    </div>
  );
}

// const styles = {
//   content: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   input: {
//     width: "100%",
//   },
// };
