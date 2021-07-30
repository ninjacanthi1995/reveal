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
  } else {
    return templateElements;
  }
}

export default templateReducer