import React, { useState } from 'react';
import { readString } from 'react-papaparse';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';


const ImportStudentScreen = () => {
  const [list, setList] = useState([]);
  const studentList = useSelector(state => state.studentList);

  console.log('students: ', studentList);
  
  setList(studentList[0]);

  const Headers = list.map(header => <li>{ header }</li>);

  return (
    <ul>
      {Headers}
    </ul>

  )
}


export default ImportStudentScreen;