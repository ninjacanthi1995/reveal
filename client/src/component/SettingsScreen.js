import React, { useEffect, useState } from "react";
import { Row, Col, Divider, List } from "antd";
import Navbar from "./Navbar";
import MyAccountScreen from "./MyAccountScreen";
import MyCollaboratorsScreen from "./MyCollaboratorsScreen";
import { Link, useParams, useHistory } from "react-router-dom"
import MySchoolScreen from "./MySchoolScreen";

export default function SettingsScreen() {
  const { tab } = useParams();

  const [user, setUser] = useState({});
  useEffect(() => {
    const localStorageUser = JSON.parse(window.localStorage.getItem('user'));
    if(localStorageUser) setUser(localStorageUser)
  }, [])

  let history = useHistory();

  const disconnect = () => {
    window.localStorage.removeItem('school_id')
    window.localStorage.removeItem('user')
    history.push("/");
  }
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar></Navbar>
      <Row style={{ flexGrow: 2 }}>
        <Col span={5} style={{ height: "100%", marginLeft: "2%" }}>
          <List>
            <List.Item><Link to="/settings/account">Mon compte</Link></List.Item>
            {user.role === 'gérant' && <List.Item><Link to="/settings/collaborators">Mes collaborateurs</Link></List.Item>}
            {user.role !== 'admin' && <List.Item><Link to="/settings/etablissement">Mon établissement</Link></List.Item>}
          </List>
          <div style={{position: "absolute", bottom: 20, color: "red", cursor: "pointer"}} onClick={disconnect}>Déconnexion</div>
        </Col>
        <Divider type="vertical" style={{ height: "100%" }} />
        <Col span={18} style={{ height: "100%" }}>
          {tab === 'account' && <MyAccountScreen user={user} />}
          {tab === 'collaborators' && <MyCollaboratorsScreen />}
          {tab === 'etablissement' && <MySchoolScreen user={user} />}
        </Col>
      </Row>
    </div>
  );
}
