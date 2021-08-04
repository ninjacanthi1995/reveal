import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import{ Link , useParams} from 'react-router-dom';
import '../App.less';
import { 
  Row, 
  Col, 
  Divider, 
  List, 
  Typography, 
  Button, 
  message,
  Modal,
  Input,
  Popconfirm
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

import SchoolCustomerList from './SchoolCustomerList';

const { Title } = Typography;

export default function DashBoardAdmin() {
  const { tab } = useParams();
  const handleRequest = async request => {
    const response = await request.json()
    if(response.result){
      if(response.message) message.success(response.message)
      setSchools(response.schools)
    }else{
      message.error(response.error)
    }
  }

  const [selectedSchool, setSelectedSchool] = useState({});
  const [schoolName, setSchoolName] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = selectSchool => {
    if(selectSchool.name) {
      setSchoolName(selectSchool.name)
      setSelectedSchool(selectSchool)
    }
    setIsModalVisible(true);
  };
  const closeModal = () => {
    setSelectedSchool({})
    setSchoolName('')
    setIsModalVisible(false);
  };
  const handleOk = async () => {
    const schoolFetch = async path => {
      const request = await fetch(path, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({schoolName})
      })
      await handleRequest(request)
    }
    if(selectedSchool.name){
      await schoolFetch(`/schools/edit/${selectedSchool._id}`)
    }else{
      await schoolFetch(`/schools/create`)
    }
    closeModal()
  };

  const [schools, setSchools] = useState([]);
  useEffect(() => {
    const getSchools = async () => {
      const request = await fetch('/schools/all')
      await handleRequest(request)
    }
    getSchools()
  }, [])


  const deleteSchool = async school => {
    const request = await fetch(`/schools/delete/${school._id}`, {method: "DELETE"})
    await handleRequest(request)
  }

  return (
    <>
      <Navbar></Navbar>
      <h1>ADMIN DASHBOARD</h1>
      <Divider />
      <Row style={{height: "calc(100vh - 214px)", padding: "0 30px"}}>
        <Col span={6}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center'}}>
            <Title style={{marginBottom: 0}} level={4}>Liste des établissements</Title>
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={showModal} />
          </div>
          <List style={{marginTop: 30}}>
            {schools.length > 0 && schools.map((school, i) => {
              return (
                <List.Item key={i}>
                  <Link to={`/dashboard/${school.name}`}>{school.name}</Link>
                  <div>
                    <Button type="primary" size='small' shape="circle" style={{marginRight: 10}} icon={<EditOutlined />} onClick={() => showModal(school)} />
                    <Popconfirm
                      title="Voulez-vous supprimer cette école ? Cela supprimera tous les utilisateurs qui y sont liés"
                      onConfirm={() => deleteSchool(school)}
                      placement="topLeft"
                      okText="Oui"
                      cancelText="Ouh là ! Non !"
                    >
                      <Button type="primary" danger size='small' shape="circle" icon={<DeleteOutlined />} />
                    </Popconfirm>
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

      <Modal title={selectedSchool.name ? `Modifier ${selectedSchool.name}` : `Créer une école`} visible={isModalVisible} onOk={handleOk} onCancel={closeModal}>
        <label>Nom de l'école</label>
        <Input
          autoFocus
          placeholder="Nom de l'école" 
          value={schoolName} 
          onChange={e => setSchoolName(e.target.value)}
        />
      </Modal>
    </>
  );
}