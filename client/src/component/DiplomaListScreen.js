import React, { useState, useEffect } from 'react';

import Navbar from './Navbar';
import { Table } from 'antd';

import { statusFilters } from '../helpers/status';

import { Select, Typography } from 'antd';
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






const DiplomaListScreen = () => {
  const now = new Date();
  const [optionsYear, setOptionsYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  //const [schoolId, setSchoolId] = useState('');
  const [data, setData] = useState([]);
  const [filtersCurriculum, setFiltersCurriculum] = useState([]);
  const [filtersPromo, setFiltersPromo] = useState([]);
  
  const columns = [
    {
      title: 'Curriculum',
      dataIndex: 'curriculum',
      filters: filtersCurriculum,
      onFilter: (value, record) => record.curriculum.includes(value),
    },
    {
      title: 'Promo',
      dataIndex: 'promo',
      filters: filtersPromo,
      onFilter: (value, record) => record.promo.includes(value),
      
    },
    {
      title: 'Nom',
      dataIndex: 'lastname',
      defaultSortOrder: ['ascend'],
      sorter: {
        compare: (a, b) => a.lastname.localeCompare(b.lastname),
        multiple: 2
      },
    },
    {
      title: 'Prénom',
      dataIndex: 'firstname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      defaultSortOrder: 'descend',
      sorter: {
        compare: (a, b) => a.email.localeCompare(b.email),
        multiple: 1
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: statusFilters,
      onFilter: (value, record) => record.status.includes(value)
    }
  ];
  
  
  
  useEffect(() => {
    //const schoolId = '6101084673a5f1dcafefa064';
    const schoolId = window.localStorage.getItem('school_id');
    //setSchoolId(schoolId);

    const fetchBatches = async () => {
      const rawData = await fetch(`/batch?school_id=${schoolId}`);
      const response = await rawData.json();
      
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
      const schoolId = window.localStorage.getItem('school_id');  // nécessaire pour avoir schoolId au 1er render (pas commode de le stoker dans un useState)
      const rawData = await fetch(`/batches-populated?schoolId=${schoolId}&year=${selectedYear}`);
      const data = await rawData.json();
      const batchesOfYearWithStudents = data.batchesOfYearWithStudents;
      //console.log('populated: ', batchesOfYearWithStudents);
/*       const batchesOfYearWithStudents = [
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
      ]; */
      let curriculumList = [];
      let promoList = [];
      let tempData = [];
      batchesOfYearWithStudents.forEach((batch) => {
        curriculumList.push({
          text: batch.curriculum,
          value: batch.curriculum,
        });
        promoList.push({
          text: batch.promo,
          value: batch.promo,
        });
        const batchId = batch._id;
        batch.studentsId.forEach((student) => {
          student.diplomas.forEach((diploma) => {
            if (diploma.id_batch === batchId) {
              const row = {
                curriculum: batch.curriculum,
                promo: batch.promo.toString(),
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
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  
  return (
    <>
      <Navbar/>
      <Title 
        level={4}
        style={{marginLeft: 5, marginTop: 10}}
      >Séléctionner l'année: 
        <Select
          defaultValue={now.getFullYear()}
          style={{width:100, marginLeft: 10}}
          onChange={(year) => {setSelectedYear(year)}}
        >
          {optionsYear}
        </Select>
      </Title>
      <Table 
        columns={columns} 
        dataSource={data}
        pagination={false}
        onChange={onChange} 
        rowSelection={{...rowSelection}}
        scroll={{y: 200}}               // A AFFINER - le plus grand possible
        style={{marginLeft: 5, marginRight: 5}}
      />
    </>
  )
};

export default DiplomaListScreen;


// REGLER LE FILTRAGE DU STATUS ET LA SELECTION DES ROW