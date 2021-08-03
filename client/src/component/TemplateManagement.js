import React, {useState, useEffect} from 'react';
import Navbar from './Navbar';
import { Table, Space, Button, message, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Paragraph } = Typography;

export default function TemplateManagement() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [school_id, setSchool_id] = useState("");
  useEffect(() => {
    const school_id = window.localStorage.getItem('school_id')
    setSchool_id(school_id)
    const getTemplates = async () => {
      const request = await fetch(`/templates/get-templates/${school_id}`)
      const response = await request.json()
      if(response.result){
        setTemplates(response.templateList)
        setLoading(false)
      }else{
        message.error(response.error)
        setLoading(false)
      }
    }
    getTemplates()
  }, []);
  
  const deleteTemplate = async (record) => {
    const request = await fetch(`/templates/delete/${school_id}/${record.template_name}`, {method: "DELETE"})
    const response = await request.json()
    if(response.result){
      message.success(response.message)
      setTemplates(response.templateList)
    }else{
      message.error(response.error)
    }
  }

  const columns = [
    {
      title: "Modeles de nos diplomes",
      dataIndex: 'template_name',
      key: 'template_name',
      render: (text, record) => <Link to={`/creer-mon-template/${record.template_name}`}>{text}</Link>
    },{
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Space size="middle">
            <Link to={`/creer-mon-template/${record.template_name}`}>Edit</Link>
            <Paragraph style={{...styles.p, color: "#0F6157"}} copyable={{ text: `${window.location.origin}/creer-mon-template/${record.template_name}` }}>
              Copy
            </Paragraph>
            <p style={styles.p} onClick={() => deleteTemplate(record)}>Delete</p>
          </Space>
        </>
      ),
    },
  ];

  const MyButton = () => {
    return <Button className='Button-connect' style={{ marginLeft: 20, marginBottom: 10, borderRadius: 6, fontWeight: "bold" }}> +Ajouter un modele</Button>
  }

  return (
    <>
      <Navbar />
      <h1>GESTIONNAIRE DES TEMPLATES</h1>
      <Link to="/creer-mon-template" ><MyButton /></Link>
      <Table
        columns={columns}
        loading={loading}
        dataSource={templates}
      />
    </>
  );
}

const styles = {
  p:{
    margin: 0,
    cursor: "pointer",
    color: "red"
  }
}