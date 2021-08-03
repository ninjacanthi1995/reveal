import React, { useState, useEffect } from 'react';

import Navbar from './Navbar';
import { Table, Button, message } from 'antd';

import { statusFilters } from '../helpers/status';
import Colors from '../helpers/colors';
import emailFetcher from '../helpers/emailFetcher';


import { Select, Typography } from 'antd';
const { Option } = Select;
const { Title } = Typography;



const DiplomaListScreen = () => {
  const now = new Date();
  const [optionsYear, setOptionsYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  //const [schoolId, setSchoolId] = useState('');
  const [data, setData] = useState([]);
  const [filtersCurriculum, setFiltersCurriculum] = useState([]);
  const [filtersPromo, setFiltersPromo] = useState([]);
  const [selectedDiplomas, setSelectedDiplomas] = useState([]);
  
  const columns = [
    {
      title: 'Curriculum',
      dataIndex: 'curriculum',
      defaultSortOrder: 'ascend',
      sorter:{multiple: 4},
      filters: filtersCurriculum,
      onFilter: (value, record) => record.curriculum.includes(value),
    },
    {
      title: 'Promo',
      dataIndex: 'promo',
      defaultSortOrder: 'ascend',
      sorter:{multiple: 3},
      filters: filtersPromo,
      onFilter: (value, record) => record.promo.includes(value),
      
    },
    {
      title: 'Nom',
      dataIndex: 'lastname',
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => a.lastname.localeCompare(b.lastname),
        multiple: 2
      }
    },
    {
      title: 'Prénom',
      dataIndex: 'firstname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: {
        compare: (a, b) => a.email.localeCompare(b.email),
        multiple: 1
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: statusFilters,
      onFilter: (value, record) => record.status===value
    }
  ];
  
  
  
  useEffect(() => {
    const schoolId = window.localStorage.getItem('school_id');

    const fetchBatches = async () => {
      const rawData = await fetch(`/batch?school_id=${schoolId}`);
      const response = await rawData.json();
      
      if(response.success){
        let batchYears = response.batches.map(batch => batch.year);
        batchYears = [...new Set(batchYears)];      //[...new Set(array)] sert à retirer les year en doublon
        batchYears = batchYears.sort();
        const yearOpt = batchYears.map((year, i) => {
          return <Option key={i} value={year}>{year}</Option>
        })
        setOptionsYear(yearOpt);
      }else{
        message.error(response.message)
      }
    }
    fetchBatches();
  }, []);
  //console.log('batches: ', batchList);
  //console.log('OptionsYear: ', optionsYear);
  
  useEffect(() => {
    const getData = async () => {
      const schoolId = window.localStorage.getItem('school_id');  // nécessaire pour avoir schoolId au 1er render (pas commode de le stoker dans un useState)
      const rawData = await fetch(`/batches-populated?schoolId=${schoolId}&year=${selectedYear}`);
      const data = await rawData.json();
      const batchesOfYearWithStudents = data.batchesOfYearWithStudents;
      //console.log('populated: ', batchesOfYearWithStudents);

      let curriculumList = [];
      let promoList = [];
      let tempData = [];
      batchesOfYearWithStudents.forEach((batch, i) => {
        curriculumList.push({
          text: batch.curriculum,
          value: batch.curriculum,
        });
        promoList.push({
          text: batch.promo,
          value: batch.promo,
        });
        const batchId = batch._id;
        batch.studentsId.forEach((student, j) => {
          student.diplomas.forEach((diploma, k) => {
            if (diploma.id_batch === batchId) {
              const row = {
                key: i.toString() + j.toString() + k.toString(),
                curriculum: batch.curriculum,
                promo: batch.promo.toString(),
                lastname: student.lastname,
                firstname: student.firstname,
                email: student.email,
                status: diploma.status,
                birth_date: student.birth_date,  // not diplayed in table but will be used in email.
                studentId: student._id,
                diplomaId: diploma._id
              }
              tempData.push(row);
            }
          })
        })
      });
      setFiltersCurriculum(curriculumList);
      setFiltersPromo(promoList);
      setData(tempData);
    };
    getData();
  }, [selectedYear])


  // pour tous filtrage ou tri d'un header
  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }


  // Pour toutes selections / deselections d'une row
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedDiplomas(selectedRows);
    },
    /* onSelect: (record, selected, selectedRows) => {
      console.log('ON_SELECT: ', record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log('ON_SELECT_ALL: ', selected, selectedRows, changeRows);
    }, */
  };
  
  return (
    <>
      <Navbar/>
      <div style={styles.selectBatchAndMailButton}>
        <Title 
          level={4}
          style={{color: Colors.violet}}
        >Séléctionner l'année: 
          <Select
            defaultValue={now.getFullYear()}
            style={{width:100, marginLeft: 10}}
            onChange={(year) => {setSelectedYear(year)}}
          >
            {optionsYear}
          </Select>
        </Title>
        <Button
          shape='round'
          size='medium'
          style={styles.button}
          onClick={() => emailFetcher(selectedDiplomas)}
        >Envoyer les mails</Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={data}
        pagination={false}
        onChange={onChange} 
        rowSelection={{...rowSelection}}
        scroll={{y: 600}}               // A AFFINER - le plus grand possible
        style={{marginLeft: 5, marginRight: 5}}
      />
      
    </>
  )
};


const styles = {
  button: {
    backgroundColor: Colors.green,
    border: Colors.green,
    color: "white"
  },
  selectBatchAndMailButton: {
    marginTop: 10,
    margin: 10,
    display: 'flex',
    justifyContent: 'space-between'
  }
}

export default DiplomaListScreen;


// REGLER LE FILTRAGE DU STATUS ET LA SELECTION DES ROW
