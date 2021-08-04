import React, { useState, useEffect } from 'react';

import Navbar from './Navbar';

import { Table, Button, Modal, Input, message } from 'antd';


import { status, statusFilters } from '../helpers/status';
import Colors from '../helpers/colors';
import emailFetcher from '../helpers/emailFetcher';


import { Select, Typography } from 'antd';
const { Option } = Select;
const { Title } = Typography;


const DiplomaListScreen = () => {
  const now = new Date();
  const [optionsYear, setOptionsYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [dataRefresher, setDataRefresher] = useState(0);  // utile pour rafraichir les status après l'envoi des emails
  //const [schoolId, setSchoolId] = useState('');
  const [data, setData] = useState([]);
  const [missingData, setMissingData] = useState(false);
  const [filtersCurriculum, setFiltersCurriculum] = useState([]);
  const [filtersPromo, setFiltersPromo] = useState([]);
  const [selectedDiplomas, setSelectedDiplomas] = useState([]);

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editedRow, setEditedRow] = useState({});
  const [displayAlert, setDisplayAlert] = useState('none');


  // Modal helpers:
  const handleOk = async () => {
    setConfirmLoading(true);
    // data preparation
    const tempData = [...data];
    const tempRow = {...editedRow};
    tempRow.status = status.not_mailed;
    const editedIndex = tempData.findIndex(row => row.key === editedRow.key);
    tempData[editedIndex] = tempRow;

    // update in DB
    const updatedRaw = await fetch('/update-student', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(tempRow)
    });
    const updated = await updatedRaw.json();

    if (!updated.result){
      message.error(updated.message)
      setConfirmLoading(false);
      return;
    }

    // update data (will update Table)
    setData(tempData);
    message.success("Les informations de l'étudiant ont été modifié.");

    setVisible(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setVisible(false);
    message.warning("Modifications annulées.");
  };


  const openModal = (record) => {
    if (record.status === status.confirmed) {
      message.warning("impossible de modifié un étudiant avec le statut 'confirtmé'.")
      return;
    }
    setEditedRow(record);
    setVisible(true);
  }


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
                key: `b${i}s${j}d${k}`,
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
              if (diploma.status === status.missing_data) {
                setDisplayAlert('inline');
              }
            }
          })
        })
      });
      setFiltersCurriculum(curriculumList);
      setFiltersPromo(promoList);
      setData(tempData);
    };
    getData();
  }, [selectedYear, dataRefresher])


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
          onClick={ async () => {
            const result = await emailFetcher(selectedDiplomas);
            if (result.notSent){
              message.error(`${result.notSent} emails n'ont pas été envoyé. Sur un total de ${result.total}. Voir les status.`)
            } else {
              message.success("Tous les emails ont été envoyé avec succés.")
            }

            setDataRefresher(dataRefresher + 1);
          }}
        >Envoyer les mails</Button>
      </div>
      <div style={styles.infoAndAlert}>
        <span style={styles.info} > - Editez un étudiant en double cliquant dessus - </span>
        <span style={{...styles.alert, display:displayAlert}}>Attention, il y des status 'données incomplètes'</span>
      </div>
      <Table 
        columns={columns} 
        dataSource={data}
        pagination={false}
        onChange={onChange} 
        rowSelection={{...rowSelection}}
        scroll={{y: 600}}               // A AFFINER - le plus grand possible
        style={{marginLeft: 5, marginRight: 5}}
        onRow={(record, rowIndex) => {
        return{
          onDoubleClick: () => openModal(record)
        }}
      }
      />
      <Modal
        title="Editer les informations:"
        visible={visible}
        onOk={handleOk}
        okText='Enregistrer'
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        cancelText='Annuler'
        maskClosable={false}
      >
        <table>
          <tr>
            <td>Nom: </td>
            <td>
              <Input 
                value={editedRow.lastname}
                onChange={e => {
                  const tempRow = {...editedRow}
                  tempRow.lastname = e.target.value;
                  setEditedRow(tempRow);
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Prénom: </td>
            <td>
              <Input 
                value={editedRow.firstname}
                onChange={e => {
                  const tempRow = {...editedRow}
                  tempRow.firstname = e.target.value;
                  setEditedRow(tempRow);
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Date de naissance: </td>
            <td>
              <Input 
                value={editedRow.birth_date}
                onChange={e => {
                  const tempRow = {...editedRow}
                  tempRow.birth_date = e.target.value;
                  setEditedRow(tempRow);
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Email: </td>
            <td>
              <Input 
                style={styles.modalInput}
                value={editedRow.email}
                onChange={e => {
                  const tempRow = {...editedRow}
                  tempRow.email = e.target.value;
                  //console.log('onchange', tempRow)
                  setEditedRow(tempRow);
                }}
              />
            </td>
          </tr>
        </table>
      </Modal>
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
  },
  modalInput: {
    width: 400
  },
  infoAndAlert:{
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  info:{
    color: Colors.gray,
    alignSelf: 'center'
  },
  alert:{
    color: 'red',
    alignSelf: 'flex-end'
  }
}

export default DiplomaListScreen;


// REGLER LE FILTRAGE DU STATUS ET LA SELECTION DES ROW
// FINIR L ALERTE POUR LES STATUS 'DONNEES MANQUANTES'