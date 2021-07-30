import React, {useState, useEffect} from 'react';
import Navbar from './Navbar';
import { Table, Space, Button, message } from 'antd';
import { Link } from 'react-router-dom';

export default function TemplateManagement() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getTemplates = async () => {
      const school_id = window.localStorage.getItem('school_id')
      const request = await fetch(`/templates/get-templates/${school_id}`)
      const response = await request.json()
      if(response.result){
        setTemplates(response.templateList)
        setLoading(false)
      }else{
        message.error(response.error)
      }
    }
    getTemplates()
  }, []);

  const columns = [
    {
      title: "Modeles de nos diplomes",
      dataIndex: 'template_name',
      key: 'template_name',
      render: text => <a href="/#">{text}</a>,
    },{
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Space size="middle">
            <Link to={`/creer-mon-template/${record.template_name}`}>Edit</Link>
            <a href="/#">Delete</a>
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