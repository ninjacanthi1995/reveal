import React, { useState, useEffect } from 'react';
import { readString } from 'react-papaparse';
import { 
  Upload, 
  Button, 
  Typography, 
  Divider, 
  message, 
  Row, 
  Col,
  Select,
  Form, 
  Input
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Redirect, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Colors from '../helpers/colors';
import { status } from '../helpers/status';

import Navbar from './Navbar';

const { Title } = Typography;
const { Option } = Select

const ImportStudentScreen = () => {
  const history = useHistory();

  const [fileIsUploaded, setFileIsUploaded] = useState(false);

  const dispatch = useDispatch();

  const props = {
    accept: '.csv',
    showUploadList: false,
    beforeUpload: file => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async(e) => {
          const list = readString(e.target.result);
          await dispatch({
            type: 'setStudentList',
            list: list
          })
        };

        setTimeout(() => {
          setFileIsUploaded(true);
        }, 1000);
        
        // Prevent upload
        return false;
    },
  };

  // Add One Student process
  // Load Batches
  const [school_id, setSchool_id] = useState("");
  const [batchList, setBatchList] = useState([]);
  useEffect(() => {
    const school_id = window.localStorage.getItem('school_id')
    if(!school_id){
      message.error('Nous ne retrouvons pas votre école, essayez de vous reconnecter')
    }else{
      setSchool_id(school_id)
      const getTemplates = async () =>{
        const request = await fetch(`/batch?school_id=${school_id}`)
        const response = await request.json()
        if(response.success){
          setBatchList(response.batches)
        }else{
          message.error(response.message)
        }
      }
      getTemplates()
    }
  }, [])

  // update batch
  // get template associated & populate formEntries
  const [batch_id, setBatch_id] = useState("")
  const [formEntries, setFormEntries] = useState([])
  const handleChange = async value => {
    const template = []
    const requiredBatch = JSON.parse(value)
    setBatch_id(requiredBatch._id)
    const request = await fetch(`/templates/get/${school_id}/${requiredBatch.templateName}`);
    const response = await request.json();
    if(response.result){
      const requestedTemplate = {...response.template}
      if(requestedTemplate.firstname_field) template.push(requestedTemplate.firstname_field.name)
      if(requestedTemplate.lastname_field) template.push(requestedTemplate.lastname_field.name)
      if(requestedTemplate.birth_date_field) template.push(requestedTemplate.birth_date_field.name)
      if(requestedTemplate.mention_field) template.push(requestedTemplate.mention_field.name)
      setFormEntries(template)
    }else{
      setFormEntries([])
      message.error(response.error)
    }
  }

  // Set the student and send it to the DB
  const onFinish = async values => {
    const dataStudent = {
      email: values.email,
      firstname: values["Prénom"],
      lastname: values["Nom"],
      birth_date: values["Date de naissance"],
      diplomas: [{
        url_SmartContract: null,
        mention: values["Mention"],
        id_batch: batch_id,
        status: status.not_mailed
      }]
    }
    const request = await fetch('/post-csv-import', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dataStudent)
    })
    const response = await request.json();
    if (response.success){
      history.push('/diploma-list')
    } else {
      message.error(response.message)
    }
  };

  return (
    <>
      {fileIsUploaded && <Redirect to='/import-config' />}
      <Navbar />
      <div style={styles.importCSV}>
        <Title
          style={{color: Colors.violet}}
        >Téléchargez votre fichier .CSV:</Title>
        <Upload {...props} >
            <Button 
              shape='round'
              size='large'
              icon={<UploadOutlined />}
              style={styles.uploadButton}
            >Télécharger</Button>
        </Upload>
      </div>
      <Divider style={styles.divider}>Ou</Divider>
      <Row>
        <Col span={12} offset={6}>
          <Title level={4} style={{textAlign: 'center'}}>Ajoutez un élève manuellement:</Title>
          <Select style={{width: "100%"}} loading={batchList.length === 0} placeholder="Choisissez votre batch" onChange={handleChange}>
            {batchList.length !== 0 && batchList.map((batch, i) => {
              return <Option key={i} value={JSON.stringify(batch)}>{`${batch.curriculum} - ${batch.year}`}</Option>
            })}
          </Select>
          {formEntries.length !== 0 && 
            <Form
              name="basic"
              style={{marginTop: 30}}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: `S'il vous plaît, renseignez votre email` }]}
              >
                <Input />
              </Form.Item>
              {formEntries.map(entry => {
                return (
                  <Form.Item
                    key={entry}
                    label={entry}
                    name={entry}
                    rules={[{ required: true, message: `S'il vous plaît, renseignez votre ${entry}` }]}
                  >
                    <Input />
                  </Form.Item>
                )
              })}
              <Form.Item wrapperCol={{ offset: 5, span: 19 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          } 


        </Col>
      </Row>
    </>
  )
}

const styles = {
  uploadButton: {
    backgroundColor: Colors.green,
    border: Colors.green,
    color: "white",
    width: 350,
    height: 100,
    fontSize: 30
  },
  importCSV: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  divider:{
    borderColor: `${Colors.gray}`,
  }
}


export default ImportStudentScreen;