// nb: here 'fields' are related to the template and 'headers' are related to the CSV files
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Navbar from './Navbar';
import { Redirect } from 'react-router-dom';

import { status } from '../helpers/status';

import { Select, Typography, Button } from 'antd';
const { Option } = Select;
const { Title } = Typography;

// intégralité des fields relatifs au students, attendu par un template.
const studentDataToMatch = ['firstname_field', 'lastname_field', 'birth_date_field', 'mention_field', 'email']

const ImportConfigScreen = () => {
  const [schoolId, setSchoolId] = useState('');

  const [headers, setHeaders] = useState([]);
  const [studentList, setStudentList] = useState([]);

  const [fieldHumanNames, setFieldHumanNames] = useState({});   // object fieldname <=> humane field name. Par ex: {firstname_field:'prénom', ....}
  const [selectOptions, setSelectOptions] = useState([]);       // list of headers that are not selected yet
  const [matchings, setMatchings] = useState({});               // object fieldname <=> header

  const [batchList, setBatchList] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');

  const [redirection, setRedirection] = useState(false);
  
  const list = useSelector(state => state.studentList);
  
  
  // Récupérer les headers et les données des étudiants du CSV
  useEffect(() => {
    setHeaders(list.data[0]);
    setStudentList(list.data.splice(1));
  },[list]);

  useEffect(() => {
    //const schoolId = '6101084673a5f1dcafefa064';
    const schoolId = window.localStorage.getItem('school_id');
    setSchoolId(schoolId);
    const fetchBatches = async () => {
      const rawData = await fetch(`/batch?school_id=${schoolId}`);
      const response = await rawData.json();
      setBatchList(response.batches);
    };
    fetchBatches();
  },[])
  //console.log('batches: ', batchList);
  
  // A la séléction du batch: 
  //  on initialise les options de select avec les headers,
  //  on mémorise le choix dans un état, 
  //  on récupère le template de la DB, on en déduit les fields attendus et on crée un "dictionnaire" field <=> humanFieldNames que l'on stocke dans un état
  const onBatchChange = async (batchId) => {
    // METTRE EN PLACE MECANIQUE POUR VIDER LES CHAMPS (car si les select sont remplis et que le batch est modifier, il est possible qu'un header soit attribué a 2 fields)
    setSelectOptions(headers);
    const selected = batchList.filter(bach => bach._id === batchId)[0];
    setSelectedBatch(selected);
    //console.log('SELECTED: ',selected);
    const rawData = await fetch(`/template?school_id=${schoolId}&template_name=${selected.templateName}`);
    const data = await rawData.json();
    const templateFromDB = data.template;
    //console.log('templateFromDB: ', templateFromDB);
    // le field email est entré en dur, car nécessaire mais non demandé pour le template.
    const tempHumanNames = {'email': 'email'};
    studentDataToMatch.slice(0, -1).forEach(field => {
      if (templateFromDB[field]) {
        tempHumanNames[field] = templateFromDB[field]['name'];
      }
    })
    //console.log('tempHuman: ', tempHumanNames);
    setFieldHumanNames(tempHumanNames)
  }

  const onValidButton = () => {
    // création d'un 'dictionnaire' field <=> index des headers
    let fieldToIndexMapping = {};
    Object.keys(fieldHumanNames).forEach(field => {
      fieldToIndexMapping[field] = headers.indexOf(matchings[field]);
    });
    //console.log('Mapping: ', fieldToIndexMapping);

    // Mise en forme des données et envoi de la DB
    studentList.forEach( async (student) => {
      const dataStudent = {
        email: student[fieldToIndexMapping.email],
        firstname: student[fieldToIndexMapping.firstname_field],
        lastname: student[fieldToIndexMapping.lastname_field],
        birth_date: student[fieldToIndexMapping.birth_date_field],
        diplomas: [{
          url_SmartContract: null,
          mention: student[fieldToIndexMapping.mention_field],
          id_batch: selectedBatch._id,
          status: status.not_confirmed
        }]
      } 

      const resultRaw = await fetch('/post-csv-import', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataStudent)
      })
      const result = await resultRaw.json();
      //console.log('result: ', result);

      if (!result.success){
        console.log('Error: ', result.message);
      } else {
        setRedirection(true);
      }
    })
  }

  const batchesOptions = batchList.map((batch, i) => {
    return <Option key={i} value={batch._id}>{`${batch.curriculum} - ${batch.year}`}</Option>
  })

  const onSelectChange = (field, header) => {
    // copy the states to be able to work on
    const selectOptionsCopy = selectOptions.filter(opt => opt !== header);  
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
    FieldSelect = Object.keys(fieldHumanNames).map((field, i) => {
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
                onChange={(header) => onSelectChange(field, header)}
              >
                {options}
              </Select>
            </div>
    })
  }
  

  return (
    <div>
      {
        redirection && <Redirect to='/diploma-list' />
      }
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
        disabled={selectedBatch === '' || Object.keys(matchings).length !== Object.keys(fieldHumanNames).length}
        onClick={onValidButton}
      >Valider</Button>

    </div>


  )
}

// DISABLED LE BUTTON VALIDER QUAND AUCUN BATCH SELECTIONNER
// PRESENTATION SOUS FORME DE TABLEAU PLUS CLAIRE??

export default ImportConfigScreen;
