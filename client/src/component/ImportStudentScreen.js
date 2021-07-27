import React, { useState } from 'react';
import { readString } from 'react-papaparse';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Navbar from './Navbar';

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
        
        //console.log('UPLOADED');

        // Prevent upload
        return false;
    },
  };

  let redirect = null;
  if (fileIsUploaded){
    redirect = <Redirect to='/import-config' />;
  }

  return (
    <div>
      <Navbar></Navbar>
      {redirect}
      <Upload {...props}>
          <Button 
            icon={<UploadOutlined />}
          >Télécharger</Button>
      </Upload>
    </div>
  )
}


export default ImportStudentScreen;