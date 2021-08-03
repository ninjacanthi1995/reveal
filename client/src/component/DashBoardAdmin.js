import React from 'react';
import Navbar from './Navbar';

import{ Link , useParams, useHistory} from 'react-router-dom';
import '../App.less';



import { Row, Col, Divider, List } from "antd";
import SchoolCustomerList from './SchoolCustomerList';
import SchoolCustomerListAdd from './SchoolCustomerList';


export default function DashBoardAdmin() {

    const { tab } = useParams();
  let history = useHistory();

  const disconnect = () => {
    window.localStorage.removeItem('admin')
    history.push("/");
  }

    return (

        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar></Navbar>
      <h1> ADMIN DASHBOARD</h1>
      <Row style={{ flexGrow: 2 }}>
        <Col span={6} style={{ height: "100%", marginLeft: "2%" }}>
          <List>
          <List.Item><Link to="/dashboard-admin/school-list">Liste des établissements</Link></List.Item>
            <List.Item><Link to="/dashboard-admin/add-school">Ajouter un établissement</Link></List.Item>
            <List.Item><Link to="/dashboard-admin/add-school-admin">Ajouter un administrateur école</Link></List.Item>
          </List>
          <div style={{position: "absolute", bottom: 20, color: "red", cursor: "pointer"}} onClick={disconnect}>Déconnexion</div>
        </Col>
        <Divider type="vertical" style={{ height: "100%" }} />
        
        <Col span={17} style={{ height: "100%" }}>
       
          {tab === 'school-list' && <SchoolCustomerList />}
          {tab === 'add-school' && < SchoolCustomerList/>}
          {tab === 'add-school-admin' && < SchoolCustomerList/>}
        </Col>
      </Row>
    </div>
  );
}