export default (templateElements = [], action) => {
  if (action.type === 'addElements'){
    return [...templateElements, {
      type: action.elementType,
      size: {width: 200, height: "unset"},
      position: {x:0, y:0}
    }];
  } else {
    return templateElements;
  }
}