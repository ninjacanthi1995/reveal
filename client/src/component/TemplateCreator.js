import React, {useState, useEffect} from 'react'
import { Button, Breadcrumb, Input, message } from 'antd';
import 'antd/dist/antd.css'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from "react-router-dom"

import colors from '../helpers/colors'
import Navbar from './Navbar'
import ToolBox from "./template/ToolBox"
import Displayer from "./template/Displayer"

export default function TemplateCreator() {
  let history = useHistory();
  const dispatch = useDispatch()
  const templateElements = useSelector(state => state.templateElements)
  const requiredElements = useSelector(state => state.requiredElements)
  const [isLoading, setIsLoading] = useState(false);
  
  const {template_name_params} = useParams()
  const [school_id, setSchool_id] = useState("");
  const [template_name, setTemplate_name] = useState("");
  useEffect(() => {
    const school_id = window.localStorage.getItem('school_id')
    setSchool_id(school_id)
    // Check if a specific template is required and go look for it in db
    if(school_id && template_name_params){
      const getTemplate = async () => {
        const request = await fetch(`/templates/get/${school_id}/${template_name_params}`)
        const response = await request.json()
        if(response.result) {
          setTemplate_name(response.template.template_name)
          dispatch({type: 'loadTemplate', payload: response.template})
          dispatch({type: 'loadRequiredElements', payload: response.template})
        }
      }
      getTemplate()
    }
    // clear reducers when the templateCreator is left.
    return () => {
      dispatch({type: "clearTemplate"})
      dispatch({type: "clearRequiredElements"})
    }
  }, [template_name_params, dispatch]);
  
  
  
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
      setIsLoading(true)
      if(!isLoading){
        const displayer = document.getElementById('displayer')
        const template = {
          template_name: template_name,
          template_dimensions: {width: displayer.offsetWidth, height: displayer.offsetHeight},
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
            delete element.dynamicValue
            delete element.name
            template.static_fields.push(element)
          }else if(element.type === "imageBackground") {
            template.background_image_field = element
          }else{
            element.type = "text"
            for (const key in template) {
              if (Object.hasOwnProperty.call(template, key) && key.includes(element.dynamicValue)) {
                delete element.dynamicValue
                template[key] = element
              }
            }
          }
        }

        const request = await fetch(`/templates/create/${school_id}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            update: template_name_params ? true : false,
            template
          })
        })
        const response = await request.json()
        if(response.result){
          message.success(response.message)
          setIsLoading(false)
          if(!response.update) history.push("/")
        }else{
          message.error(response.error)
          setIsLoading(false)
        }
      }
    }
  }

  return (
    <>
      <Navbar></Navbar>
      <Breadcrumb style={{padding: "0 30px", display: "flex", alignItems: "center"}}>
        <Breadcrumb.Item style={{cursor: "pointer"}} onClick={()=> history.push('/template-management')}>
          Mes templates
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Input 
            autoFocus={template_name === "" && !template_name_params ? true : false} 
            placeholder="Nom de votre template" 
            value={template_name} 
            disabled={template_name_params ? true : false }
            onChange={e => setTemplate_name(e.target.value)} 
            bordered={false} />
        </Breadcrumb.Item>
      </Breadcrumb>
      <div style={styles.templateBackground}>
        <ToolBox />
        <Displayer />
        <Button loading={isLoading} style={styles.saveButton} onClick={handleSubmit} type="primary">{template_name_params ? 'Mettre à jour' : 'Enregistrer mon template'}</Button>
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