import oldToNewPx from "../helpers/pxToPerCentConverter"

const templateReducer = (templateElements = [], action) => {
  if (action.type === 'addElements'){
    let element = {}
    if(action.elementType === "text"){
      element = {
        size: {width: 200, height: "unset"},
        position: {x:0, y:0},
        value: "",
        style:{
          bold: false,
          italic: false,
          underline: false,
          color: "black",
          fontSize: 14
        }
      }
    }else if(action.elementType === "image"){
      element = {
        size: {width: "unset", height: 200},
        position: {x:0, y:0},
        imagePreview: action.imagePreview
      }
    }else if(action.elementType === "dynamic"){
      element = {
        dynamicValue: action.dynamicType.value,
        name: action.dynamicType.title,
        size: {width: "unset", height: "unset"},
        position: {x:0, y:0},
        value: `{{${action.dynamicType.title}}}`,
        style:{
          bold: false,
          italic: false,
          underline: false,
          color: "black",
          fontSize: 14
        }
      }
    }else if(action.elementType === "imageBackground"){
      element = {
        size: {width: "100%", height: "100%"},
        position: {x:0, y:0},
        imagePreview: action.imagePreview,
        style:{
          // ADD OPACITY
          bgPosition: "center",
          bgSize: "cover"
        }
      }
    }else if(action.elementType === "qrCode"){
      element = {
        size: {width: 100, height: 100},
        position: {
          x:20, 
          y: action.displayer.offsetHeight - 120
        },
        imagePreview: "/qrcode_placeholder.svg",
      }
    }
    
    // Remplace le background si un BG est présent
    if(action.elementType === "imageBackground"){
      const backIndex = templateElements.findIndex(e => e.type === "imageBackground")
      if(backIndex >= 0){
        const newList = [...templateElements]
        newList.splice(backIndex, 1, {
          type: action.elementType,
          element
        })
        return newList
      }
    }


    return [...templateElements, {
      type: action.elementType,
      element
    }];
  }else if(action.type === 'updateElement'){
    const newList = [...templateElements]
    newList.splice(action.index, 1, {
      type: action.elementType,
      element: action.element
    })
    return newList
  }else if(action.type === 'deleteElement'){
    const newList = [...templateElements]
    newList.splice(action.index, 1)
    return newList
  }else if(action.type === 'clearTemplate'){
    return []
  }else if(action.type === 'loadTemplate'){
    const template = []
    const adaptElement = (element, value, title) => {
      const adaptDimensions = () => {
        templateElement.element.position = {
          x: oldToNewPx(templateElement.element.position.x, action.payload.template_dimensions, "width"),
          y: oldToNewPx(templateElement.element.position.y, action.payload.template_dimensions, "height")
        }
        templateElement.element.size = {
          width: oldToNewPx(templateElement.element.size.width, action.payload.template_dimensions, "width"),
          height: oldToNewPx(templateElement.element.size.height, action.payload.template_dimensions, "height")
        }
        if(templateElement.element.style && templateElement.element.style.fontSize){
          templateElement.element.style.fontSize = Math.floor(oldToNewPx(templateElement.element.style.fontSize, action.payload.template_dimensions, "width"))
          templateElement.element.style.height = templateElement.element.style.fontSize*2
        }
        delete templateElement.element.type
      }

      let templateElement
      if(element){
        if(value === "background_image_field" || value === "qrcode_field" || !value){
          templateElement = {type: element.type}
          templateElement.element = {...element}
          adaptDimensions()
        }else if(element){
          templateElement = {type: "dynamic"}
          templateElement.element = {...element}
          templateElement.element.dynamicValue = value
          templateElement.element.value = `{{${title}}}`
          adaptDimensions()
        }
        template.push(templateElement)
      }
    }
    for (let i = 0; i < action.payload.static_fields.length; i++) {
      const element = action.payload.static_fields[i];
      adaptElement(element)
    }
    adaptElement(action.payload.background_image_field, "background_image_field")
    adaptElement(action.payload.qrcode_field, "qrcode_field")

    adaptElement(action.payload.birth_date_field, "birth_date", "Date de naissance")
    adaptElement(action.payload.curriculum_field, "curriculum", "Cursus")
    adaptElement(action.payload.firstname_field, "firstname", "Prénom")
    adaptElement(action.payload.lastname_field, "lastname", "Nom")
    adaptElement(action.payload.mention_field, "mention", "Mention")
    adaptElement(action.payload.promo_field, "promo", "Promo")
    adaptElement(action.payload.year_field, "year", "Année")
    return template
  } else {
    return templateElements;
  }
}

export default templateReducer