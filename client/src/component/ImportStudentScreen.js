import React, { useState } from 'react';
import { readString } from 'react-papaparse';
import { Upload, Button, Typography, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Colors from '../helpers/colors';

import Navbar from './Navbar';

const { Title } = Typography;

const ImportStudentScreen = () => {

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


  return (
    <div>
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
      <Divider style={styles.divider}/>
      <div>

      </div>
    </div>
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
    borderColor: `${Colors.violet}`,
  }
}


export default ImportStudentScreen;