// nb: here 'fields' are related to the template and 'headers' are related to the CSV files
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Navbar from './Navbar';

import exempleTemplatesFromDB from '../helpers/exampleDeRetourDB-templates';
import exempleBatchsFromDB from '../helpers/exampleDeRetourDB-batches';

import Status from '../helpers/status';

import { Select, Typography, Button } from 'antd';
const { Option } = Select;
const { Title } = Typography;

const studentDataToMatch = ['firstname_field', 'lastname_field', 'bitrh_date_field', 'email']

const ImportConfigScreen = () => {
  const [headers, setHeaders] = useState([]);
  const [studentList, setStudentList] = useState([]);
  //const [template, setTemplate] = useState({});
  const [fieldHumanNames, setFieldHumanNames] = useState({});   // object fieldname <=> humane field name. Par ex: {firstname_field:'prénom', ....}
  const [selectOptions, setSelectOptions] = useState([]);       // list of headers that are not selected yet
  const [matchings, setMatchings] = useState({});               // object fiedname <=> header

  const [batchList, setBatchList] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  
  const list = useSelector(state => state.studentList);
  
  
  // Récupérer les headers du CSV, les données des étudiants et les batches de l'école
  useEffect(() => {
    //console.log('list: ', list);
    setHeaders(list.data[0]);
    setSelectOptions(list.data[0]);
    setStudentList(list.data.splice(1));
    const batchsFromDB = exempleBatchsFromDB       // A RECUP DANS LA DB
    setBatchList(batchsFromDB);
  },[list])
  
  
  // A la séléction du template du diplome: on mémorise le choix dans un état, on récupère les fields attendu par ce template et on le stocke dans un etat
  const onBatchChange = (value) => {
    setSelectedBatch(value);
    const templateFromDB = exempleTemplatesFromDB[0]       // A RECUP DANS LA DB QUAND ELLE SE SERA IMPLEMENTE OU recup dans School si déjà importée
    //setTemplate(templateFromDB);
    const tempHumanNames = {'email': 'email'};
    studentDataToMatch.slice(0, -1).forEach(field => {
      tempHumanNames[field] = templateFromDB[field]['name'];
    })
    //onsole.log('tempHuman: ', tempHumanNames);
    setFieldHumanNames(tempHumanNames)
  }

  const onValidButton = () => {
    //console.log('Validé!!!');
    let fieldToIndexMapping = {};
    studentDataToMatch.forEach(field => {
      fieldToIndexMapping[field] = headers.indexOf(matchings[field]);
    });
    //console.log('Mapping: ', fieldToIndexMapping);

    studentList.forEach(student => {
      // AVANT rechercher si student existe dans la DB
      const dataStudent = {
        email: student[fieldToIndexMapping.email],
        firstname: student[fieldToIndexMapping.firstname_field],
        lastname: student[fieldToIndexMapping.lastname_field],
        birth_date: student[fieldToIndexMapping.birth_date_field],
        diplom_student: []
      } 
      // SAUVER Ou Update le student

      const newDiplom = {
        url_SmartContract: null,
        mention: null,
        id_batch: selectedBatch.id,
        status: Status.not_confirmed
      }

      // AJOUTER LE newDiplom comme sous doc au student DANS LA DB
      dataStudent.diplom_student.push(newDiplom);
      console.log('DATA STUDENT ENVOY2 DANS LA DB: ', dataStudent);
    })
  }

  const batchesOptions = batchList.map((batch, i) => {
    return <Option key={i} value={batch.id}>{`${batch.cursus} - ${batch.year}`}</Option>
  })

  
  //console.log('OPTIONS: ', batchesOptions);

  const selectChange = (field, header) => {
    const selectOptionsCopy = selectOptions.filter(opt => opt !== header);  // copy the states to work on
    const matchingsCopy = {...matchings};

    if (matchings[field]){
      const previousHeader = matchings[field];  // save the previous header to put it back in options
      selectOptionsCopy.push(previousHeader);
    } 

    matchingsCopy[field] = header;              // updating the match
    setMatchings(matchingsCopy);                // save work in states
    setSelectOptions(selectOptionsCopy);
  }
  //console.log('matchings: ', matchings);

  let FieldSelect = [];
  if (selectedBatch !== ''){
    FieldSelect = studentDataToMatch.map((field, i) => {
      //console.log('template field: ', template[field]);
      const options = selectOptions.map((header, j) => {
        return <Option key={j} value={header}>{header}</Option>
      })
      return <div key={i}>
              <Title level={4}>Correspondance csv pour {fieldHumanNames[field]}:</Title>
              <Select
                showSearch
                style={{ width: 400 }}
                placeholder={`correspondance dans le fichier CSV pour ${fieldHumanNames[field]}`}
                onChange={(header) => selectChange(field, header)}
              >
                {options}
              </Select>
            </div>
    })
  }
  

  return (
    <div>
      <Navbar></Navbar>
      <Title>Choisissez un batch:</Title>
      <Select
        showSearch
        style={{ width: 250 }}
        placeholder="Sélectionner un batch"
        onChange={onBatchChange}
      >
        {batchesOptions}
      </Select>

      {FieldSelect}

      <Button
        type="primary"
        disabled={Object.keys(matchings).length !== studentDataToMatch.length}
        onClick={onValidButton}
      >Valider</Button>

    </div>


  )
}

// RESTE A HANDLE LE BOUTON VALIDé >  envoi à la DB
// PRESENTATION SOUS FORME DE TABLEAU PLUS CLAIRE??

export default ImportConfigScreen;
