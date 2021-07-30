import React, {useState, useEffect} from 'react'
import { Button, Breadcrumb, Input, message } from 'antd';
import 'antd/dist/antd.css'
import { useSelector } from 'react-redux';

import colors from '../helpers/colors'
import Navbar from './Navbar'
import ToolBox from "./template/ToolBox"
import Displayer from "./template/Displayer"

export default function TemplateCreator() {
  const templateElements = useSelector(state => state.templateElements)
  const requiredElements = useSelector(state => state.requiredElements)
  const [school_id, setSchool_id] = useState("");
  useEffect(() => {
    const school_id = "6101c0b6208679b2ab7f0884"
    // const school_id = window.localStorage.getItem('school_id')
    setSchool_id(school_id)
  }, []);
  
  const [template_name, setTemplate_name] = useState("");
  
  const handleSubmit = async () => {
    const checkBackground = templateElements.findIndex(e => e.type === "imageBackground") >= 0
    const checkFirstname = requiredElements.findIndex(e => e.value === "firstname") >= 0
    const checkLastname = requiredElements.findIndex(e => e.value === "lastname") >= 0
    const checkYear = requiredElements.findIndex(e => e.value === "year") >= 0
    const checkRequired = checkFirstname && checkLastname && checkYear

    if(template_name === "") {
      message.error("Merci d'indiquer un nom pour votre template 😇")
    }else if(!checkBackground){
      message.error("Merci d'ajouter un fond, c'est quand même plus joli 🤗")
    }else if(!checkRequired){
      message.error("Le prénom et nom de l'élève, ainsi que son année sont requis 🤓")
    }else{
      const template = {
        template_name: template_name,
        firstname_field: false,
        lastname_field: false,
        birth_date_field: false,
        curriculum_field: false,
        promo_field: false,
        year_field: false,
        background_image_field: false,
        mention_field: false,
        static_fields: []
      }
      const elements = templateElements.map(element => {
        return { type: element.type, ...element.element }
      })
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if(element.type !== 'dynamic' && element.type !== "imageBackground"){
          delete element.name
          template.static_fields.push(element)
        }else if(element.type === "imageBackground") {
          template.background_image_field = element
        }else{
          element.type = "text"
          for (const key in template) {
            if (Object.hasOwnProperty.call(template, key) && key.includes(element.name)) {
              template[key] = element
            }
          }
        }
      }
      
      const request = await fetch(`/templates/create/${school_id}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(template)
      })
      const response = await request.json()
      if(response.result){
        message.success(response.message)
      }else{
        message.error(response.error)
      }
    }
  }

  return (
    <>
      <Navbar></Navbar>
      <Breadcrumb style={{padding: "0 30px", display: "flex", alignItems: "center"}}>
        <Breadcrumb.Item>Mes templates</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Input autoFocus={template_name === "" ? true : false} placeholder="Nom de votre template" value={template_name} onChange={e => setTemplate_name(e.target.value)} bordered={false} />
        </Breadcrumb.Item>
      </Breadcrumb>
      <div style={styles.templateBackground}>
        <ToolBox />
        <Displayer />
        <Button style={styles.saveButton} onClick={handleSubmit} type="primary">Enregistrer mon template</Button>
      </div>
    </>
  )
}

const styles = {
  templateBackground:{
    backgroundColor: colors.templateBackground,
    height: 'calc(100vh - 140px)',
    padding: 30,
    position: "relative",
    overflowY: "scroll"
  },
  saveButton:{
    position: "fixed",
    bottom: 30,
    right: 30
  }
}

// var form_data = new FormData();
// const generateData = (object, prevKey) => {
//   for (const key in object) {
//     if (Object.hasOwnProperty.call(object, key)) {
//       if(typeof object[key] === "object" && key === "firstname_field"){
//         generateData(object[key], key)
//       }else{
//         const goodKey = prevKey || key
//         if(prevKey){
//           console.log(`prevKey`, prevKey)
//           form_data[prevKey].append(key, object[key])
//         }else{
//           form_data.append(goodKey, object[key])
//         }
//       }
//     }
//   }
// }
// generateData(template)

// for (const key in template) {
//   if (Object.hasOwnProperty.call(template, key)) {
//     console.log(`template[${key}]`, typeof template[key])
//     if(typeof template[key] === "object"){
//       form_data.append(key, template[key])
//     }else{
//       form_data.append(key, template[key])
//     }
//   }
// }
// for (var key of form_data.entries()) {
//   console.log(key);
// }
// const request = await fetch('/templates/create', {
//   method: 'POST',
//   body: form_data
// })
