import React, { useState } from 'react';
import { readString } from 'react-papaparse';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';


const ImportStudentScreen = () => {

  const [fileIsUploaded, setFileIsUploaded] = useState(false);

  const dispatch = useDispatch();

  const props = {
    accept: '.csv',
    showUploadList: false,
    beforeUpload: file => {
        const reader = new FileReader();
        reader.onload = async(e) => {
          const list = readString(e.target.result);
          await dispatch({
            type: 'setStudentList',
            list: list
          })
        };
        reader.readAsText(file); // SUPPRIMABLE ??

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