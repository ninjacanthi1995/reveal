import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Select, Typography, Button } from 'antd';
const { Option } = Select;
const { Title } = Typography;


const ImportconfigScreen = () => {
  const [templateName, setTemplateName] = useState(false);
  const [templateFields, setTemplateFields] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [templatesAvailable, setTemplatesAvailable] = useState([]);
  
  const list = useSelector(state => state.studentList);
  
  
  // Récupérer les headers du CSV, les données des étudiants et les templates de l'école
  useEffect(() => {
    setHeaders(list.data[0]);
    setStudentList(list.data.splice(1))
    const templatesFromDB = ['Bac', 'BTS', 'BEP'];  // A RECUP DANS LA DB QUAND ELLE SE SERA IMPLEMENTE
    setTemplatesAvailable(templatesFromDB);
  },[])
  
  
  // A la séléction du template du diplome: on mémorise le choix dans un état, on récupère les fields attendu par ce template et on le stocke dans un etat
  const onDiplomChange = (value) => {
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

  const FieldSelect = templateFields.map((field, i) => {
    const options = headers.map((header, j) => {
      return <Option key={j} value={j}>{header}</Option>
    })
    return <div>
            <Title level={4}>Correspondance csv pour {field}:</Title>
            <Select
              key={i}
              showSearch
              style={{ width: 200 }}
              placeholder={`correspondance dans le fichier CSV pour ${field}`}
            >
              {options}
            </Select>
          </div>
  })

  

  return (
    <div>
      <Title>Choisissez un dîplome:</Title>
      <Select
        showSearch
        disabled={templateName}
        style={{ width: 250 }}
        placeholder="Sélectionner un template"
        onChange={onDiplomChange}
      >
        {templateOptions}
      </Select>

      {FieldSelect}
      
      <Button
        type="primary"
        disabled={false}
        onClick={onValidButton}
      >Valider</Button>

    </div>


  )
}

export default ImportconfigScreen;