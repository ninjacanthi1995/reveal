const requiredReducer = (requiredElements = [], action) => {
  if (action.type === 'addRequiredElement'){
    return [...requiredElements, action.payload];
  } else if (action.type === 'deleteRequiredElement'){
    return requiredElements.filter(e => !action.value.includes(e.title));
  } else {
    return requiredElements;
  }
}

export default requiredReducer