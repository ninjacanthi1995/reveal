import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import{ Link , useParams} from 'react-router-dom';
import '../App.less';
import { Row, Col, Divider, List, Typography, Button, message } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

import SchoolCustomerList from './SchoolCustomerList';

const { Title } = Typography;

export default function DashBoardAdmin() {
  const { tab } = useParams();

  const [schools, setSchools] = useState([]);
  useEffect(() => {
    const getSchools = async () => {
      const request = await fetch('/schools/all')
      const response = await request.json()
      if(response.result){
        setSchools(response.schools)
      }else{
        message.error(response.error)
      }
    }
    getSchools()
  }, [])

  return (
    <>
      <Navbar></Navbar>
      <h1>ADMIN DASHBOARD</h1>
      <Divider />
      <Row style={{height: "calc(100vh - 214px)", padding: "0 30px"}}>
        <Col span={6}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center'}}>
            <Title style={{marginBottom: 0}} level={4}>Liste des établissements</Title>
            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
          </div>
          <List style={{marginTop: 30}}>
            {schools.length > 0 && schools.map((school, i) => {
              return (
                <List.Item key={i}>
                  <Link to={`/dashboard/${school.name}`}>{school.name}</Link>
                  <div>
                    <Button type="primary" size='small' shape="circle" style={{marginRight: 10}} icon={<EditOutlined />} />
                    <Button type="primary" danger size='small' shape="circle" icon={<DeleteOutlined />} />
                  </div>
                </List.Item>
              )
            })}
          </List>
        </Col>
        <Divider type="vertical" style={{height: "100%"}} />
        <Col span={17}>
          {tab ? <SchoolCustomerList tab={tab} /> :
            <Title style={{textAlign: "center", color: "lightgray"}} level={3}>Cliquez sur une des écoles</Title>
          }
        </Col>
      </Row>
    </>
  );
}