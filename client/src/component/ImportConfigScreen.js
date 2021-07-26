import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Navbar from './Navbar';

import { Select, Typography, Button } from 'antd';
const { Option } = Select;
const { Title } = Typography;


const ImportConfigScreen = () => {
  const [templateName, setTemplateName] = useState(false);
  const [templateFields, setTemplateFields] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [templatesAvailable, setTemplatesAvailable] = useState([]);
  const [selectOptions, setSelectOptions] = useState([]);
  const [matchings, setMatchings] = useState({});
  
  const list = useSelector(state => state.studentList);
  
  
  // Récupérer les headers du CSV, les données des étudiants et les templates de l'école
  useEffect(() => {
    //console.log('list: ', list);
    setHeaders(list.data[0]);
    setSelectOptions(list.data[0]);
    setStudentList(list.data.splice(1))
    const templatesFromDB = ['Bac', 'BTS', 'BEP'];  // A RECUP DANS LA DB QUAND ELLE SE SERA IMPLEMENTE
    setTemplatesAvailable(templatesFromDB);
    // + récup l'ID du diplôme????
  },[])
  
  
  // A la séléction du template du diplome: on mémorise le choix dans un état, on récupère les fields attendu par ce template et on le stocke dans un etat
  const onDiplomChange = (value) => {
    console.log('Values: ', value);
    setTemplateName(value);
    const templateFieldFromDB = ['nom', 'prénom', 'naissance', 'téléphone'];  // A RECUP DANS LA DB QUAND ELLE SE SERA IMPLEMENTE Ou dans object si tout les templates ont été entièrement importés
    templateFieldFromDB.push('email');
    setTemplateFields(templateFieldFromDB);
  }

  const onValidButton = () => {
    console.log('Validé!!!')
  }

  const templateOptions = templatesAvailable.map((template, i) => {
    return <Option key={i} value={template}>{template}</Option>
  })

  
  //console.log('OPTIONS: ', templateOptions);

  const selectChange = (field, header) => {
    const selectOptionsCopy = selectOptions.filter(opt => opt !== header);  // copy the states to work on
    const matchingsCopy = {...matchings};

    if (matchings[field]){
      const previousHeader = matchings[field];  // save the previous header to put it back in options
      selectOptionsCopy.push(previousHeader);
      matchingsCopy[field] = header;            // updating the match
    } else {
      matchingsCopy[field] = header;
    }

    setMatchings(matchingsCopy);                // save work in states
    setSelectOptions(selectOptionsCopy);
  }


  const FieldSelect = templateFields.map((field, i) => {
    const options = selectOptions.map((header, j) => {
      return <Option key={j} value={header}>{header}</Option>
    })
    return <div key={i}>
            <Title level={4}>Correspondance csv pour {field}:</Title>
            <Select
              showSearch
              style={{ width: 400 }}
              placeholder={`correspondance dans le fichier CSV pour ${field}`}
              onChange={(header) => selectChange(field, header)}
            >
              {options}
            </Select>
          </div>
  })

  

  return (
    <div>
      <Navbar></Navbar>
      <Title>Choisissez un dîplome:</Title>
      <Select
        showSearch
        style={{ width: 250 }}
        placeholder="Sélectionner un template"
        onChange={onDiplomChange}
      >
        {templateOptions}
      </Select>

      {FieldSelect}

      <Button
        type="primary"
        disabled={Object.keys(matchings).length !== templateFields.length}
        onClick={onValidButton}
      >Valider</Button>

    </div>


  )
}

export default ImportConfigScreen;


// RESTE A HANDLE LE BOUTON VALIDé > Mettre en forme les données (fusion des matchings) + envoi à la DB
// PRESENTATION SOUS FORME DE TABLEAU PLUS CLAIRE??