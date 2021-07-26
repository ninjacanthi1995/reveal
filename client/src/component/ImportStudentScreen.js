import React from 'react';
import { readString } from 'react-papaparse';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';


const ImportStudentScreen = () => {

  const dispatch = useDispatch();

  const props = {
    accept: '.csv',
    showUploadList: false,
    beforeUpload: file => {
        const reader = new FileReader();
        reader.onload = e => {
          const list = readString(e.target.result);
          dispatch({
            type: 'setStudentList',
            list: list
          })
        };
        reader.readAsText(file); // SUPPRIMABLE ??

        <Redirect to='/import-config' /> 

        // Prevent upload
        return false;
    },

  };

  // FAIRE LA REDIRECTION A LA FIN DU TELECHARGEMENT

  return (
    <Upload {...props}>
        <Button 
          icon={<UploadOutlined />}
        >Télécharger</Button>
    </Upload>
  )
}


export default ImportStudentScreen;