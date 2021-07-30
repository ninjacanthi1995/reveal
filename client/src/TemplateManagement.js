import React from 'react';
import Navbar from '../src/component/Navbar';
import { Table, Space, Button } from 'antd';
import {Link} from 'react-router-dom';





export default function TemplateManagement() {

  const columns = [
    {
      title: "Modeles de nos diplomes",
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'annee',
      dataIndex: 'annee',
      key: 'annee',
      sorter: (a,b) => b.annee - a.annee
    },
    
    
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>

        </Space>
      ),
    },
  ];
  
  const data = [
    {
      key: '1',
      name: 'DUT commerce international',
      annee: 2021,
    },
    {
      key: '2',
      name: 'Master I communication et reseaux sociaux',
      annee: 2020,
    },
    {
      key: '3',
      name: 'Master II Marketing digital',
      annee: 2019,
    },
    {
      key: '4',
      name: 'Master II Marketing digital',
      annee: 2021,
    },
  ];

  
  const MyButton = () => {
    return <Button className= 'Button-connect'  style={{marginLeft:20, marginBottom:10, borderRadius:6, fontWeight: "bold"}}> +Ajouter un modele</Button>
}


    return (
      <>
      <Navbar/>
          <h1>GESTIONNAIRE DES TEMPLATES</h1>
          <Link to="/creer-mon-template" ><MyButton></MyButton></Link>
      <Table
    columns={columns} 
    dataSource={data} 
  />
      </>

  );
}