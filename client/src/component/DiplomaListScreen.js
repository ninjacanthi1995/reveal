import React, { useState, useEffect } from 'react';

import Navbar from './Navbar';
import { Table } from 'antd';

import { statusFilters } from '../helpers/status';

import { Select, Typography, Button } from 'antd';
const { Option } = Select;
const { Title } = Typography;





/* const data = [
  {
    key: '1',
    curriculum: 'John Brown',
    promo: 32,
    lastname: 'New York No. 1 Lake Park',
    firstname: 32,
    email: 32,
    status: 32
  },
]; */



function onChange(pagination, filters, sorter, extra) {
  console.log('params', pagination, filters, sorter, extra);
}

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};


const DiplomaListScreen = () => {
  const now = new Date();
  const [optionsYear, setOptionsYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [batchList, setBatchList] = useState([]);
  const [schoolId, setSchoolId] = useState('');
  const [data, setData] = useState([]);
  const [filtersCurriculum, setFiltersCurriculum] = useState([]);

  const columns = [
    {
      title: 'Curriculum',
      dataIndex: 'curriculum',
      defaultSortOrder: 'descend',
      filters: filtersCurriculum
      
    },
    {
      title: 'Promo',
      dataIndex: 'promo',
      filters: [
        {
          text: 'London',
          value: 'London',
        },
        {
          text: 'New York',
          value: 'New York',
        },
      ],
      onFilter: (value, record) => record.address.indexOf(value) === 0,
    },
    {
      title: 'Nom',
      dataIndex: 'lastname',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Prénom',
      dataIndex: 'firstname',
      defaultSortOrder: 'descend',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: statusFilters
    }
  ];
  


  useEffect(() => {
    const schoolId = '6101084673a5f1dcafefa064';
    //const schoolId = window.localStorage.getItem('school_id');    // DECOMMENTER QUAND LOCALSTORE FONCTIONNEL
    setSchoolId(schoolId);

    

    const fetchBatches = async () => {
      const rawData = await fetch(`/batch?school_id=${schoolId}`);
      const response = await rawData.json();
      setBatchList(response.batches);

      let batchYears = response.batches.map(batch => batch.year);
      batchYears = [...new Set(batchYears)];      //[...new Set(array)] sert à retirer les year en doublon
      batchYears = batchYears.sort();
      const yearOpt = batchYears.map((year, i) => {
        return <Option key={i} value={year}>{year}</Option>
      })
      setOptionsYear(yearOpt);
    };
    fetchBatches();
  }, []);
  //console.log('batches: ', batchList);
  //console.log('OptionsYear: ', optionsYear);

  useEffect(() => {
    const getData = async () => {
      //const rawData = await fetch(`/batches-populated?schoolId=${schoolId}&year=${selectedYear}`);
      //const data = await rawData.json();
      //const batchesOfYearWithStudents = data.batchesOfYearWithStudents;
      //console.log('populated: ', batchesOfYearWithStudents);
      const batchesOfYearWithStudents = [
        {
          _id:'6101c206564b97b34f9e16ea',
          year: 2021,
          curriculum: 'BTS mécanique',
          promo: 17,
          schoolId: '6101c0b6208679b2ab7f0884',
          template_name: 'BTS méca',
          studentsId:[
            {
              _id:'sss1c0b6208679b2ab7f0884',
              email: 'a@a.a',
              firstname: 'Emilien',
              lastname: 'Dreyer',
              birth_date: '06/05/1982',
              diplomas: [
                {
                  url_SmartContract: null,
                  mention: null,
                  status: 'non confirmé',
                  id_batch: '6101c206564b97b34f9e16ea'
                }
              ]
            },
            {
              _id:'sss1c0b6208679b2ab7f0885',
              email: 'b@b.b',
              firstname: 'Marty',
              lastname: 'Mac Fly',
              birth_date: '10/11/1992',
              diplomas: [
                {
                  url_SmartContract: null,
                  mention: 'Trés bien',
                  status: 'non confirmé',
                  id_batch: '6101c206564b97b34f9e16ea'
                }
              ]
            }
          ]
        },
        {
          _id:'61015592b527c72f100f7483',
          year: 2021,
          curriculum: 'BEP comptabilité',
          promo: 9,
          schoolId: '6101c0b6208679b2ab7f0884',
          template_name: 'BEP compta',
          studentsId:[
            {
              _id:'sss1c0b6208679b2ab7f0886',
              email: 'c@c.c',
              firstname: 'Leonard',
              lastname: 'DeVinci',
              birth_date: '22/03/1856',
              diplomas: [
                {
                  url_SmartContract: null,
                  mention: null,
                  status: 'non confirmé',
                  id_batch: '61015592b527c72f100f7483'
                }
              ]
            },
            {
              _id:'sss1c0b6208679b2ab7f0887',
              email: 'e@e.e',
              firstname: 'Jean',
              lastname: 'Dujardin',
              birth_date: '01/01/1971',
              diplomas: [
                {
                  url_SmartContract: null,
                  mention: 'Bien',
                  status: 'non confirmé',
                  id_batch: '61015592b527c72f100f7483'
                }
              ]
            }
          ]
        }
      ];
      let curriculumList = [];
      let tempData = [];
      batchesOfYearWithStudents.forEach((batch) => {
        curriculumList.push({
          text: batch.curriculum,
          value: batch.curriculum,
        });
        const batchId = batch._id;
        batch.studentsId.forEach((student) => {
          student.diplomas.forEach((diploma) => {
            if (diploma.id_batch === batchId) {
              const row = {
                curriculum: batch.curriculum,
                promo: batch.promo,
                lastname: student.lastname,
                firstname: student.firstname,
                email: student.email,
                status: diploma.status
              }
              tempData.push(row);
            }
          })
        })
      });
      setFiltersCurriculum(curriculumList);
      setData(tempData);
    };
    getData();
  }, [selectedYear])


  return (
    <>
      <Navbar/>
      <Title level={4}>Séléctionner l'année: 
        <Select
          defaultValue={now.getFullYear()}
          style={{width:100}}
          onChange={(year) => {setSelectedYear(year)}}
        >
          {optionsYear}
        </Select>
      </Title>
      <Table 
        columns={columns} 
        dataSource={data} 
        onChange={onChange} 
        rowSelection={{ ...rowSelection }}
        scroll={{y: 200}}               // A AFFINER - le plus grand possible
      />
    </>
  )
};

export default DiplomaListScreen;